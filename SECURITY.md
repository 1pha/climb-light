# Climb Light - Security Instructions

## 🚨 API Key Exposed on GitHub!

Your Google Gemini API key was pushed to GitHub and is now PUBLIC. Anyone can see and use it!

## ⚡ IMMEDIATE ACTIONS REQUIRED

### 1. Regenerate API Key (Do This NOW!)

1. Go to [Google Cloud Console - API Credentials](https://console.cloud.google.com/apis/credentials)
2. Find your API key: `AIzaSyAhM7TVn6k2ZF_wIJ8dUFpGaQK3WBioEkg`
3. Click **Delete** to revoke it
4. Click **Create Credentials** → **API Key**
5. **Restrict the new key:**
   - **API restrictions**: Only allow "Generative Language API"
   - **Application restrictions**: HTTP referrers
   - **Add referrers**: 
     - `https://1pha.github.io/*`
     - `http://localhost:*` (for local testing)

### 2. Update Your Local Config

After getting your NEW API key:

```bash
# Edit the LOCAL config file (NOT in git)
nano js/config.local.js

# Replace YOUR_NEW_API_KEY_HERE with your new key
```

### 3. Deploy Safely

For GitHub Pages deployment, you have 2 options:

#### Option A: Client-Side (Simple but Key Visible)
- Users can see the key in browser dev tools
- Acceptable if you've set HTTP referrer restrictions
- Key only works on your domain

#### Option B: Backend Proxy (Secure but Complex)
- Deploy a simple backend (Cloudflare Workers, Vercel Functions)
- Backend holds the API key
- Frontend calls your backend, backend calls Gemini
- Key never exposed to client

## 📁 Project Setup

I've created two config files:

1. **`js/config.js`** (IN GIT) - Template with placeholder
2. **`js/config.local.js`** (NOT IN GIT) - Your actual key

For local development:
```html
<!-- In HTML files, use: -->
<script src="js/config.local.js"></script>  <!-- Local testing -->
```

For production:
```html
<!-- Update config.js with restricted key, or use backend proxy -->
<script src="js/config.js"></script>
```

## 🔒 Best Practices

1. **Never commit API keys** to public repos
2. **Use `.gitignore`** for sensitive files
3. **Set API restrictions** in Google Cloud Console
4. **Monitor API usage** for unexpected spikes
5. **Rotate keys** regularly

## ⚠️ What to Do If Key is Compromised

✅ Regenerate immediately  
✅ Check API usage for suspicious activity  
✅ Set restrictions on new key  
✅ Monitor billing  

Your old key is now exposed and should be considered compromised. Replace it ASAP!
