// Result Card System - Displays highlight frames with reasons and actions
// Handles image export and UI generation

class FrameDecorator {
    constructor() {
        // No more stickers!
    }

    // Process a frame (now just passes through, no decoration)
    async decorateFrame(frameDataUrl) {
        return frameDataUrl; // Return original frame without changes
    }

    // Create a result card element
    createResultCard(highlight, index) {
        const card = document.createElement('div');
        card.className = 'card result-card fade-in';
        card.style.animationDelay = `${index * 0.1}s`;

        // Create image container
        const imgContainer = document.createElement('div');
        imgContainer.className = 'result-image-container';

        const img = document.createElement('img');
        img.src = highlight.dataUrl; // Use original frame
        img.alt = `Highlight ${index + 1}`;
        img.className = 'result-image';

        // Add score badge
        const badge = document.createElement('div');
        badge.className = 'score-badge';
        badge.textContent = `점수: ${highlight.score}`;

        imgContainer.appendChild(img);
        imgContainer.appendChild(badge);

        // Create content container
        const content = document.createElement('div');
        content.className = 'result-content';

        // Reason text
        const reason = document.createElement('p');
        reason.className = 'highlight-reason';
        reason.style.cssText = 'margin-bottom: 1rem; font-size: 0.95rem; line-height: 1.5; color: var(--text-color);';
        reason.textContent = highlight.reason || 'AI가 선정한 최고의 순간입니다.';

        // Action buttons container
        const actions = document.createElement('div');
        actions.className = 'result-actions';
        actions.style.cssText = 'display: flex; gap: 0.5rem; margin-top: auto;';

        // Download Button
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'btn btn-secondary btn-sm';
        downloadBtn.innerHTML = '💾 저장';
        downloadBtn.style.flex = '1';
        downloadBtn.onclick = () => this.downloadImage(highlight.dataUrl, `climb-light-highlight-${index + 1}.png`);

        // Further Usage Button
        const usageBtn = document.createElement('button');
        usageBtn.className = 'btn btn-primary btn-sm';
        usageBtn.innerHTML = '✨ 꾸미기';
        usageBtn.style.flex = '1';
        usageBtn.onclick = () => window.open('https://ai.google.dev/gemini-api/docs/image-generation#javascript_1', '_blank');

        actions.appendChild(downloadBtn);
        actions.appendChild(usageBtn);

        content.appendChild(reason);
        content.appendChild(actions);

        card.appendChild(imgContainer);
        card.appendChild(content);

        return card;
    }

    // Download image
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
