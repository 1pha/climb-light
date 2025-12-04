// Configuration file for Climb Light
// IMPORTANT: Replace these values with your actual API keys and IDs

const CONFIG = {
  // AI API Configuration
  // Using Google Gemini Vision API
  ai: {
    provider: 'gemini', // Using Google Gemini
    apiKey: 'AIzaSyAhM7TVn6k2ZF_wIJ8dUFpGaQK3WBioEkg',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
    model: 'gemini-1.5-flash',

    // Prompt for highlight detection
    systemPrompt: `Analyze this climbing video frame and rate how likely it is a highlight moment (0-100).
Consider: dynamic movement, challenging holds, impressive technique, reaching summits, celebrations, difficult positions.
Respond with ONLY a number between 0-100, nothing else.`,

    highlightThreshold: 65 // Frames scoring above this are considered highlights
  },

  // Video Processing Settings
  video: {
    maxSizeMB: 500,
    acceptedFormats: ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'],
    frameExtractionInterval: 2, // Extract 1 frame every N seconds
    maxFramesToAnalyze: 20 // Limit frames sent to AI (cost control)
  },

  // Google AdSense Configuration
  ads: {
    enabled: true,
    publisherId: 'ca-pub-4436266100487526',
  },

  // Decoration Settings
  decorations: {
    nanobananaCount: 3, // Number of nanobanana stickers per highlight
    randomRotation: true,
    randomScale: true,
    scaleRange: [0.8, 1.2],
    rotationRange: [-15, 15],
  },

  // App Settings
  app: {
    name: 'Climb Light',
    version: '1.0.0',
    demoMode: false, // Real AI enabled!
  }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
