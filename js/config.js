// Configuration file for Climb Light
// IMPORTANT: Replace these values with your actual API keys and IDs

const CONFIG = {
  // AI API Configuration
  // Currently configured for OpenAI Vision API
  // You can also use: Google Cloud Video Intelligence, Roboflow, etc.
  ai: {
    provider: 'openai', // Options: 'openai', 'demo'
    apiKey: 'YOUR_OPENAI_API_KEY_HERE', // Replace with your actual API key
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4o-mini', // or 'gpt-4-vision-preview'
    
    // Prompt for highlight detection
    systemPrompt: `You are an expert at analyzing climbing videos. 
    Analyze this frame and rate how likely it is a highlight moment (0-100).
    Consider: dynamic movement, challenging holds, impressive technique, reaching summits, falls, celebrations.
    Respond with ONLY a number 0-100.`,
    
    highlightThreshold: 60 // Frames scoring above this are considered highlights
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
    enabled: false, // Set to true when you add your publisher ID
    publisherId: 'ca-pub-XXXXXXXXXX', // Replace with your AdSense publisher ID
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
    demoMode: true, // Set to false when you have a real API key
  }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
