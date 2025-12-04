// Configuration file for Climb Light
// IMPORTANT: Replace these values with your actual API keys and IDs

const CONFIG = {
  // AI API Configuration
  // Using Google Gemini Vision API
  ai: {
    provider: 'gemini', // Using Google Gemini
    apiKey: 'YOUR_GOOGLE_GEMINI_API_KEY_HERE', // ⚠️ Add your API key here
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent',
    model: 'gemini-pro-vision',

    // Prompt for highlight detection (Korean)
    systemPrompt: `이 클라이밍 비디오 프레임을 분석하고 하이라이트 순간일 가능성을 평가해주세요 (0-100).
고려사항: 역동적인 움직임, 어려운 홀드, 인상적인 기술, 완등, 축하, 어려운 자세, 또는 재미있는 순간.
다음 형식의 JSON으로만 응답해주세요:
{
  "score": 0-100 사이의 숫자,
  "reason": "이 프레임이 하이라이트로 선정된 이유를 설명하는 짧고 묘사적인 한국어 문장"
}`,

    topN: 5 // Show top N highest-scoring frames
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

  // App Settings
  app: {
    name: 'Climb Light',
    version: '1.1.0',
    demoMode: false,
  }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
