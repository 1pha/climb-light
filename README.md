# 🧗 Climb Light

Transform your climbing videos into beautiful highlight moments with AI-powered detection and fun nanobanana decorations! 🍌✨

![Climb Light](assets/logo.png)

## ✨ Features

- 📹 **Easy Video Upload** - Drag & drop or click to upload climbing videos
- 🤖 **AI-Powered Highlight Detection** - Automatic detection of exciting climbing moments using OpenAI Vision API
- 🍌 **Nanobanana Decorations** - Fun, randomized banana sticker decorations on highlights
- 📱 **Mobile-Responsive** - Beautiful design that works on all devices
- 💰 **Google Ads Integration** - Ad slots ready for monetization
- ⬇️ **Download Highlights** - Save decorated highlight frames
- 📤 **Social Sharing** - Share your climbing highlights easily

## 🚀 Quick Start

### Demo Mode (No API Key Required)

1. Open `index.html` in a web browser
2. Click "Upload Video Now"
3. Upload a climbing video
4. The demo will randomly select highlights and add nanobanana decorations

### Production Mode (With AI)

1. Get an OpenAI API key from [OpenAI Platform](https://platform.openai.com/)
2. Edit `js/config.js`:
   ```javascript
   ai: {
     provider: 'openai',
     apiKey: 'YOUR_OPENAI_API_KEY_HERE', // Add your key here
     ...
   },
   app: {
     demoMode: false, // Change to false
   }
   ```
3. Open `index.html` and upload your video!

## 📁 Project Structure

```
climb-light/
├── index.html          # Landing page
├── upload.html         # Video upload interface
├── results.html        # Highlight results gallery
├── css/
│   └── style.css       # Complete design system
├── js/
│   ├── config.js       # Configuration (API keys, settings)
│   ├── video-processor.js  # Video frame extraction & AI analysis
│   ├── decoration.js   # Nanobanana decoration system
│   └── main.js         # Main utilities
├── assets/
│   ├── logo.png        # Climb Light logo
│   └── nanobanana_*.png  # Nanobanana sticker decorations
└── README.md
```

## ⚙️ Configuration

Edit `js/config.js` to customize:

### AI Settings
- `apiKey` - Your OpenAI API key
- `model` - GPT model to use (gpt-4o-mini recommended)
- `highlightThreshold` - Score threshold for highlights (0-100)
- `systemPrompt` - Custom AI prompt for highlight detection

### Video Processing
- `maxSizeMB` - Maximum video file size
- `frameExtractionInterval` - Seconds between extracted frames
- `maxFramesToAnalyze` - Limit frames sent to AI (cost control)

### Google Ads
- `publisherId` - Your Google AdSense publisher ID
- `enabled` - Set to true when ready to show ads

### Decorations
- `nanobananaCount` - Number of stickers per highlight
- `randomRotation` - Enable/disable random rotation
- `scaleRange` - Size variation range
- `rotationRange` - Rotation angle range

## 💰 Google Ads Setup

1. Create a [Google AdSense account](https://www.google.com/adsense/)
2. Get your publisher ID (format: `ca-pub-XXXXXXXXXX`)
3. Uncomment the AdSense script in HTML files
4. Update `js/config.js`:
   ```javascript
   ads: {
     enabled: true,
     publisherId: 'ca-pub-XXXXXXXXXX',
   }
   ```
5. Add your ad unit codes to the ad placeholders in HTML files

## 🎨 Design Features

- Vibrant gradient color schemes
- Smooth animations and transitions
- Glassmorphism effects
- Mobile-first responsive design
- Modern typography (Outfit & Poppins fonts)
- Interactive hover effects

## 🔧 Technical Details

### Video Processing
- Client-side frame extraction using HTML5 Canvas
- Supports MP4, MOV, AVI, WebM formats
- Configurable frame sampling rate
- Progress tracking during processing

### AI Integration
- OpenAI Vision API (GPT-4 Vision)
- Frames analyzed for climbing highlight moments
- Scoring system (0-100) for each frame
- Configurable threshold for highlight selection

### Decoration System
- Canvas-based image composition
- Random sticker placement with collision avoidance
- Rotation and scale transformations
- PNG export with transparency

## 📱 Browser Compatibility

- ✅ Chrome/Edge (recommended)
- ✅ Safari
- ✅ Firefox
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🚀 Deployment

### Option 1: Static Hosting (GitHub Pages, Netlify, Vercel)

1. Push code to GitHub repository
2. Enable GitHub Pages in repository settings, or
3. Connect to Netlify/Vercel for automatic deployment

### Option 2: Traditional Web Hosting

1. Upload all files to your web server via FTP
2. Ensure `index.html` is in the root directory
3. Configure your API key and Google Ads

## 📝 API Cost Considerations

- OpenAI Vision API charges per image analyzed
- Default config extracts 1 frame every 2 seconds
- A 60-second video = ~30 frames
- `maxFramesToAnalyze` limits frames (default: 20)
- Estimated cost: ~$0.01-0.05 per video (with GPT-4o-mini)

To reduce costs:
- Increase `frameExtractionInterval` (e.g., 3-5 seconds)
- Decrease `maxFramesToAnalyze` (e.g., 10-15 frames)
- Use demo mode for testing

## 🤝 Contributing

Feel free to customize this project for your needs:
- Modify the color scheme in `css/style.css`
- Add more nanobanana sticker variants
- Adjust AI prompts for better highlight detection
- Add new features like video playback or social features

## 📄 License

This project is open source and available for personal and commercial use.

## 🙏 Credits

- Design inspired by [ktestone.com](https://ktestone.com)
- AI powered by OpenAI
- Nanobanana graphics generated with AI

---

Made with ❤️ for climbers worldwide 🧗‍♀️🧗‍♂️
