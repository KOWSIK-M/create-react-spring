import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generateProject(projectName, answers, targetDir) {
  try {
    console.log(chalk.yellow(`📁 Creating project ${projectName}...`));

    // Create project root
    fs.ensureDirSync(targetDir);

    // Copy Frontend -> client
    const frontendSource = path.join(
      __dirname,
      `../templates/frontend/${answers.frontend}`
    );
    const frontendDest = path.join(targetDir, "client");
    fs.copySync(frontendSource, frontendDest);
    console.log(
      chalk.blue(`   - Frontend: ${answers.frontend} -> copied to client/`)
    );

    // Process Backend -> server
    const backendTemplateName =
      answers.buildTool === "gradle"
        ? `${answers.backend}-gradle`
        : answers.backend;
    const backendSource = path.join(
      __dirname,
      `../templates/backend/${backendTemplateName}`
    );
    const backendDest = path.join(targetDir, "server");

    const artifactId = projectName; // Default artifactId to project name
    const packageName = `${answers.groupId}.${artifactId}`
      .replace(/-/g, "")
      .toLowerCase();
    const packagePath = packageName.replace(/\./g, "/");

    console.log(
      chalk.blue(
        `   - Backend: ${answers.backend} (${answers.buildTool}) -> configuring for ${packageName}...`
      )
    );

    processBackendFiles(
      backendSource,
      backendDest,
      answers,
      artifactId,
      packageName,
      packagePath
    );

    // Make mvnw/gradlew executable
    try {
      if (process.platform !== "win32") {
        if (answers.buildTool === "maven") {
          fs.chmodSync(path.join(backendDest, "mvnw"), "755");
        } else {
          fs.chmodSync(path.join(backendDest, "gradlew"), "755");
        }
      }
    } catch (e) {
      /* ignore */
    }

    // Configure database (if selected)
    if (answers.database && answers.database !== "none") {
      console.log(
        chalk.blue(
          `   - Database: ${answers.database} -> adding configuration...`
        )
      );
      configureDatabaseForProject(
        backendDest,
        answers,
        artifactId,
        packageName,
        packagePath
      );
    }

    createHelpFile(targetDir, projectName, answers, artifactId);

    console.log(chalk.green("\n✔ Project created successfully!\n"));
    printNextSteps(projectName, answers);
  } catch (error) {
    console.error(chalk.red("\n❌ An error occurred during project creation:"));
    console.error(chalk.red(error.message));

    // Cleanup
    if (fs.existsSync(targetDir)) {
      console.log(
        chalk.yellow(`\n🧹 Cleaning up partial directory: ${targetDir}...`)
      );
      try {
        fs.removeSync(targetDir);
        console.log(chalk.green("✔ Cleanup successful."));
      } catch (cleanupError) {
        console.error(
          chalk.red(
            "❌ Failed to clean up directory. Manual deletion required."
          )
        );
      }
    }
    process.exit(1);
  }
}

function processBackendFiles(
  src,
  dest,
  answers,
  artifactId,
  packageName,
  packagePath
) {
  // Recursive function to process files
  function processDirectory(src, dest) {
    fs.ensureDirSync(dest);
    const items = fs.readdirSync(src);

    for (const item of items) {
      const srcPath = path.join(src, item);
      const destPath = path.join(dest, item);
      const stat = fs.statSync(srcPath);

      if (stat.isDirectory()) {
        // Special handling for package structure
        if (
          item === "com" &&
          fs.existsSync(path.join(srcPath, "example/demo"))
        ) {
          // This is the source root 'com/example/demo'
          // We redirect it to the new package path
          const newDestPath = path.join(dest, ...packagePath.split("/"));
          // Recurse into the old 'com/example/demo' (skipping intermediate folders)
          processDirectory(path.join(srcPath, "example/demo"), newDestPath);
        } else {
          processDirectory(srcPath, destPath);
        }
      } else {
        // File processing
        let content = fs.readFileSync(srcPath, "utf-8");

        // Binary files check - comprehensive list
        const binaryExtensions = [
          "png",
          "jpg",
          "jpeg",
          "gif",
          "ico",
          "svg",
          "webp",
          "bmp", // Images
          "jar",
          "war",
          "ear",
          "class", // Java binaries
          "exe",
          "dll",
          "so",
          "dylib", // Executables/Libraries
          "zip",
          "tar",
          "gz",
          "rar",
          "7z", // Archives
          "pdf",
          "doc",
          "docx",
          "xls",
          "xlsx", // Documents
          "mp3",
          "mp4",
          "avi",
          "mov",
          "wav", // Media
          "ttf",
          "otf",
          "woff",
          "woff2",
          "eot", // Fonts
          "cmd",
          "bat", // Windows scripts (should be copied as-is)
        ];

        const ext = item.split(".").pop().toLowerCase();
        if (binaryExtensions.includes(ext)) {
          fs.copyFileSync(srcPath, destPath);
          continue;
        }

        // Replacements
        content = content
          .replace(/{{GROUP_ID}}/g, answers.groupId)
          .replace(/{{ARTIFACT_ID}}/g, artifactId)
          .replace(/{{JAVA_VERSION}}/g, answers.javaVersion)
          .replace(/{{SPRING_BOOT_VERSION}}/g, answers.springBootVersion)
          .replace(
            /JavaLanguageVersion\.of\(17\)/g,
            `JavaLanguageVersion.of(${answers.javaVersion})`
          )
          .replace(
            /<version>3\.2\.1<\/version>/g,
            `<version>${answers.springBootVersion}</version>`
          ) // Maven Spring Boot version
          .replace(
            /springBootVersion = "3\.2\.1"/g,
            `springBootVersion = "${answers.springBootVersion}"`
          ) // Gradle
          .replace(
            /<packaging>jar<\/packaging>/g,
            `<packaging>${answers.packaging}</packaging>`
          )
          .replace(/{{PACKAGE_NAME}}/g, packageName)
          .replace(/com\.example\.demo/g, packageName)
          .replace(/com\.example/g, answers.groupId) // Gradle often uses just group
          .replace(/demo/g, artifactId) // Standard gradle replace
          .replace(/group = "com.example"/g, `group = "${answers.groupId}"`); // Kotlin DSL specific

        // Add WAR support for Maven
        if (answers.packaging === "war" && item === "pom.xml") {
          const tomcatDependency = `
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-tomcat</artifactId>
			<scope>provided</scope>
		</dependency>`;
          content = content.replace(
            "</dependencies>",
            `${tomcatDependency}\n	</dependencies>`
          );
        }

        // Add database dependencies for Maven
        if (
          answers.database &&
          answers.database !== "none" &&
          item === "pom.xml"
        ) {
          let databaseDeps = `
		<!-- JPA/Database Support -->
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-data-jpa</artifactId>
		</dependency>`;

          if (answers.database === "h2") {
            databaseDeps += `
		<dependency>
			<groupId>com.h2database</groupId>
			<artifactId>h2</artifactId>
			<scope>runtime</scope>
		</dependency>`;
          } else if (answers.database === "postgresql") {
            databaseDeps += `
		<dependency>
			<groupId>org.postgresql</groupId>
			<artifactId>postgresql</artifactId>
			<scope>runtime</scope>
		</dependency>`;
          } else if (answers.database === "mysql") {
            databaseDeps += `
		<dependency>
			<groupId>com.mysql</groupId>
			<artifactId>mysql-connector-j</artifactId>
			<scope>runtime</scope>
		</dependency>`;
          }

          content = content.replace(
            "</dependencies>",
            `${databaseDeps}\n\t</dependencies>`
          );
        }

        // Add database dependencies for Gradle
        if (
          answers.database &&
          answers.database !== "none" &&
          (item === "build.gradle" || item === "build.gradle.kts")
        ) {
          const isKotlinDsl = item === "build.gradle.kts";
          let databaseDeps = "";

          if (isKotlinDsl) {
            databaseDeps = `\timplementation("org.springframework.boot:spring-boot-starter-data-jpa")\n`;
            if (answers.database === "h2") {
              databaseDeps += `\truntimeOnly("com.h2database:h2")\n`;
            } else if (answers.database === "postgresql") {
              databaseDeps += `\truntimeOnly("org.postgresql:postgresql")\n`;
            } else if (answers.database === "mysql") {
              databaseDeps += `\truntimeOnly("com.mysql:mysql-connector-j")\n`;
            }
          } else {
            databaseDeps = `\timplementation 'org.springframework.boot:spring-boot-starter-data-jpa'\n`;
            if (answers.database === "h2") {
              databaseDeps += `\truntimeOnly 'com.h2database:h2'\n`;
            } else if (answers.database === "postgresql") {
              databaseDeps += `\truntimeOnly 'org.postgresql:postgresql'\n`;
            } else if (answers.database === "mysql") {
              databaseDeps += `\truntimeOnly 'com.mysql:mysql-connector-j'\n`;
            }
          }

          content = content.replace(
            "dependencies {",
            `dependencies {\n${databaseDeps}`
          );
        }

        // Add Security dependencies for Maven
        if (answers.security && item === "pom.xml") {
          const securityDeps = `
		<!-- Spring Security -->
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-security</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.security</groupId>
			<artifactId>spring-security-test</artifactId>
			<scope>test</scope>
		</dependency>`;
          
          content = content.replace(
            "</dependencies>",
            `${securityDeps}\n	</dependencies>`
          );
        }

        // Add Security dependencies for Gradle
        if (
          answers.security &&
          (item === "build.gradle" || item === "build.gradle.kts")
        ) {
          const isKotlinDsl = item === "build.gradle.kts";
          let securityDeps = "";

          if (isKotlinDsl) {
            securityDeps = `\timplementation("org.springframework.boot:spring-boot-starter-security")\n\ttestImplementation("org.springframework.security:spring-security-test")\n`;
          } else {
            securityDeps = `\timplementation 'org.springframework.boot:spring-boot-starter-security'\n\ttestImplementation 'org.springframework.security:spring-security-test'\n`;
          }

          content = content.replace(
            "dependencies {",
            `dependencies {\n${securityDeps}`
          );
        }

        // Add WAR support for Gradle
        if (
          answers.packaging === "war" &&
          (item === "build.gradle" || item === "build.gradle.kts")
        ) {
          if (item === "build.gradle.kts") {
            content = content.replace(
              'kotlin("plugin.spring") version "2.2.21"',
              'kotlin("plugin.spring") version "2.2.21"\n	id("war")'
            );
          } else {
            content = content.replace(
              "id 'org.springframework.boot'",
              "id 'war'\n	id 'org.springframework.boot'"
            );
          }
        }

        fs.writeFileSync(destPath, content);
      }
    }
  }

  processDirectory(src, dest);

  // Create ServletInitializer for WAR packaging
  if (answers.packaging === "war") {
    createServletInitializer(dest, answers, packageName, packagePath);
  }

  // Configure Security (if selected)
  if (answers.security) {
     console.log(
        chalk.blue(
          `   - Security: enabled -> adding Spring Security...`
        )
      );
    configureSecurityForProject(dest, answers, packageName, packagePath);
  }
}

function createServletInitializer(destDir, answers, packageName, packagePath) {
  const srcDir = path.join(
    destDir,
    "src/main",
    answers.backend === "kotlin"
      ? "kotlin"
      : answers.backend === "groovy"
      ? "groovy"
      : "java",
    ...packagePath.split("/")
  );
  // Ensure directory exists (it should)
  fs.ensureDirSync(srcDir);

  let fileName =
    "ServletInitializer." +
    (answers.backend === "kotlin"
      ? "kt"
      : answers.backend === "groovy"
      ? "groovy"
      : "java");

  // Try to detect the main application class by scanning for @SpringBootApplication
  let mainClassName = "DemoApplication"; // fallback
  try {
    const files = fs.readdirSync(srcDir);
    for (const f of files) {
      const fp = path.join(srcDir, f);
      if (fs.statSync(fp).isFile()) {
        const txt = fs.readFileSync(fp, "utf8");
        if (/@SpringBootApplication/.test(txt)) {
          // find class name after 'class' keyword
          const m = txt.match(/class\s+([A-Za-z0-9_]+)/);
          if (m && m[1]) {
            mainClassName = m[1];
            break;
          }
          // java style: public class Name
          const m2 = txt.match(/public\s+class\s+([A-Za-z0-9_]+)/);
          if (m2 && m2[1]) {
            mainClassName = m2[1];
            break;
          }
        }
      }
    }
  } catch (e) {
    // keep fallback
  }
  let content = "";

  if (answers.backend === "java") {
    content = `package ${packageName};

import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

public class ServletInitializer extends SpringBootServletInitializer {

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		return application.sources(${mainClassName}.class);
	}

}
`;
  } else if (answers.backend === "kotlin") {
    content = `package ${packageName}

import org.springframework.boot.builder.SpringApplicationBuilder
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer

class ServletInitializer : SpringBootServletInitializer() {

	override fun configure(application: SpringApplicationBuilder): SpringApplicationBuilder {
		return application.sources(${mainClassName}::class.java)
	}

}
`;
  } else if (answers.backend === "groovy") {
    content = `package ${packageName}

import org.springframework.boot.builder.SpringApplicationBuilder
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer

class ServletInitializer extends SpringBootServletInitializer {

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		return application.sources(${mainClassName}.class)
	}

}
`;
  }

  if (content) {
    fs.writeFileSync(path.join(srcDir, fileName), content);
  }
}

function createHelpFile(targetDir, projectName, answers, artifactId) {
  const helpContent = `
# ${projectName}

Generated with **create-react-spring**.

## Stack
- **Client**: ${
    answers.frontend === "vite" ? "React + Vite" : "Create React App"
  }
- **Server**: Spring Boot ${answers.springBootVersion} (${answers.backend}, ${
    answers.buildTool
  })
  - **Group**: ${answers.groupId}
  - **Artifact**: ${artifactId}
  - **Java**: ${answers.javaVersion}
  - **Packaging**: ${answers.packaging.toUpperCase()}
  - **Security**: ${answers.security ? "Enabled" : "Disabled"}

## Getting Started

### Client (Frontend)
\`\`\`bash
cd client
npm install
${answers.frontend === "vite" ? "npm run dev" : "npm start"}
\`\`\`

### Server (Backend)
\`\`\`bash
cd server
${getRunCommand(answers.buildTool)}
\`\`\`
`;
  fs.writeFileSync(path.join(targetDir, "HELP.md"), helpContent);
}

function getRunCommand(buildTool) {
  if (buildTool === "gradle") {
    return process.platform === "win32"
      ? "gradlew.bat bootRun"
      : "./gradlew bootRun";
  }
  return process.platform === "win32"
    ? "mvnw.cmd spring-boot:run"
    : "./mvnw spring-boot:run";
}

function printNextSteps(projectName, answers) {
  console.log(`
Next steps:
  cd ${projectName}
  
  # Client
  cd client
  npm install
  ${answers.frontend === "vite" ? "npm run dev" : "npm start"}

  # Server
  cd ../server
  ${getRunCommand(answers.buildTool)}
`);
}

/**
 * Configure database for the project
 */
function configureDatabaseForProject(
  serverDir,
  answers,
  artifactId,
  packageName,
  packagePath
) {
  // 1. Create application.properties with database configuration
  createApplicationProperties(serverDir, answers, artifactId);

  // 2. Add sample User entity
  createSampleEntity(serverDir, answers, packageName, packagePath);

  // 3. Add sample UserRepository
  createSampleRepository(serverDir, answers, packageName, packagePath);
}

/**
 * Configure Spring Security for the project
 */
function configureSecurityForProject(
  serverDir,
  answers,
  packageName,
  packagePath
) {
  const sourceRoot =
    answers.backend === "kotlin"
      ? "kotlin"
      : answers.backend === "groovy"
      ? "groovy"
      : "java";
  const configDir = path.join(
    serverDir,
    `src/main/${sourceRoot}`,
    ...packagePath.split("/"),
    "config"
  );
  fs.ensureDirSync(configDir);

  let content = "";
  const fileExtension =
    answers.backend === "kotlin"
      ? "kt"
      : answers.backend === "groovy"
      ? "groovy"
      : "java";

    if (answers.backend === "java") {
    content = `package ${packageName}.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests((authz) -> authz
                .anyRequest().authenticated()
            )
            .httpBasic(withDefaults())
            .csrf(csrf -> csrf.disable()); // Disabled for easier API testing
        return http.build();
    }
}
`;
  } else if (answers.backend === "kotlin") {
    content = `package ${packageName}.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.config.Customizer.withDefaults

@Configuration
@EnableWebSecurity
class SecurityConfig {

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .authorizeHttpRequests { authz ->
                authz.anyRequest().authenticated()
            }
            .httpBasic(withDefaults())
            .csrf { it.disable() } // Disabled for easier API testing
        return http.build()
    }
}
`;
  } else if (answers.backend === "groovy") {
    content = `package ${packageName}.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.web.SecurityFilterChain
import static org.springframework.security.config.Customizer.withDefaults

@Configuration
@EnableWebSecurity
class SecurityConfig {

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests { authz ->
                authz.anyRequest().authenticated()
            }
            .httpBasic(withDefaults())
            .csrf { csrf -> csrf.disable() } // Disabled for easier API testing
        return http.build()
    }
}
`;
  }

  fs.writeFileSync(path.join(configDir, `SecurityConfig.${fileExtension}`), content);
}

/**
 * Create application.properties with database configuration
 */
function createApplicationProperties(serverDir, answers, artifactId) {
  const resourcesDir = path.join(serverDir, "src/main/resources");
  fs.ensureDirSync(resourcesDir);

  const dbConfigs = {
    h2: `# H2 Database Configuration
spring.datasource.url=jdbc:h2:mem:${artifactId}
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# JPA Configuration
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true

# H2 Console (Development only)
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
`,
    postgresql: `# PostgreSQL Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/${artifactId}
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA Configuration
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
`,
    mysql: `# MySQL Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/${artifactId}
spring.datasource.username=root
spring.datasource.password=root
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
`,
  };

  const config = dbConfigs[answers.database];
  if (config) {
    fs.writeFileSync(path.join(resourcesDir, "application.properties"), config);
  }
}

/**
 * Create sample User entity
 */
function createSampleEntity(serverDir, answers, packageName, packagePath) {
  const sourceRoot =
    answers.backend === "kotlin"
      ? "kotlin"
      : answers.backend === "groovy"
      ? "groovy"
      : "java";
  const modelDir = path.join(
    serverDir,
    `src/main/${sourceRoot}`,
    ...packagePath.split("/"),
    "model"
  );
  fs.ensureDirSync(modelDir);

  let entityContent = "";
  const fileExtension =
    answers.backend === "kotlin"
      ? "kt"
      : answers.backend === "groovy"
      ? "groovy"
      : "java";

  if (answers.backend === "java") {
    entityContent = `package ${packageName}.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    // Default constructor
    public User() {}
    
    // Constructor with parameters
    public User(String name, String email) {
        this.name = name;
        this.email = email;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
}
`;
  } else if (answers.backend === "kotlin") {
    entityContent = `package ${packageName}.model

import jakarta.persistence.*

@Entity
@Table(name = "users")
data class User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,
    
    @Column(nullable = false)
    var name: String = "",
    
    @Column(unique = true, nullable = false)
    var email: String = ""
)
`;
  } else if (answers.backend === "groovy") {
    entityContent = `package ${packageName}.model

import jakarta.persistence.*
import groovy.transform.ToString
import groovy.transform.EqualsAndHashCode

@Entity
@Table(name = "users")
@ToString
@EqualsAndHashCode
class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id
    
    @Column(nullable = false)
    String name
    
    @Column(unique = true, nullable = false)
    String email
}
`;
  }

  fs.writeFileSync(path.join(modelDir, `User.${fileExtension}`), entityContent);
}

/**
 * Create sample UserRepository
 */
function createSampleRepository(serverDir, answers, packageName, packagePath) {
  const sourceRoot =
    answers.backend === "kotlin"
      ? "kotlin"
      : answers.backend === "groovy"
      ? "groovy"
      : "java";
  const repositoryDir = path.join(
    serverDir,
    `src/main/${sourceRoot}`,
    ...packagePath.split("/"),
    "repository"
  );
  fs.ensureDirSync(repositoryDir);

  let repositoryContent = "";
  const fileExtension =
    answers.backend === "kotlin"
      ? "kt"
      : answers.backend === "groovy"
      ? "groovy"
      : "java";

  if (answers.backend === "java") {
    repositoryContent = `package ${packageName}.repository;

import ${packageName}.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
}
`;
  } else if (answers.backend === "kotlin") {
    repositoryContent = `package ${packageName}.repository

import ${packageName}.model.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface UserRepository : JpaRepository<User, Long> {
    fun findByEmail(email: String): User?
}
`;
  } else if (answers.backend === "groovy") {
    repositoryContent = `package ${packageName}.repository

import ${packageName}.model.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email)
}
`;
  }

  fs.writeFileSync(
    path.join(repositoryDir, `UserRepository.${fileExtension}`),
    repositoryContent
  );
}
