# Copilot / AI Agent Instructions — create-react-spring

Purpose: help coding agents become productive quickly in this repository. Keep edits minimal and preserve templates/ and bin/ behavior.

- **Big picture**: This is a CLI project that generates a React frontend + Spring Boot backend monorepo from templates.

  - CLI entry: `bin/index.js` (invokes prompts and generator)
  - Prompt definitions: `bin/prompts.js`
  - Generation logic: `bin/generator.js` (copies templates, replaces placeholders)
  - Templates: `templates/frontend/` and `templates/backend/` (named like `vite`, `cra`, `java`, `java-gradle`, `kotlin`, `groovy`, etc.)
  - Test scaffolding: `test-runner.js` and `test-projects/` contain generated examples used for manual/automated checks.

- **Why repository is organized this way**:

  - Separation of concerns: `bin/` implements the CLI behavior and orchestration; `templates/` are the content artifacts to scaffold projects.
  - Reproducibility: each backend template includes wrappers (`mvnw`, `gradlew`) to avoid requiring global installs.

- **Immediate tasks an agent may be asked to do**:

  - Add or update templates in `templates/` (must use placeholders described below).
  - Update generation logic in `bin/generator.js` when adding new template options.
  - Extend prompts in `bin/prompts.js` to expose new choices.

- **Developer workflows / exact commands** (include in PRs or CI):

  - Install deps: `npm install`
  - Run locally (example test generation):
    - `node bin/index.js test-project` (runs non-installed CLI directly)
    - Or: `npm link` then `create-react-spring test-project` (links globally)
  - Run tests / manual verification:
    - Inspect `test-projects/<name>/client` and `.../server` for generated project behavior
    - Start frontend: `cd client && npm install && npm run dev` (Vite) or `npm start` (CRA)
    - Start backend (Windows): `mvnw.cmd spring-boot:run` or `gradlew.bat bootRun` in `server/`
    - Start backend (Unix): `./mvnw spring-boot:run` or `./gradlew bootRun`

- **Project-specific conventions & patterns** (do not change without updating docs):

  - Template placeholders (must be used exactly): `{{GROUP_ID}}`, `{{ARTIFACT_ID}}`, `{{PACKAGE_NAME}}`, `{{JAVA_VERSION}}`.
  - Backend template directory names map to prompt choices (example mapping: `java` + Maven → `templates/backend/java/`, `java` + Gradle → `templates/backend/java-gradle/`).
  - Generated projects include `HELP.md` with per-stack instructions — use these to confirm runtime commands.

- **Integration points & external dependencies**:

  - Inquirer (`bin/prompts.js`) drives selection logic — changing prompt keys will affect `generator.js` behavior.
  - Generated backends expect a running frontend at Vite (`http://localhost:5173`) or CRA (`http://localhost:3000`) — CORS is preconfigured for local dev in templates.
  - Tests and CI rely on wrappers (`mvnw`, `gradlew`) inside templates — prefer using wrapper scripts in CI and docs.

- **Files to inspect for examples when coding**:

  - `bin/index.js` — CLI entry and command wiring
  - `bin/prompts.js` — available options and prompt strings
  - `bin/generator.js` — template copy, placeholder replacement, packaging logic (jar/war handling)
  - `templates/frontend/vite` and `templates/frontend/cra` — frontend layout and build scripts
  - `templates/backend/*` — backend project structure and wrapper scripts
  - `test-runner.js` and `test-projects/` — how generated projects are exercised during development

- **When editing templates**:

  - Keep placeholder tokens exact; tests use those names when generating projects.
  - If you add a new build tool or language, update `bin/prompts.js`, `bin/generator.js`, and `CONTRIBUTING.md` examples.

- **Safety & minimal-change guidance for agents**:
  - Avoid refactoring public APIs of `bin/generator.js` without tests in `test-projects/` updated.
  - Don't delete existing templates; add new ones beside them and include a test-project that exercises the new template.

If anything here is unclear or you want me to include more detailed examples (small code snippets or CI blocks), tell me which area to expand.
