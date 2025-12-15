# Changelog

## [1.2.0] - 2025-12-15
### Added
- Added support for Spring Security.
- Users can now choose to include Spring Security when generating a project.
- Automatically adds `spring-boot-starter-security` and `spring-security-test` dependencies.
- Generates a default `SecurityConfig` class with Basic Auth enabled and CSRF disabled (for development).


All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-01-13

### ✨ Added

#### Database Support
- **Database selection**: H2, PostgreSQL, MySQL, or None
- **Auto-configuration**: application.properties generated with database-specific settings
- **JPA Integration**: spring-boot-starter-data-jpa automatically added when database is selected
- **Sample entities**: User entity with JPA annotations (for all languages)
- **Sample repository**: UserRepository extending JpaRepository
- **Database drivers**: Automatic dependency injection for selected database
  - H2: com.h2database:h2
  - PostgreSQL: org.postgresql:postgresql
  - MySQL:com.mysql:mysql-connector-j

#### Configuration Improvements
- **Spring Boot version selection**: Choose between 3.2.1, 3.1.7, or 3.0.13
- **Input validation**: groupId now validated against Java package naming conventions
- **Project name validation**: Ensures valid project names (alphanumeric, dashes, underscores)

### 🔧 Improved
- Enhanced binary file detection (from 6 to 30+ file extensions)
- Cleaner code with better documentation
- Dynamic application class name handling
- Better error messages for validation failures

### 📚 Documentation
- Updated HELP.md template with database setup instructions
- Docker commands for PostgreSQL and MySQL
- H2 console access information
- Database connection troubleshooting

---

## [1.0.0] - 2025-01-12

### 🎉 Initial Release

First public release of create-react-spring - the fastest way to create React + Spring Boot full-stack applications.

### ✨ Added

#### Frontend Support
- Vite template with React 18
- Create React App template (legacy support)
- Auto-configured proxy for backend API calls
- Pre-configured ESLint and development environment

#### Backend Support
- **Java** backend template with Spring Boot
- **Kotlin** backend template with Spring Boot
- **Groovy** backend template with Spring Boot
- Maven build system support (with wrapper)
- Gradle build system support (with wrapper)
- JAR packaging option
- WAR packaging option with auto-generated ServletInitializer

#### Project Configuration
- Interactive CLI with colored output
- Custom Group ID input with validation
- Java version selection (17 or 21)
- Automatic package structure creation
- Template parameterization (GROUP_ID, ARTIFACT_ID, JAVA_VERSION)
- Cross-platform support (Windows, Mac, Linux)

#### Documentation
- Auto-generated HELP.md with stack-specific instructions
- Comprehensive README with examples
- MIT License included

#### Developer Experience
- Build wrappers included (mvnw, gradlew)
- No global installations required
- Error handling with automatic cleanup on failure
- Clear success/error messaging
- Next steps instructions after generation

### 🔧 Technical Details

- **Node.js**: Requires >= 18.0.0
- **Dependencies**: inquirer ^9.2.7, chalk ^5.3.0, fs-extra ^11.2.0
- **Package Size**: ~2.5MB (including all templates)
- **Supported Platforms**: Windows, macOS, Linux

### 📦 Templates Included

- `frontend/vite` - Vite + React template
- `frontend/cra` - Create React App template
- `backend/java` - Java + Maven template
- `backend/java-gradle` - Java + Gradle template
- `backend/kotlin` - Kotlin + Maven template
- `backend/kotlin-gradle` - Kotlin + Gradle template
- `backend/groovy` - Groovy + Maven template
- `backend/groovy-gradle` - Groovy + Gradle template

---

## [Unreleased]

### 🚧 Planned Features

#### v1.1.0 (Next Minor Release)
- [ ] TypeScript support for frontend templates
- [ ] Spring Boot version selection
- [ ] Database configuration options (PostgreSQL, MySQL, H2)
- [ ] Environment file generation (.env)
- [ ] Docker and Docker Compose configuration generation
- [ ] Testing framework setup (Jest, JUnit)
- [ ] Input validation for Group ID format
- [ ] Project name validation (no spaces/special characters)

#### v1.2.0 (Future Minor Release)
- [ ] Authentication scaffolding (Spring Security + JWT)
- [ ] API documentation generation (Swagger/OpenAPI)
- [ ] Vue.js frontend option
- [ ] Angular frontend option
- [ ] Redis integration option
- [ ] Email service configuration
- [ ] File upload configuration

#### v2.0.0 (Major Release - Future)
- [ ] GraphQL support
- [ ] Microservices architecture template
- [ ] Cloud deployment configurations (AWS, Azure, GCP)
- [ ] Kubernetes manifests generation
- [ ] CI/CD pipeline templates
- [ ] Monitoring and logging setup (Prometheus, Grafana, ELK)
- [ ] Multi-module project support
- [ ] Advanced security configurations

---

## Version History

### How to Read This Changelog

- **Added**: New features
- **Changed**: Changes in existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security vulnerability fixes

### Contributing

If you'd like to suggest features or report bugs, please visit our [GitHub Issues](https://github.com/KOWSIK-M/create-react-spring/issues).

---

[1.0.0]: https://github.com/KOWSIK-M/create-react-spring/releases/tag/v1.0.0
[Unreleased]: https://github.com/KOWSIK-M/create-react-spring/compare/v1.0.0...HEAD
