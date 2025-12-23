import { generateProject } from "./bin/generator.js";
import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runTest() {
  const projectName = "test-output-project";
  const targetDir = path.join(__dirname, projectName);
  
  if (fs.existsSync(targetDir)) {
    fs.removeSync(targetDir);
  }

  const mockAnswers = {
    frontend: "vite",
    backend: "kotlin",
    buildTool: "gradle",
    packaging: "jar",
    database: "none",
    security: false,
    groupId: "com.test",
    springBootVersion: "4.0.1",
    javaVersion: "25"
  };

  console.log("Generating test project...");
  await generateProject(projectName, mockAnswers, targetDir);
  
  // Verify contents
  console.log("Verifying output...");
  
  // Check backend build.gradle.kts
  const buildGradle = fs.readFileSync(path.join(targetDir, "server/build.gradle.kts"), "utf8");
  if (!buildGradle.includes('id("org.springframework.boot") version "4.0.1"')) {
      console.error("FAIL: Spring Boot version mismatch in build.gradle.kts");
      console.error("Found content:", buildGradle);
      process.exit(1);
  }
  if (!buildGradle.includes('kotlin("jvm") version "2.3.0"')) {
      console.error("FAIL: Kotlin plugin version mismatch");
      process.exit(1);
  }
  if (!buildGradle.includes('JavaLanguageVersion.of(25)')) {
      console.error("FAIL: Java version mismatch");
      process.exit(1);
  }

  // Check frontend package.json
  const packageJson = fs.readFileSync(path.join(targetDir, "client/package.json"), "utf8");
  if (!packageJson.includes('"vite": "^7.3.0"')) {
      console.error("FAIL: Vite version mismatch");
      process.exit(1);
  }
   if (!packageJson.includes('"react": "^19.2.3"')) {
      console.error("FAIL: React version mismatch");
      process.exit(1);
  }

  console.log("SUCCESS: All versions matched expected values.");
  
  // Cleanup
  // fs.removeSync(targetDir);
}

runTest().catch(err => {
    fs.writeFileSync("verification-result.txt", "ERROR: " + err.stack);
    process.exit(1);
});

// Capture log
const logFile = fs.createWriteStream('verification-result.txt', { flags: 'a' });
const originalLog = console.log;
const originalError = console.error;

console.log = function (...args) {
    logFile.write(args.join(' ') + '\n');
    originalLog.apply(console, args);
};
console.error = function (...args) {
     logFile.write('ERROR: ' + args.join(' ') + '\n');
     originalError.apply(console, args);
};
