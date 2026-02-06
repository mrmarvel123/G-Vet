// Updated package.json scripts section
// Add these scripts to your existing package.json

{
"scripts": {
// Existing scripts...
"start": "node server.js",
"dev": "nodemon server.js",
"migrate": "node database/migrate.js",
"seed": "node database/seed.js",
"backup": "node scripts/backup.js",
"restore": "node scripts/restore.js",

    // NEW: Refactoring & Migration Scripts
    "refactor:guide": "cat PROJECT_RESTRUCTURE_GUIDE.md",
    "refactor:migrate": "node scripts/refactor-migrate.js",
    "refactor:migrate:dry": "node scripts/refactor-migrate.js --dry-run",
    "refactor:migrate:backup": "node scripts/refactor-migrate.js --backup",
    "refactor:validate": "node scripts/validate-env.js",

    // Testing scripts
    "test": "jest --coverage",
    "test:watch": "jest --watch",
    "test:integration": "jest --testPathPattern=__tests__/integration",

    // Code quality scripts
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",

    // Build & deployment
    "build": "npm run lint && npm run test",
    "predeploy": "npm run build",
    "deploy": "echo 'Deploy script here'",

    // Health check
    "health": "curl -s http://localhost:3000/api/health | jq .",
    "logs": "tail -f logs/combined.log",
    "logs:error": "tail -f logs/error.log",
    "logs:audit": "tail -f logs/audit.log"

},

"devDependencies": {
"nodemon": "^3.0.1",
"jest": "^29.5.0",
"supertest": "^6.3.3",
"eslint": "^8.40.0",
"prettier": "^2.8.8"
},

"nodemonConfig": {
"watch": ["src", "server.js"],
"ignore": ["uploads/*", "logs/*", "backups/*"]
}
}
