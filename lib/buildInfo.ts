/**
 * Build Information
 * Used to verify deployments and cache busting
 */

// This will be set during build time
export const BUILD_TIMESTAMP = process.env.BUILD_TIMESTAMP || new Date().toISOString();
export const BUILD_VERSION = process.env.BUILD_VERSION || 'dev';
export const GIT_COMMIT = process.env.GIT_COMMIT || 'unknown';

/**
 * Get build info for debugging
 */
export function getBuildInfo() {
  return {
    timestamp: BUILD_TIMESTAMP,
    version: BUILD_VERSION,
    commit: GIT_COMMIT.substring(0, 7), // Short commit hash
  };
}

/**
 * Get build info as string for display
 */
export function getBuildInfoString() {
  const info = getBuildInfo();
  return `Build: ${info.version} | ${new Date(info.timestamp).toLocaleString()} | ${info.commit}`;
}

