# Portfolio Deployment Guide

## Overview
This portfolio is designed to be deployed on Vercel with a separate analytics backend on Google Cloud Run.

## Prerequisites
- Vercel account
- Google Cloud account (for analytics backend)
- Domain configured (optional)

## Deployment Steps

### 1. Deploy Analytics Backend (Optional)

The analytics backend is optional. The portfolio will work without it, but won't track usage metrics.

**Deploy to Cloud Run:**
```bash
cd analytics-backend
gcloud run deploy portfolio-analytics \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

**Note the Cloud Run URL** - you'll need it in the next step.

### 2. Configure Environment Variables

#### Local Development
```bash
# Copy the example env file
cp .env.example .env.local

# Edit .env.local and add your Cloud Run URL:
VITE_ANALYTICS_URL=https://your-analytics-backend.run.app
```

#### Production (Vercel)
1. Go to your project on Vercel
2. Settings → Environment Variables
3. Add: `VITE_ANALYTICS_URL` = `https://your-analytics-backend.run.app`
4. Important: Add for Production, Preview, and Development environments

### 3. Deploy Frontend to Vercel

#### Option A: Deploy via Vercel CLI
```bash
npm install -g vercel
vercel
```

#### Option B: Deploy via GitHub
1. Push your code to GitHub
2. Import repository in Vercel
3. Vercel will auto-detect Vite settings
4. Add environment variable (see step 2)
5. Deploy

### 4. Update Backend CORS (If Using Analytics)

Update your Cloud Run backend to allow requests from your Vercel domain:

```python
# In analytics-backend/main.py
origins = [
    "http://localhost:5173",
    "https://your-portfolio.vercel.app",  # Add your domain
]
```

Redeploy the backend after updating CORS.

## Post-Deployment Checklist

- [ ] Portfolio loads correctly
- [ ] All navigation links work
- [ ] Analytics dashboard loads (may show 0 if no data yet)
- [ ] Dark mode toggle works
- [ ] Resume download works
- [ ] LinkedIn/GitHub links go to correct profiles
- [ ] Mobile responsive design works
- [ ] All demo pages load correctly

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_ANALYTICS_URL` | No | URL of your Cloud Run analytics backend |

## Troubleshooting

### Analytics Dashboard Shows Error
- Check that `VITE_ANALYTICS_URL` is set correctly
- Verify backend is deployed and accessible
- Check browser console for CORS errors

### Resume Download Not Working
- Ensure `Resume-GavinKelly.pdf` exists in `public/images/demos/resume/`
- Check file path is correct in `Home.jsx`

### Links Not Working
- Verify all links in Footer.jsx and Home.jsx
- Check LinkedIn: https://www.linkedin.com/in/gavin-kelly1/
- Check GitHub: https://github.com/gk331251-byte

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Tech Stack

- **Frontend Framework:** React + Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router
- **Charts:** Recharts
- **Hosting:** Vercel
- **Analytics Backend:** FastAPI on Cloud Run (optional)

## Support

For issues or questions, check the README.md or open an issue on GitHub.
