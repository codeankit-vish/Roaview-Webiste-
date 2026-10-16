// Vercel Speed Insights initialization
// This script initializes Vercel Speed Insights for tracking web vitals
import { injectSpeedInsights } from '../node_modules/@vercel/speed-insights/dist/index.mjs';

// Initialize Speed Insights when the page loads
injectSpeedInsights();
