// Decoration System - Adds nanobanana stickers to highlight frames
// Handles image decoration and export

class FrameDecorator {
    constructor() {
        this.nanobananaSources = [
            'assets/nanobanana_sticker_1_1764822285404.png',
            'assets/nanobanana_sticker_2_1764822299659.png',
            'assets/nanobanana_sticker_3_1764822328853.png'
        ];
    }

    // Decorate a frame with nanobanana stickers
    async decorateFrame(frameDataUrl) {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const baseImage = new Image();

            baseImage.onload = async () => {
                try {
                    // Set canvas size to match image
                    canvas.width = baseImage.width;
                    canvas.height = baseImage.height;

                    // Draw base image first (the video frame)
                    ctx.drawImage(baseImage, 0, 0);

                    console.log('Base image drawn:', canvas.width, 'x', canvas.height);

                    // Add nanobanana stickers on top
                    await this.addStickers(ctx, canvas.width, canvas.height);

                    // Return the decorated image
                    const result = canvas.toDataURL('image/png');
                    console.log('Decoration complete, data URL length:', result.length);
                    resolve(result);
                } catch (error) {
                    console.error('Error during decoration:', error);
                    // If decoration fails, just return the base image
                    resolve(frameDataUrl);
                }
            };

            baseImage.onerror = (error) => {
                console.error('Error loading base image:', error);
                reject(error);
            };

            baseImage.src = frameDataUrl;
        });
    }

    // Draw a programmatic Nanobanana sticker
    drawNanobanana(ctx, x, y, size, rotation) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((rotation * Math.PI) / 180);

        const s = size / 100; // Scale factor based on 100px reference size
        ctx.scale(s, s);

        // Draw Banana Body
        ctx.beginPath();
        ctx.moveTo(-20, -40);
        ctx.quadraticCurveTo(40, -10, 20, 50); // Outer curve
        ctx.quadraticCurveTo(-10, 40, -30, 0); // Inner curve
        ctx.quadraticCurveTo(-35, -20, -20, -40); // Top join
        ctx.closePath();

        ctx.fillStyle = '#FFD700'; // Banana Yellow
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#FFFFFF'; // White outline
        ctx.stroke();

        // Sunglasses
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.moveTo(-15, -10);
        ctx.lineTo(5, -5);
        ctx.lineTo(25, -15);
        ctx.lineTo(22, 5);
        ctx.lineTo(2, 8);
        ctx.lineTo(-18, 5);
        ctx.closePath();
        ctx.fill();

        // Smile
        ctx.beginPath();
        ctx.arc(0, 15, 10, 0.2 * Math.PI, 0.8 * Math.PI);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
    }

    // Add nanobanana stickers to the context
    async addStickers(ctx, width, height) {
        const count = CONFIG.decorations.nanobananaCount;

        console.log(`Adding ${count} programmatic stickers...`);

        for (let i = 0; i < count; i++) {
            // Random position (avoiding edges)
            const x = Math.random() * (width * 0.8) + (width * 0.1);
            const y = Math.random() * (height * 0.8) + (height * 0.1);

            // Random scale
            const scale = CONFIG.decorations.randomScale
                ? CONFIG.decorations.scaleRange[0] + Math.random() * (CONFIG.decorations.scaleRange[1] - CONFIG.decorations.scaleRange[0])
                : 1;

            // Random rotation
            const rotation = CONFIG.decorations.randomRotation
                ? CONFIG.decorations.rotationRange[0] + Math.random() * (CONFIG.decorations.rotationRange[1] - CONFIG.decorations.rotationRange[0])
                : 0;

            const size = Math.min(width, height) * 0.2 * scale; // 20% of screen size

            this.drawNanobanana(ctx, x, y, size, rotation);
        }
    }

    // Helper: random number in range
    randomInRange(min, max) {
        return min + Math.random() * (max - min);
    }

    // Download decorated image
    downloadImage(dataUrl, filename) {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Initialize on results page
if (window.location.pathname.includes('results.html')) {
    const decorator = new FrameDecorator();
    const resultsGrid = document.getElementById('resultsGrid');
    const noResults = document.getElementById('noResults');
    const shareBtn = document.getElementById('shareBtn');

    // Load and display results
    async function loadResults() {
        const savedData = localStorage.getItem('climbLightResults');

        if (!savedData) {
            // No results found
            noResults.classList.remove('hidden');
            return;
        }

        const data = JSON.parse(savedData);
        const highlights = data.highlights;

        if (highlights.length === 0) {
            noResults.classList.remove('hidden');
            return;
        }

        // Display each highlight
        for (let i = 0; i < highlights.length; i++) {
            const highlight = highlights[i];

            try {
                // Decorate frame
                const decoratedDataUrl = await decorator.decorateFrame(highlight.dataUrl);

                // Create result card
                const card = createResultCard(highlight, decoratedDataUrl, i);
                resultsGrid.appendChild(card);

                // Animate card appearance with delay
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.classList.add('fade-in');
                }, i * 100);
            } catch (error) {
                console.error(`Error decorating frame ${i}:`, error);
                // Still show the frame even if decoration fails
                const card = createResultCard(highlight, highlight.dataUrl, i);
                resultsGrid.appendChild(card);
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.classList.add('fade-in');
                }, i * 100);
            }
        }
    }

    // Create a result card element
    function createResultCard(highlight, decoratedDataUrl, index) {
        const card = document.createElement('div');
        card.className = 'result-card';
        card.style.opacity = '0';

        const img = document.createElement('img');
        img.src = decoratedDataUrl;
        img.alt = `Highlight ${index + 1}`;
        img.className = 'result-image';

        const overlay = document.createElement('div');
        overlay.className = 'result-overlay';
        overlay.innerHTML = `
      <p style="color: white; font-weight: 600;">
        ⏱️ ${formatTimestamp(highlight.timestamp)}
      </p>
      ${highlight.score ? `<p style="color: white; opacity: 0.9; font-size: 0.875rem;">Score: ${highlight.score}/100</p>` : ''}
    `;

        const actions = document.createElement('div');
        actions.className = 'result-actions';

        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'icon-btn';
        downloadBtn.innerHTML = '⬇️';
        downloadBtn.title = 'Download';
        downloadBtn.onclick = () => {
            decorator.downloadImage(decoratedDataUrl, `climb-highlight-${index + 1}.png`);
        };

        actions.appendChild(downloadBtn);

        card.appendChild(img);
        card.appendChild(overlay);
        card.appendChild(actions);

        return card;
    }

    // Format timestamp (seconds to MM:SS)
    function formatTimestamp(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Share functionality
    shareBtn.addEventListener('click', async () => {
        const text = `Check out my climbing highlights from Climb Light! 🧗🍌`;
        const url = window.location.href;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Climb Light Highlights',
                    text: text,
                    url: url
                });
            } catch (error) {
                console.log('Share cancelled or failed:', error);
            }
        } else {
            // Fallback: copy link to clipboard
            navigator.clipboard.writeText(url).then(() => {
                alert('Link copied to clipboard!');
            });
        }
    });

    // Load results on page load
    loadResults();
}
