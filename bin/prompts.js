
/**
 * Validates groupId format according to Java package naming conventions
 */
export function validateGroupId(input) {
  if (!input || input.trim() === '') {
    return 'Group ID cannot be empty';
  }
  
  const groupId = input.trim();
  
  // Check for invalid characters (must be lowercase letters, numbers, dots, dashes, underscores)
  if (!/^[a-z0-9._-]+$/.test(groupId)) {
    return 'Group ID must contain only lowercase letters, numbers, dots, dashes, and underscores';
  }
  
  // Must not start or end with dot
  if (groupId.startsWith('.') || groupId.endsWith('.')) {
    return 'Group ID cannot start or end with a dot';
  }
  
  // Must not have consecutive dots
  if (groupId.includes('..')) {
    return 'Group ID cannot contain consecutive dots';
  }
  
  // Should have at least one dot (recommended convention)
  if (!groupId.includes('.')) {
    return 'Group ID should follow reverse domain convention (e.g., com.example)';
  }
  
  // Each segment should not start with a number
  const segments = groupId.split('.');
  for (const segment of segments) {
    if (/^[0-9]/.test(segment)) {
      return `Invalid segment "${segment}": package segments cannot start with a number`;
    }
    if (segment.length === 0) {
      return 'Group ID cannot have empty segments';
    }
  }
  
  return true;
}

/**
 * Validates project name
 */
export function validateProjectName(input) {
  if (!input || input.trim() === '') {
    return 'Project name cannot be empty';
  }
  
  const name = input.trim();
  
  // Check for invalid characters (alphanumeric, dash, underscore only)
  if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
    return 'Project name can only contain letters, numbers, dashes, and underscores';
  }
  
  // Should not start with a dash or underscore
  if (/^[-_]/.test(name)) {
    return 'Project name should not start with a dash or underscore';
  }
  
  return true;
}

export const questions = [
  {
    type: "list",
    name: "frontend",
    message: "Select Frontend Framework:",
    choices: [
      { name: "Vite (Recommended)", value: "vite" },
      { name: "Create React App (Legacy)", value: "cra" }
    ]
  },
  {
    type: "list",
    name: "backend",
    message: "Select Backend Language:",
    choices: [
      { name: "Java", value: "java" },
      { name: "Kotlin", value: "kotlin" },
      { name: "Groovy", value: "groovy" }
    ]
  },
  {
    type: "list",
    name: "buildTool",
    message: "Select Build Tool:",
    choices: [
      { name: "Maven", value: "maven" },
      { name: "Gradle (Groovy DSL)", value: "gradle" }
    ]
  },
  {
    type: "list",
    name: "packaging",
    message: "Select Packaging:",
    choices: [
      { name: "Jar", value: "jar" },
      { name: "War", value: "war" }
    ]
  },
  {
    type: "list",
    name: "database",
    message: "Select Database:",
    choices: [
      { name: "H2 (In-Memory, Development/Testing)", value: "h2" },
      { name: "PostgreSQL (Production)", value: "postgresql" },
      { name: "MySQL (Production)", value: "mysql" },
      { name: "None (Manual configuration)", value: "none" }
    ],
    default: "h2"
  },
  {
    type: "confirm",
    name: "security",
    message: "Add Spring Security?",
    default: false
  },
  {
    type: "input",
    name: "groupId",
    message: "Group ID (e.g., com.mycompany):",
    default: "com.example",
    validate: validateGroupId
  },
  {
    type: "list",
    name: "springBootVersion",
    message: "Spring Boot Version:",
    choices: [
      { name: "3.2.1 (Latest Stable)", value: "3.2.1" },
      { name: "3.1.7 (Previous Stable)", value: "3.1.7" },
      { name: "3.0.13 (Legacy)", value: "3.0.13" }
    ],
    default: "3.2.1"
  },
  {
    type: "list",
    name: "javaVersion",
    message: "Java Version:",
    choices: ["17", "21"],
    default: "17"
  }
];

export function getProjectNameQuestion(defaultName) {
    return {
        type: "input",
        name: "projectName",
        message: "Project name:",
        default: defaultName || "my-react-spring-app",
        validate: validateProjectName
    };
}
