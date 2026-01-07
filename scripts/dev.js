#!/usr/bin/env node

/**
 * Dev script wrapper
 * Set SHOW_ENV_INFO=true to see "Environments: .env.local" message
 */
const { spawn } = require('child_process');

const showEnvInfo = process.env.SHOW_ENV_INFO === 'true';

const nextDev = spawn('next', ['dev'], {
  shell: true,
  stdio: ['inherit', 'pipe', 'pipe'],
});

// Filter stdout to remove "Environments:" line (unless SHOW_ENV_INFO is set)
nextDev.stdout.on('data', (data) => {
  const lines = data.toString().split('\n');
  lines.forEach((line) => {
    if (showEnvInfo || !line.includes('Environments:')) {
      process.stdout.write(line + '\n');
    }
  });
});

// Pass stderr through
nextDev.stderr.on('data', (data) => {
  process.stderr.write(data);
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

