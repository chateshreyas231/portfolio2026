#!/usr/bin/env node

/**
 * Dev script wrapper to suppress "Environments: .env.local" message
 */
const { spawn } = require('child_process');

const nextDev = spawn('next', ['dev'], {
  shell: true,
  stdio: ['inherit', 'pipe', 'pipe'],
});

// Filter stdout to remove "Environments:" line
nextDev.stdout.on('data', (data) => {
  const lines = data.toString().split('\n');
  lines.forEach((line) => {
    if (!line.includes('Environments:')) {
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

