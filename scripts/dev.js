#!/usr/bin/env node

/**
 * Dev script wrapper to suppress "Environments: .env.local" message
 */
const { spawn } = require('child_process');

const nextDev = spawn('next', ['dev'], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    // Suppress Next.js environment file logging
    NEXT_PRIVATE_SKIP_ENV_FILE_LOG: '1',
  },
});

nextDev.on('error', (error) => {
  console.error('Error starting Next.js dev server:', error);
  process.exit(1);
});

nextDev.on('exit', (code) => {
  process.exit(code || 0);
});

// Handle Ctrl+C
process.on('SIGINT', () => {
  nextDev.kill('SIGINT');
});

process.on('SIGTERM', () => {
  nextDev.kill('SIGTERM');
});

