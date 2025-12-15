import { generateProject } from './bin/generator.js';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';

// Test configurations for Security
const testConfigs = [
    // Java
    { name: 'sec-java-maven', frontend: 'vite', backend: 'java', buildTool: 'maven', packaging: 'jar', database: 'h2', groupId: 'com.sec', springBootVersion: '3.2.1', javaVersion: '17', security: true },
    { name: 'sec-java-gradle', frontend: 'vite', backend: 'java', buildTool: 'gradle', packaging: 'jar', database: 'h2', groupId: 'com.sec', springBootVersion: '3.2.1', javaVersion: '17', security: true },
    
    // Kotlin
    { name: 'sec-kotlin-maven', frontend: 'vite', backend: 'kotlin', buildTool: 'maven', packaging: 'jar', database: 'h2', groupId: 'com.sec', springBootVersion: '3.2.1', javaVersion: '17', security: true },
    { name: 'sec-kotlin-gradle', frontend: 'vite', backend: 'kotlin', buildTool: 'gradle', packaging: 'jar', database: 'h2', groupId: 'com.sec', springBootVersion: '3.2.1', javaVersion: '17', security: true },
    
    // Groovy
    { name: 'sec-groovy-maven', frontend: 'vite', backend: 'groovy', buildTool: 'maven', packaging: 'jar', database: 'h2', groupId: 'com.sec', springBootVersion: '3.2.1', javaVersion: '17', security: true },
    { name: 'sec-groovy-gradle', frontend: 'vite', backend: 'groovy', buildTool: 'gradle', packaging: 'jar', database: 'h2', groupId: 'com.sec', springBootVersion: '3.2.1', javaVersion: '17', security: true },
];

const testDir = './test-run-security';

function verifySecurityFiles(projectPath, config) {
    const results = {
        name: config.name,
        passed: [],
        failed: []
    };

    const sourceRoot = config.backend === 'kotlin' ? 'kotlin' : config.backend === 'groovy' ? 'groovy' : 'java';
    const ext = config.backend === 'kotlin' ? 'kt' : config.backend === 'groovy' ? 'groovy' : 'java';
    const packagePath = config.groupId.replace(/\./g, '/');
    const artifactPath = config.name.replace(/-/g, ''); // In generator we replace dashes
    
    // The generator constructs package name as: ${answers.groupId}.${artifactId replaced dashes}.toLowerCase()
    // Wait, let's check generator.js logic for packageName:
    // const packageName = `${answers.groupId}.${artifactId}`.replace(/-/g, "").toLowerCase();
    
    const packageName = `${config.groupId}.${config.name}`.replace(/-/g, "").toLowerCase();
    const packageDir = packageName.replace(/\./g, '/');

    const securityConfigPath = path.join(
        projectPath, 
        `server/src/main/${sourceRoot}/${packageDir}/config/SecurityConfig.${ext}`
    );

    if (fs.existsSync(securityConfigPath)) {
        results.passed.push(`SecurityConfig.${ext} exists`);
    } else {
        results.failed.push(`SecurityConfig.${ext} NOT FOUND at ${securityConfigPath}`);
    }

    return results;
}

function verifySecurityDependencies(projectPath, config) {
    const results = {
        passed: [],
        failed: []
    };

    const buildFile = config.buildTool === 'maven' ? path.join(projectPath, 'server/pom.xml') :
                      path.join(projectPath, config.backend === 'kotlin' ? 'server/build.gradle.kts' : 'server/build.gradle');
    
    if (!fs.existsSync(buildFile)) {
        results.failed.push('Build file not found');
        return results;
    }

    const content = fs.readFileSync(buildFile, 'utf-8');

    if (content.includes('spring-boot-starter-security')) {
        results.passed.push('spring-boot-starter-security dependency found');
    } else {
        results.failed.push('spring-boot-starter-security dependency MISSING');
    }
    
    if (content.includes('spring-security-test')) {
         results.passed.push('spring-security-test dependency found');
    } else {
         results.failed.push('spring-security-test dependency MISSING');
    }

    return results;
}

async function runTests() {
    console.log(chalk.cyan('\n🛡️  Starting Spring Security Verification...\n'));
    
    if (fs.existsSync(testDir)) {
        fs.removeSync(testDir);
    }
    fs.ensureDirSync(testDir);
    
    const allResults = [];
    
    for (const config of testConfigs) {
        console.log(chalk.yellow(`\n📦 Testing: ${config.name}`));
        console.log(chalk.gray(`   Stack: ${config.backend} + ${config.buildTool}`));
        
        const targetDir = path.join(testDir, config.name);
        
        try {
            await generateProject(config.name, config, targetDir);
            
            const fileResults = verifySecurityFiles(targetDir, config);
            const depResults = verifySecurityDependencies(targetDir, config);
            
            const totalPassed = fileResults.passed.length + depResults.passed.length;
            const totalFailed = fileResults.failed.length + depResults.failed.length;
            
            allResults.push({ ...config, passed: totalPassed, failed: totalFailed });

            if (totalFailed === 0) {
                console.log(chalk.green(`   ✅ PASS`));
            } else {
                console.log(chalk.red(`   ❌ FAIL`));
                fileResults.failed.forEach(f => console.log(chalk.red(`      - ${f}`)));
                depResults.failed.forEach(f => console.log(chalk.red(`      - ${f}`)));
            }
            
        } catch (error) {
            console.log(chalk.red(`   ❌ ERROR: ${error.message}`));
            console.error(error);
        }
    }
}

runTests().catch(console.error);
