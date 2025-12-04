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
                // Set canvas size to match image
                canvas.width = baseImage.width;
                canvas.height = baseImage.height;

                // Draw base image
                ctx.drawImage(baseImage, 0, 0);

                // Add nanobanana stickers
                try {
                    await this.addStickers(ctx, canvas.width, canvas.height);
                    resolve(canvas.toDataURL('image/png'));
                } catch (error) {
                    reject(error);
                }
            };

            baseImage.onerror = reject;
            baseImage.src = frameDataUrl;
        });
    }

    // Add nanobanana stickers to canvas
    async addStickers(ctx, width, height) {
        const count = CONFIG.decorations.nanobananaCount;
        const loadedStickers = await this.loadStickers();

        for (let i = 0; i < count; i++) {
            // Select random sticker
            const sticker = loadedStickers[Math.floor(Math.random() * loadedStickers.length)];

            // Calculate random position (avoid edges)
            const margin = 50;
            const x = margin + Math.random() * (width - 2 * margin - sticker.width);
            const y = margin + Math.random() * (height - 2 * margin - sticker.height);

            // Apply transformations
            ctx.save();
            ctx.translate(x + sticker.width / 2, y + sticker.height / 2);

            // Random rotation
            if (CONFIG.decorations.randomRotation) {
                const rotation = this.randomInRange(
                    CONFIG.decorations.rotationRange[0],
                    CONFIG.decorations.rotationRange[1]
                ) * Math.PI / 180;
                ctx.rotate(rotation);
            }

            // Random scale
            let scale = 1;
            if (CONFIG.decorations.randomScale) {
                scale = this.randomInRange(
                    CONFIG.decorations.scaleRange[0],
                    CONFIG.decorations.scaleRange[1]
                );
                ctx.scale(scale, scale);
            }

            // Draw sticker
            ctx.drawImage(
                sticker,
                -sticker.width / 2,
                -sticker.height / 2,
                sticker.width,
                sticker.height
            );

            ctx.restore();
        }
    }

    // Load all nanobanana sticker images
    async loadStickers() {
        const promises = this.nanobananaSources.map(src => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = src;
            });
        });

        return Promise.all(promises);
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

            // Decorate frame
            const decoratedDataUrl = await decorator.decorateFrame(highlight.dataUrl);

            // Create result card
            const card = createResultCard(highlight, decoratedDataUrl, i);
            resultsGrid.appendChild(card);

            // Animate card appearance
            setTimeout(() => {
                card.classList.add('fade-in');
            }, i * 100);
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
