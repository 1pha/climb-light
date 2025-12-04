# GitHub Actions Deployment Setup Guide

## ✅ What I've Done

Pushed the GitHub Actions workflow to your repository. This workflow will:
1. Run every time you push to `main` branch
2. Inject your API key from GitHub Secrets
3. Deploy to GitHub Pages automatically

## 🔧 What You Need to Do

### Step 1: Add the API Key Secret

1. **Get a new API key** from [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Create API Key
   - **Set restrictions**:
     - API restrictions: Enable only "Generative Language API"
     - Application restrictions: HTTP referrers
     - Add allowed referrers: `https://1pha.github.io/*`

2. **Add to GitHub Secrets**:
   - Go to https://github.com/1pha/climb-light/settings/secrets/actions
   - Click **New repository secret**
   - Name: `GEMINI_API_KEY`
   - Value: Paste your new API key
   - Click **Add secret**

### Step 2: Enable GitHub Actions for Pages

1. Go to https://github.com/1pha/climb-light/settings/pages
2. Under **Build and deployment**:
   - Source: Change to **GitHub Actions** (not "Deploy from a branch")
3. Save

### Step 3: Trigger the Deployment

The workflow should run automatically after you push. If not:

1. Go to https://github.com/1pha/climb-light/actions
2. Click on "Deploy to GitHub Pages" workflow
3. Click **Run workflow** → **Run workflow**

### Step 4: Watch It Deploy

1. Go to the **Actions** tab
2. You'll see the workflow running (orange dot)
3. Once it turns green ✅, your site is deployed!
4. Visit https://1pha.github.io/climb-light/

## ⏱️ Timeline

- Workflow run: ~1-2 minutes
- GitHub Pages deployment: ~1-2 minutes
- Total: ~3-4 minutes from push to live site

## 🔍 Troubleshooting

### Workflow Fails

Check the workflow logs in the Actions tab. Common issues:
- Secret not set correctly (name must be exactly `GEMINI_API_KEY`)
- GitHub Pages not set to "GitHub Actions" source

### Site Still Shows Placeholder

- Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
- Check that workflow completed successfully (green checkmark)
- Wait a few more minutes for GitHub Pages CDN to update

### API Still Not Working

- Check browser console (F12) for API errors
- Verify API key has HTTP referrer restrictions
- Check API quota in Google Cloud Console

## 🎉 Success Checklist

- [ ] New API key created with restrictions
- [ ] Secret added to GitHub (name: `GEMINI_API_KEY`)
- [ ] GitHub Pages source set to "GitHub Actions"
- [ ] Workflow ran successfully (green checkmark)
- [ ] Site loads at https://1pha.github.io/climb-light/
- [ ] Video upload works and calls Gemini API

## 📝 Notes

- The API key will be visible in the deployed `config.js` file
- But it's protected by HTTP referrer restrictions
- Only works on `https://1pha.github.io/climb-light/`
- Not stored in your git history ✅

You're all set! Let me know when you've added the secret and I can help troubleshoot if needed.
