#!/usr/bin/env node

import inquirer from "inquirer";
import chalk from "chalk";
import path from "path";
import fs from "fs-extra";
import { questions, getProjectNameQuestion } from "./prompts.js";
import { generateProject } from "./generator.js";

console.log(chalk.cyan("\n🚀 react-springboot-cli\n"));

const args = process.argv.slice(2);
let projectNameArg = args[0];

const finalQuestions = [...questions];

// If no project name is provided, ask for it
if (!projectNameArg) {
    finalQuestions.unshift(getProjectNameQuestion());
}

inquirer.prompt(finalQuestions).then(async (answers) => {
  const projectName = projectNameArg || answers.projectName;
  const targetDir = path.join(process.cwd(), projectName);

  if (fs.existsSync(targetDir)) {
    console.log(chalk.red("❌ Folder already exists!"));
    process.exit(1);
  }

  await generateProject(projectName, answers, targetDir);
});
