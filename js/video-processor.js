// Video Processing and AI Highlight Detection
// Handles video upload, frame extraction, and AI analysis

class VideoProcessor {
    constructor() {
        this.videoFile = null;
        this.frames = [];
        this.highlights = [];
        this.progressCallback = null;
    }

    // Process uploaded video
    async processVideo(file, progressCallback) {
        this.videoFile = file;
        this.progressCallback = progressCallback;

        try {
            // Update progress
            this.updateProgress(10, 'Loading video...');

            // Extract frames from video
            this.frames = await this.extractFrames();
            this.updateProgress(40, 'Frames extracted...');

            // Analyze frames with AI
            if (CONFIG.app.demoMode) {
                this.highlights = await this.demoAnalyze();
            } else {
                this.highlights = await this.analyzeWithAI();
            }
            this.updateProgress(80, 'Highlights detected...');

            // Store results for results page
            this.saveResults();
            this.updateProgress(100, 'Complete!');

            return this.highlights;
        } catch (error) {
            console.error('Error processing video:', error);
            throw error;
        }
    }

    // Extract frames from video using Canvas
    async extractFrames() {
        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const frames = [];

            video.preload = 'auto';
            video.src = URL.createObjectURL(this.videoFile);

            video.onloadedmetadata = () => {
                canvas.width = Math.min(video.videoWidth, 640); // Limit size for performance
                canvas.height = (canvas.width / video.videoWidth) * video.videoHeight;

                const duration = video.duration;
                const interval = CONFIG.video.frameExtractionInterval;
                const totalFrames = Math.min(
                    Math.floor(duration / interval),
                    CONFIG.video.maxFramesToAnalyze
                );

                let currentFrame = 0;

                const captureFrame = () => {
                    if (currentFrame >= totalFrames) {
                        URL.revokeObjectURL(video.src);
                        resolve(frames);
                        return;
                    }

                    const timePosition = currentFrame * interval;
                    video.currentTime = timePosition;
                };

                video.onseeked = () => {
                    try {
                        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);

                        frames.push({
                            timestamp: video.currentTime,
                            dataUrl: dataUrl,
                            index: currentFrame
                        });

                        currentFrame++;

                        // Update progress during frame extraction
                        const extractionProgress = 10 + (currentFrame / totalFrames) * 30;
                        this.updateProgress(extractionProgress, `Extracting frames... ${currentFrame}/${totalFrames}`);

                        captureFrame();
                    } catch (error) {
                        reject(error);
                    }
                };

                video.onerror = reject;
                captureFrame();
            };

            video.onerror = reject;
        });
    }

    // Demo mode: randomly select frames as highlights
    async demoAnalyze() {
        // Simulate AI processing time
        await this.sleep(1500);

        // Randomly select 3-6 frames as highlights
        const numHighlights = Math.floor(Math.random() * 4) + 3;
        const highlights = [];
        const shuffled = [...this.frames].sort(() => 0.5 - Math.random());

        for (let i = 0; i < Math.min(numHighlights, shuffled.length); i++) {
            highlights.push({
                ...shuffled[i],
                score: Math.floor(Math.random() * 40) + 60, // Random score 60-100
                reason: this.getRandomReason()
            });
        }

        return highlights.sort((a, b) => a.timestamp - b.timestamp);
    }

    // Analyze frames with AI and return top N
    async analyzeWithAI() {
        const scoredFrames = [];

        for (let i = 0; i < this.frames.length; i++) {
            const frame = this.frames[i];

            try {
                const result = await this.analyzeFrame(frame.dataUrl);

                // Store all frames with their scores and reasons
                scoredFrames.push({
                    ...frame,
                    score: result.score,
                    reason: result.reason || 'AI가 감지한 하이라이트'
                });

                // Update progress
                const analysisProgress = 40 + ((i + 1) / this.frames.length) * 40;
                this.updateProgress(analysisProgress, `프레임 분석 중 ${i + 1}/${this.frames.length}...`);

            } catch (error) {
                console.error(`Error analyzing frame ${i}:`, error);
                // Add frame with score 0 if analysis fails
                scoredFrames.push({
                    ...frame,
                    score: 0,
                    reason: '분석 실패'
                });
            }
        }

        // Sort by score descending and take top N
        const topN = CONFIG.ai.topN || 5;
        const highlights = scoredFrames
            .sort((a, b) => b.score - a.score)
            .slice(0, topN);

        console.log(`Selected top ${topN} frames from ${scoredFrames.length} analyzed`);
        console.log('Scores:', highlights.map(h => h.score));

        return highlights;
    }

    // Call Google Gemini Vision API to analyze a single frame
    async analyzeFrame(imageDataUrl) {
        const base64Image = imageDataUrl.split(',')[1];

        const requestBody = {
            contents: [{
                parts: [
                    {
                        text: CONFIG.ai.systemPrompt
                    },
                    {
                        inline_data: {
                            mime_type: "image/jpeg",
                            data: base64Image
                        }
                    }
                ]
            }]
        };

        const response = await fetch(`${CONFIG.ai.endpoint}?key=${CONFIG.ai.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API error:', errorText);
            throw new Error(`API call failed: ${response.statusText}`);
        }

        const data = await response.json();

        // Extract the score and reason from Gemini's response
        const responseText = data.candidates[0].content.parts[0].text.trim();

        // Clean up markdown code blocks if present
        const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

        try {
            const result = JSON.parse(jsonStr);
            console.log('Gemini API response:', result);
            return result; // Returns { score: number, reason: string }
        } catch (e) {
            console.error('Failed to parse JSON response:', responseText);
            // Fallback for non-JSON response
            const score = parseInt(responseText) || 0;
            return { score, reason: "하이라이트 분석 완료" };
        }
    }

    // Get random reason for demo mode
    getRandomReason() {
        const reasons = [
            'Dynamic movement detected',
            'Challenging hold achieved',
            'Impressive technique shown',
            'Peak moment captured',
            'Exciting sequence found',
            'Great form displayed'
        ];
        return reasons[Math.floor(Math.random() * reasons.length)];
    }

    // Update progress
    updateProgress(percent, message) {
        if (this.progressCallback) {
            this.progressCallback(percent, message);
        }
    }

    // Save results to localStorage
    saveResults() {
        // Save just the highlights array (matching what results.html expects)
        localStorage.setItem('climbLight_highlights', JSON.stringify(this.highlights));
    }

    // Helper: sleep function
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// End of VideoProcessor class
