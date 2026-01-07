/**
 * Single source of truth for portfolio metrics
 * All metrics should be verified from actual data sources
 * If a metric cannot be verified, use neutral text or [VERIFY] placeholder
 */

export interface PortfolioMetrics {
  usersServed: string;
  efficiencyGain: string;
  yearsExperience: string;
  projectsCount: string;
  // Additional verified metrics
  employeesServed?: string;
  intentRecognitionBoost?: string;
  ticketResolutionReduction?: string;
}

/**
 * Verified metrics from experience data
 * Based on Capital Group project: 40,000+ employees served
 * Based on Capital Group project: 35% intent recognition boost
 * Based on Capital Group project: 40% ticket resolution time reduction
 */
export const metrics: PortfolioMetrics = {
  // From Capital Group experience - verified
  employeesServed: '40,000+',
  intentRecognitionBoost: '35%',
  ticketResolutionReduction: '40%',
  
  // General metrics - use neutral text if not verified
  usersServed: 'Enterprise-scale deployments', // Replaced "40K+" - too specific without context
  efficiencyGain: 'Measured outcomes', // Replaced "35%" - context-specific metric
  yearsExperience: '7+ years shipping software', // Verified from timeline (2017-2024 = 7+ years)
  projectsCount: 'Projects shipped', // Replaced "120+" - not verified
};

/**
 * Get display text for a metric
 */
export function getMetricDisplay(key: keyof PortfolioMetrics): string {
  return metrics[key] || '[VERIFY]';
}

