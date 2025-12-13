import { generateProject } from './bin/generator.js';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';

// Test configurations
const testConfigs = [
    // Previous High Priority Tests
    { name: 'test-java-maven-h2', frontend: 'vite', backend: 'java', buildTool: 'maven', packaging: 'jar', database: 'h2', groupId: 'com.test', springBootVersion: '3.2.1', javaVersion: '17' },
    { name: 'test-java-maven-postgres', frontend: 'vite', backend: 'java', buildTool: 'maven', packaging: 'jar', database: 'postgresql', groupId: 'com.test', springBootVersion: '3.2.1', javaVersion: '17' },
    { name: 'test-kotlin-gradle-h2', frontend: 'vite', backend: 'kotlin', buildTool: 'gradle', packaging: 'jar', database: 'h2', groupId: 'com.test', springBootVersion: '3.2.1', javaVersion: '17' },
    { name: 'test-java-maven-none', frontend: 'vite', backend: 'java', buildTool: 'maven', packaging: 'jar', database: 'none', groupId: 'com.test', springBootVersion: '3.2.1', javaVersion: '17' },
    { name: 'test-java-maven-mysql', frontend: 'vite', backend: 'java', buildTool: 'maven', packaging: 'jar', database: 'mysql', groupId: 'com.test', springBootVersion: '3.2.1', javaVersion: '17' },
    { name: 'test-groovy-gradle-h2', frontend: 'vite', backend: 'groovy', buildTool: 'gradle', packaging: 'jar', database: 'h2', groupId: 'com.test', springBootVersion: '3.2.1', javaVersion: '17' },
    
    // Extended Tests - Java + Gradle
    { name: 'test-java-gradle-h2', frontend: 'vite', backend: 'java', buildTool: 'gradle', packaging: 'jar', database: 'h2', groupId: 'com.test', springBootVersion: '3.2.1', javaVersion: '17' },
    { name: 'test-java-gradle-postgres', frontend: 'vite', backend: 'java', buildTool: 'gradle', packaging: 'jar', database: 'postgresql', groupId: 'com.test', springBootVersion: '3.2.1', javaVersion: '17' },
    { name: 'test-java-gradle-mysql', frontend: 'vite', backend: 'java', buildTool: 'gradle', packaging: 'jar', database: 'mysql', groupId: 'com.test', springBootVersion: '3.2.1', javaVersion: '17' },
    
    // Extended Tests - Kotlin + Maven
    { name: 'test-kotlin-maven-h2', frontend: 'vite', backend: 'kotlin', buildTool: 'maven', packaging: 'jar', database: 'h2', groupId: 'com.test', springBootVersion: '3.2.1', javaVersion: '17' },
    { name: 'test-kotlin-maven-postgres', frontend: 'vite', backend: 'kotlin', buildTool: 'maven', packaging: 'jar', database: 'postgresql', groupId: 'com.test', springBootVersion: '3.2.1', javaVersion: '17' },
    { name: 'test-kotlin-maven-mysql', frontend: 'vite', backend: 'kotlin', buildTool: 'maven', packaging: 'jar', database: 'mysql', groupId: 'com.test', springBootVersion: '3.2.1', javaVersion: '17' },
    
    // Extended Tests - Groovy + Maven
    { name: 'test-groovy-maven-h2', frontend: 'vite', backend: 'groovy', buildTool: 'maven', packaging: 'jar', database: 'h2', groupId: 'com.test', springBootVersion: '3.2.1', javaVersion: '17' },
];

const testDir = './test-run';

// Verification functions
function verifyProjectStructure(projectPath, config) {
    const results = {
        name: config.name,
        passed: [],
        failed: []
    };
    
    // Check basic structure
    const checks = [
        { path: 'client', desc: 'Client directory exists' },
        { path: 'server', desc: 'Server directory exists' },
        { path: 'HELP.md', desc: 'HELP.md exists' }
    ];
    
    // Database-specific checks
    if (config.database !== 'none') {
        checks.push(
            { path: `server/src/main/resources/application.properties`, desc: 'application.properties exists' },
            { path: `server/src/main/${config.backend === 'kotlin' ? 'kotlin' : config.backend === 'groovy' ? 'groovy' : 'java'}/com/test/${config.name.replace(/-/g, '')}/model/User.${config.backend === 'kotlin' ? 'kt' : config.backend === 'groovy' ? 'groovy' : 'java'}`, desc: 'User entity exists' },
            { path: `server/src/main/${config.backend === 'kotlin' ? 'kotlin' : config.backend === 'groovy' ? 'groovy' : 'java'}/com/test/${config.name.replace(/-/g, '')}/repository/UserRepository.${config.backend === 'kotlin' ? 'kt' : config.backend === 'groovy' ? 'groovy' : 'java'}`, desc: 'UserRepository exists' }
        );
    }
    
    // Check build file
    const buildFile = config.buildTool === 'maven' ? 'server/pom.xml' : 
                      config.backend === 'kotlin' ? 'server/build.gradle.kts' : 'server/build.gradle';
    checks.push({ path: buildFile, desc: `Build file (${buildFile}) exists` });
    
    for (const check of checks) {
        const fullPath = path.join(projectPath, check.path);
        if (fs.existsSync(fullPath)) {
            results.passed.push(check.desc);
        } else {
            results.failed.push(`${check.desc} - NOT FOUND: ${check.path}`);
        }
    }
    
    return results;
}

function verifyDependencies(projectPath, config) {
    const results = {
        passed: [],
        failed: []
    };
    
    if (config.database === 'none') {
        return results; // Skip dependency check for 'none'
    }
    
    const buildFile = config.buildTool === 'maven' ? path.join(projectPath, 'server/pom.xml') :
                      path.join(projectPath, config.backend === 'kotlin' ? 'server/build.gradle.kts' : 'server/build.gradle');
    
    if (!fs.existsSync(buildFile)) {
        results.failed.push('Build file not found for dependency verification');
        return results;
    }
    
    const content = fs.readFileSync(buildFile, 'utf-8');
    
    // Check for JPA
    if (content.includes('spring-boot-starter-data-jpa')) {
        results.passed.push('spring-boot-starter-data-jpa dependency found');
    } else {
        results.failed.push('spring-boot-starter-data-jpa dependency MISSING');
    }
    
    // Check for database driver
    const driverChecks = {
        h2: 'h2',
        postgresql: 'postgresql',
        mysql: 'mysql-connector-j'
    };
    
    const expectedDriver = driverChecks[config.database];
    if (content.includes(expectedDriver)) {
        results.passed.push(`${expectedDriver} driver dependency found`);
    } else {
        results.failed.push(`${expectedDriver} driver dependency MISSING`);
    }
    
    return results;
}

async function runTests() {
    console.log(chalk.cyan('\\n🧪 Starting Comprehensive Testing...\\n'));
    
    // Create test directory
    if (fs.existsSync(testDir)) {
        fs.removeSync(testDir);
    }
    fs.ensureDirSync(testDir);
    
    const allResults = [];
    
    for (const config of testConfigs) {
        console.log(chalk.yellow(`\\n📦 Testing: ${config.name}`));
        console.log(chalk.gray(`   Config: ${config.backend} + ${config.buildTool} + ${config.database}`));
        
        const targetDir = path.join(testDir, config.name);
        
        try {
            // Generate project
            await generateProject(config.name, config, targetDir);
            
            // Verify structure
            const structureResults = verifyProjectStructure(targetDir, config);
            const depResults = verifyDependencies(targetDir, config);
            
            const totalPassed = structureResults.passed.length + depResults.passed.length;
            const totalFailed = structureResults.failed.length + depResults.failed.length;
            
            allResults.push({
                config: config.name,
                passed: totalPassed,
                failed: totalFailed,
                details: {
                    structure: structureResults,
                    dependencies: depResults
                }
            });
            
            if (totalFailed === 0) {
                console.log(chalk.green(`   ✅ PASS (${totalPassed} checks)`));
            } else {
                console.log(chalk.red(`   ❌ FAIL (${totalPassed} passed, ${totalFailed} failed)`));
                structureResults.failed.forEach(f => console.log(chalk.red(`      - ${f}`)));
                depResults.failed.forEach(f => console.log(chalk.red(`      - ${f}`)));
            }
            
        } catch (error) {
            console.log(chalk.red(`   ❌ ERROR: ${error.message}`));
            allResults.push({
                config: config.name,
                error: error.message
            });
        }
    }
    
    // Summary
    console.log(chalk.cyan('\\n' + '='.repeat(60)));
    console.log(chalk.cyan('📊 Test Summary'));
    console.log(chalk.cyan('='.repeat(60)));
    
    const totalTests = allResults.length;
    const passedTests = allResults.filter(r => !r.error && r.failed === 0).length;
    const failedTests = totalTests - passedTests;
    
    console.log(chalk.white(`\\nTotal Tests: ${totalTests}`));
    console.log(chalk.green(`Passed: ${passedTests}`));
    console.log(failedTests > 0 ? chalk.red(`Failed: ${failedTests}`) : chalk.green(`Failed: 0`));
    
    console.log(chalk.cyan('\\n' + '='.repeat(60)));
    
    // Save detailed results
    fs.writeFileSync(
        path.join(testDir, 'test-results.json'),
        JSON.stringify(allResults, null, 2)
    );
    
    console.log(chalk.gray(`\\n📄 Detailed results saved to: ${path.join(testDir, 'test-results.json')}`));
    console.log(chalk.gray(`📁 Test projects located in: ${testDir}/\\n`));
}

runTests().catch(console.error);
