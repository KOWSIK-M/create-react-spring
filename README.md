# Create React Spring

<div align="center">

![NPM Version](https://img.shields.io/npm/v/create-react-spring)
![License](https://img.shields.io/npm/l/create-react-spring)
![Node Version](https://img.shields.io/node/v/create-react-spring)
![Downloads](https://img.shields.io/npm/dt/create-react-spring)

**The fastest way to create a production-ready React + Spring Boot full-stack application**

[Quick Start](#-quick-start) • [Features](#-features) • [Documentation](#-documentation) • [Examples](#-examples) • [Troubleshooting](#-troubleshooting)

</div>

---

## 🎯 Overview

**create-react-spring** is a powerful CLI tool that instantly bootstraps a complete full-stack project with a **React** frontend and **Spring Boot** backend. Stop wasting hours on project setup and configuration - get a production-ready monorepo structure in seconds.

### Why create-react-spring?

✅ **Save Time**: Go from zero to coding in under a minute  
✅ **Best Practices**: Pre-configured with industry-standard tools and structure  
✅ **Flexibility**: Choose your preferred languages and build tools  
✅ **Full Control**: No hidden abstractions - you own all the code  
✅ **Production Ready**: Includes build wrappers, proper packaging, and deployment config

---

## ✨ Features

### Frontend Options
- 🚀 **Vite** (Recommended) - Lightning-fast HMR and modern build tooling
- ⚛️ **Create React App** - Battle-tested, stable React setup

### Backend Options
- ☕ **Languages**: Java, Kotlin, or Groovy
- 🔧 **Build Tools**: Maven or Gradle (with wrappers included)
- 📦 **Packaging**: JAR or WAR deployment options
- 🎯 **Java Versions**: 17 or 21
- 🔒 **Security**: Optional Spring Security integration

### Project Structure
- 📁 **Monorepo Style**: Organized `client/` and `server/` directories
- 🔄 **Auto-Configuration**: Templates parameterized with your choices
- 📚 **Documentation**: Auto-generated `HELP.md` with stack-specific instructions
- ✅ **Ready to Run**: Both frontend and backend work immediately

---

## 🚀 Quick Start

### Installation

You don't need to install anything globally. Just run:

```bash
npx create-react-spring
```

Or specify a project name directly:

```bash
npx create-react-spring my-awesome-app
```

### Interactive Setup

The CLI will guide you through configuration:

```
🚀 create-react-spring

? Project name: my-awesome-app
? Select Frontend Framework: Vite (Recommended)
? Select Backend Language: Java
? Select Build Tool: Maven
? Select Packaging: Jar
? Group ID: com.mycompany
? Java Version: 17
? Add Spring Security?: Yes

📁 Creating project my-awesome-app...
   - Frontend: vite → copied to client/
   - Backend: java (maven) → configuring for com.mycompany.myawesomeapp...
   - Security: enabled -> adding Spring Security...

✔ Project created successfully!
```

### Project Structure

Your generated project will look like this:

```
my-awesome-app/
├── client/              # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js   # or package.json for CRA
│   └── ...
├── server/              # Spring Boot Backend
│   ├── src/
│   │   └── main/
│   │       └── java/    # or kotlin/groovy
│   │           └── com/
│   │               └── mycompany/
│   │                   └── myawesomeapp/
│   │                       ├── DemoApplication.java
│   │                       └── HelloController.java
│   ├── pom.xml          # or build.gradle
│   ├── mvnw             # Maven wrapper
│   └── ...
├── HELP.md              # Stack-specific quickstart guide
└── README.md
```

### Running Your Project

**Frontend:**
```bash
cd my-awesome-app/client
npm install
npm run dev              # Vite: http://localhost:5173
# or npm start           # CRA: http://localhost:3000
```

**Backend:**
```bash
cd my-awesome-app/server

# Maven
./mvnw spring-boot:run   # Unix/Mac
mvnw.cmd spring-boot:run # Windows

# Gradle
./gradlew bootRun        # Unix/Mac
gradlew.bat bootRun      # Windows

# Server runs on http://localhost:8080
```

---

## 📋 Prerequisites

Before using create-react-spring, ensure you have:

- **Node.js**: Version 18.0.0 or higher ([Download](https://nodejs.org/))
- **Java Development Kit (JDK)**: Version 17 or higher ([Download](https://adoptium.net/))
- **npm** or **yarn**: Package manager (comes with Node.js)

### Verify Installation

```bash
node --version    # Should be >= 18.0.0
java --version    # Should be >= 17
```

---

## 📖 Documentation

### Command Line Options

| Argument | Description | Example |
|----------|-------------|---------|
| `[project-name]` | Specify project name directly | `npx create-react-spring my-app` |
| _(none)_ | Interactive mode (prompts for all options) | `npx create-react-spring` |

### Configuration Options

#### Frontend Framework
- **Vite** (Recommended)
  - ⚡ Ultra-fast Hot Module Replacement (HMR)
  - 🎯 Optimized for modern development
  - 📦 Smaller bundle sizes
  - 🔧 Better TypeScript support

- **Create React App**
  - 🛡️ Battle-tested and stable
  - 📚 Extensive documentation
  - 🔄 Familiar to most React developers

#### Backend Language
- **Java**: Industry-standard, extensive ecosystem
- **Kotlin**: Modern, concise, null-safe
- **Groovy**: Dynamic, flexible, powerful DSL

#### Build Tool
- **Maven**: Convention-over-configuration, XML-based
- **Gradle**: Flexible, Groovy/Kotlin DSL, faster builds

#### Packaging
- **JAR**: Embedded server, easy deployment
- **WAR**: Traditional servlet container deployment (Tomcat, etc.)

#### Security
- **Spring Security**: Optional integration
  - Adds `spring-boot-starter-security`
  - Configures Basic Authentication
  - Disables CSRF (for easier development)
  - users can be added via `application.properties` or `SecurityConfig`

### Advanced Configuration

#### Custom Group ID

The Group ID follows Java package naming conventions:

```
✅ Valid:   com.mycompany, org.example, io.github.username
❌ Invalid: MyCompany, com.My-Company, 123company
```

#### Java Version Selection

- **Java 17**: LTS (Long-Term Support) - Recommended for most projects
- **Java 21**: Latest LTS - For cutting-edge features

---

## 🎨 Examples

### Example 1: React + Java + Maven

```bash
npx create-react-spring my-store

# Choices:
# - Frontend: Vite
# - Backend: Java
# - Build Tool: Maven
# - Packaging: Jar
# - Group ID: com.mystore
# - Java Version: 17
```

**Result**: E-commerce starter with Vite HMR and Spring Boot REST API

### Example 2: React + Kotlin + Gradle

```bash
npx create-react-spring blog-platform

# Choices:
# - Frontend: Vite
# - Backend: Kotlin
# - Build Tool: Gradle
# - Packaging: Jar
# - Group ID: io.myblog
# - Java Version: 21
```

**Result**: Modern blog platform with Kotlin's concise syntax

### Example 3: Legacy CRA + Groovy + WAR

```bash
npx create-react-spring enterprise-app

# Choices:
# - Frontend: Create React App
# - Backend: Groovy
# - Build Tool: Maven
# - Packaging: War
# - Group ID: com.enterprise
# - Java Version: 17
```

**Result**: Enterprise application deployable to existing Tomcat servers

---

## 🏗️ Project Configuration Details

### Auto-Generated Files

create-react-spring automatically configures:

✅ **Package Structure**: Creates proper Java package hierarchy from your Group ID  
✅ **Build Wrappers**: Includes `mvnw`/`gradlew` so projects work without global installations  
✅ **CORS Configuration**: Pre-configured for local development (client ↔ server)  
✅ **ServletInitializer**: Auto-added for WAR packaging  
✅ **Sample Controller**: Working REST endpoint at `/api/hello`  

### Connecting Frontend to Backend

**Example React Component:**

```jsx
// client/src/App.jsx
import { useState, useEffect } from 'react';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/api/hello')
      .then(res => res.text())
      .then(data => setMessage(data));
  }, []);

  return <h1>{message}</h1>;
}

export default App;
```

**Example Spring Controller:**

```java
// server/src/main/java/com/example/demo/HelloController.java
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173") // Vite dev server
public class HelloController {
    
    @GetMapping("/hello")
    public String hello() {
        return "Hello from Spring Boot!";
    }
}
```

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### ❌ "Folder already exists!"

**Problem**: Target directory already contains a project with the same name.

**Solution**:
```bash
# Choose a different name
npx create-react-spring my-app-v2

# Or remove the existing directory
rm -rf my-app  # Unix/Mac
rmdir /s my-app  # Windows
```

---

#### ❌ Frontend won't start: "ENOENT: no such file or directory"

**Problem**: Dependencies not installed.

**Solution**:
```bash
cd client
npm install
npm run dev  # or npm start for CRA
```

---

#### ❌ Backend error: "JAVA_HOME is not set"

**Problem**: Java environment variable not configured.

**Solution**:

**Windows:**
```powershell
# Find Java installation
where java

# Set JAVA_HOME (example path)
setx JAVA_HOME "C:\Program Files\Java\jdk-17"
```

**Mac/Linux:**
```bash
# Add to ~/.bashrc or ~/.zshrc
export JAVA_HOME=$(/usr/libexec/java_home)  # Mac
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk  # Linux
```

Restart your terminal after setting `JAVA_HOME`.

---

#### ❌ "mvnw: Permission denied" (Unix/Mac)

**Problem**: Maven wrapper not executable.

**Solution**:
```bash
cd server
chmod +x mvnw
./mvnw spring-boot:run
```

---

#### ❌ Backend error: "'groupId' with value '{{GROUP_ID}}'"

**Problem**: Template placeholders not replaced (rare bug).

**Solution**: This shouldn't happen with the latest version. If it does:
1. Delete the generated `server/` directory
2. Re-run `npx create-react-spring@latest`
3. If issue persists, [report a bug](https://github.com/KOWSIK-M/create-react-spring/issues)

---

#### ❌ Port 8080 already in use

**Problem**: Another application is using the default Spring Boot port.

**Solution**: Change the port in `server/src/main/resources/application.properties`:

```properties
server.port=8081
```

Then update frontend API calls to use `http://localhost:8081`.

---

#### ❌ CORS errors in browser console

**Problem**: Frontend can't access backend due to CORS policy.

**Solution**: Add CORS configuration to your Spring controller:

```java
@CrossOrigin(origins = "http://localhost:5173")  // Vite
// or
@CrossOrigin(origins = "http://localhost:3000")  // CRA
```

For production, configure proper CORS in `WebConfig`:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("https://your-production-domain.com")
                .allowedMethods("GET", "POST", "PUT", "DELETE");
    }
}
```

---

#### ❌ Gradle build fails: "Could not find method kotlin() for arguments"

**Problem**: Gradle version mismatch.

**Solution**: Use the included wrapper (recommended):
```bash
./gradlew --version  # Check version
./gradlew clean build  # Use wrapper, not global gradle
```

---

### Getting Help

Still stuck? Here's how to get help:

1. **Check HELP.md**: Your generated project includes stack-specific guidance
2. **Search Issues**: [GitHub Issues](https://github.com/KOWSIK-M/create-react-spring/issues)
3. **Ask Questions**: [Start a Discussion](https://github.com/KOWSIK-M/create-react-spring/discussions)
4. **Report Bugs**: [Open an Issue](https://github.com/KOWSIK-M/create-react-spring/issues/new)

When reporting issues, include:
- Node version: `node --version`
- Java version: `java --version`
- OS: Windows/Mac/Linux
- Full error message
- Steps to reproduce

---

## 🚀 CI/CD Integration

### GitHub Actions

Create `.github/workflows/ci.yml` in your project:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  frontend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./client
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: client/package-lock.json
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Upload artifact
        uses: actions/upload-artifact@v3
        with:
          name: frontend-build
          path: client/dist  # or client/build for CRA

  backend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./server
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup JDK
        uses: actions/setup-java@v3
        with:
          distribution: 'temurin'
          java-version: '17'
          cache: 'maven'  # or 'gradle'
      
      - name: Build with Maven
        run: ./mvnw clean package -DskipTests
      
      # For Gradle, use:
      # - name: Build with Gradle
      #   run: ./gradlew build -x test
      
      - name: Upload artifact
        uses: actions/upload-artifact@v3
        with:
          name: backend-jar
          path: server/target/*.jar  # or server/build/libs/*.jar for Gradle
```

---

### GitLab CI

Create `.gitlab-ci.yml` in your project:

```yaml
stages:
  - build
  - test
  - deploy

variables:
  MAVEN_OPTS: "-Dmaven.repo.local=.m2/repository"

frontend-build:
  stage: build
  image: node:18
  before_script:
    - cd client
    - npm ci
  script:
    - npm run build
  artifacts:
    paths:
      - client/dist/  # or client/build/ for CRA
    expire_in: 1 hour

backend-build:
  stage: build
  image: openjdk:17-jdk
  before_script:
    - cd server
  script:
    - ./mvnw clean package -DskipTests
  artifacts:
    paths:
      - server/target/*.jar
    expire_in: 1 hour
  cache:
    paths:
      - .m2/repository
```

---

### Docker Deployment

**Docker Compose** (`docker-compose.yml`):

```yaml
version: '3.8'

services:
  frontend:
    build: ./client
    ports:
      - "80:80"
    depends_on:
      - backend
    environment:
      - REACT_APP_API_URL=http://localhost:8080

  backend:
    build: ./server
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=production
```

**Frontend Dockerfile** (`client/Dockerfile`):

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Backend Dockerfile** (`server/Dockerfile`):

```dockerfile
FROM openjdk:17-jdk-alpine AS build
WORKDIR /app
COPY . .
RUN ./mvnw clean package -DskipTests

FROM openjdk:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

---

## 📊 Version History & Changelog

### v1.0.0 (Current)

**Release Date**: 2025-01-12

#### ✨ Features
- Initial public release
- Frontend support: Vite and Create React App
- Backend support: Java, Kotlin, Groovy
- Build tool support: Maven and Gradle
- Packaging options: JAR and WAR
- Java version selection: 17 and 21
- Auto-generated project structure
- Build wrappers included (mvnw, gradlew)
- Cross-platform support (Windows, Mac, Linux)
- Interactive CLI with colored output
- Auto-generated HELP.md documentation

#### 🔧 Technical Details
- Node.js requirement: >= 18.0.0
- Dependencies: inquirer, chalk, fs-extra
- License: MIT

#### 📦 Package Info
- Bundle size: ~2.5MB (including all templates)
- Install time: ~3-5 seconds
- Project generation time: ~1-2 seconds

---

### Upcoming Features (Roadmap)

#### v1.1.0 (Planned)
- [ ] TypeScript support for frontend
- [ ] Spring Boot version selection
- [ ] Database configuration (PostgreSQL, MySQL, H2)
- [ ] Docker configuration generation
- [ ] Testing framework setup

#### v1.2.0 (Planned)
- [ ] Authentication templates (Spring Security + JWT)
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Multiple frontend frameworks (Vue, Angular)
- [ ] Microservices template option

#### v2.0.0 (Future)
- [ ] GraphQL support
- [ ] Cloud deployment templates (AWS, Azure, GCP)
- [ ] Kubernetes manifests generation
- [ ] Monitoring setup (Prometheus, Grafana)

Want a feature? [Request it here](https://github.com/KOWSIK-M/create-react-spring/issues/new?labels=enhancement)!

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Reporting Bugs

Found a bug? [Open an issue](https://github.com/KOWSIK-M/create-react-spring/issues/new) with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Your environment (OS, Node version, Java version)

### Suggesting Features

Have an idea? [Open a discussion](https://github.com/KOWSIK-M/create-react-spring/discussions/new) or feature request!

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup

```bash
# Clone the repository
git clone https://github.com/KOWSIK-M/create-react-spring.git
cd create-react-spring

# Install dependencies
npm install

# Test locally
node bin/index.js test-project

# Link for local testing
npm link
create-react-spring my-test-app
```

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### What this means:
- ✅ Free for personal and commercial use
- ✅ Modify and distribute freely
- ✅ Private use allowed
- ❌ No warranty or liability
- ℹ️ Must include original license notice

---

## 🌟 Acknowledgments

Built with ❤️ using:
- [inquirer](https://github.com/SBoudrias/Inquirer.js) - Interactive CLI prompts
- [chalk](https://github.com/chalk/chalk) - Terminal string styling
- [fs-extra](https://github.com/jprichardson/node-fs-extra) - Enhanced file operations

Inspired by:
- [create-react-app](https://create-react-app.dev/) - React tooling
- [Spring Initializr](https://start.spring.io/) - Spring Boot bootstrapping
- [create-vite](https://vitejs.dev/guide/) - Vite project scaffolding

---

## 📞 Support & Contact

- **GitHub**: [@KOWSIK-M](https://github.com/KOWSIK-M)
- **Issues**: [GitHub Issues](https://github.com/KOWSIK-M/create-react-spring/issues)
- **Discussions**: [GitHub Discussions](https://github.com/KOWSIK-M/create-react-spring/discussions)

---

<div align="center">

**⭐ If you find this helpful, please star the repo!**

[![GitHub stars](https://img.shields.io/github/stars/KOWSIK-M/create-react-spring?style=social)](https://github.com/KOWSIK-M/create-react-spring)

Made with ❤️ by [Kowsik](https://github.com/KOWSIK-M)

</div>
