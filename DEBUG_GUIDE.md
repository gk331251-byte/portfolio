# Analytics Debugging Guide

## Overview
This guide explains how to debug analytics issues and diagnose why analytics might be showing 0's.

---

## 🔧 Quick Diagnostics

### In Browser Console (Development Only)

When you run `npm run dev`, the following debug commands are automatically available in the browser console:

```javascript
// Check configuration
portfolioDebug.checkConfig()

// Test backend connection
await portfolioDebug.testBackend()

// Test Firestore writes
await portfolioDebug.testFirestore()

// Get current analytics data
await portfolioDebug.getSummary()

// Send a test event
await portfolioDebug.testEvent()

// Run all diagnostics at once
await portfolioDebug.runAll()
```

### In Analytics Dashboard (Development Only)

When in development mode (`npm run dev`), navigate to `/analytics` and you'll see a yellow "Analytics Diagnostics" panel at the top with a "Run Diagnostics" button.

Click it to see:
- ✓/✗ Backend URL configuration status
- ✓/✗ Connection test results
- ✓/✗ Firestore write test
- ✓/✗ Summary endpoint test
- Current analytics data (if available)

---

## 🔍 Common Issues and Solutions

### Issue 1: Analytics Shows All 0's

**Possible Causes:**
1. Backend not configured
2. Backend not deployed
3. CORS errors blocking requests
4. Firestore not initialized
5. No events tracked yet

**Diagnosis Steps:**
```javascript
// 1. Check if backend is configured
portfolioDebug.checkConfig()
// Look for: Backend URL should NOT be empty

// 2. Test backend connection
await portfolioDebug.testBackend()
// Should return: { success: true, message: 'Backend is reachable...' }

// 3. Check for data
await portfolioDebug.getSummary()
// Should return data object, not null
```

**Solutions:**
- If `Backend URL: NOT CONFIGURED` → Add `VITE_ANALYTICS_URL` to `.env.local`
- If connection fails → Deploy backend to Cloud Run
- If CORS error → Update CORS origins in backend
- If no data → Wait for events to be tracked, or send test event

---

### Issue 2: 404 Error on /analytics Refresh

**Cause:** Vercel needs to know that all routes should serve index.html for React Router to work.

**Solution:** Already fixed! The `vercel.json` file has been created with:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This tells Vercel to serve `index.html` for ALL routes, letting React Router handle navigation.

---

### Issue 3: Backend Not Receiving Events

**Diagnosis:**
```javascript
// Send a test event and check console
await portfolioDebug.testEvent()
// Then check browser Network tab for the POST request
```

**Check for:**
1. Network tab shows request to `/api/track`
2. Request status is 200 OK
3. No CORS errors in console
4. Backend logs show received event

**Solutions:**
- If request fails → Check `VITE_ANALYTICS_URL` is correct
- If CORS error → Update backend CORS settings
- If 404 → Backend not deployed or wrong URL
- If 500 → Check backend logs for errors

---

### Issue 4: Events Tracked But Not Showing in Dashboard

**Diagnosis:**
```javascript
// Test if events are being written to Firestore
await portfolioDebug.testFirestore()
// Should return: true

// Check if summary endpoint returns data
await portfolioDebug.getSummary()
// Should return: { data: { total_events: X, ... } }
```

**Possible Causes:**
1. Firestore write permissions
2. Summary aggregation not working
3. Firestore collection name mismatch

**Solutions:**
- Check Firestore rules in Google Cloud Console
- Check backend logs for Firestore errors
- Verify collection name is `portfolio_events`

---

## 📊 Debug Logging

All analytics operations now include debug logging. Open browser console to see:

```
[Analytics Debug] Tracking event: {type: 'page_view', ...}
[Analytics Debug] Skipping track in DEV mode
[Analytics Debug] Sending to backend: https://...
[Analytics Debug] Event tracked successfully
```

Or if there's an error:
```
[Analytics Error] Track failed: CORS policy error
[Analytics Error] Backend connection test failed: NetworkError
```

---

## 🚀 Testing Flow

### Complete Testing Sequence:

1. **Start Development Server:**
   ```bash
   npm run dev
   ```

2. **Open Browser Console** and run:
   ```javascript
   portfolioDebug.runAll()
   ```

3. **Navigate to `/analytics`** and click "Run Diagnostics"

4. **Review Results:**
   - All green checkmarks (✓) = Everything working
   - Any red X (✗) = Issue found, see details

5. **Check Network Tab:**
   - Look for requests to your backend
   - Verify no CORS errors
   - Check response status codes

---

## 🔗 Backend Configuration

### Development (.env.local)
```bash
VITE_ANALYTICS_URL=https://your-backend.run.app
```

### Production (Vercel)
1. Go to Vercel dashboard
2. Project Settings → Environment Variables
3. Add: `VITE_ANALYTICS_URL` = `https://your-backend.run.app`
4. Make sure to add for Production, Preview, AND Development

---

## 📝 Debugging Checklist

Before asking "why are analytics 0?", run through this:

- [ ] Backend URL is configured (run `portfolioDebug.checkConfig()`)
- [ ] Backend is deployed and accessible (run `await portfolioDebug.testBackend()`)
- [ ] Backend accepts events (run `await portfolioDebug.testFirestore()`)
- [ ] Summary endpoint works (run `await portfolioDebug.getSummary()`)
- [ ] No CORS errors in console
- [ ] Events are being sent (check Network tab)
- [ ] Firestore has data (check Google Cloud Console → Firestore)
- [ ] `/analytics` route works (no 404)

---

## 🆘 Still Having Issues?

### Check These Files:

1. **Backend Configuration:**
   - `analytics-backend/main.py` - CORS settings
   - `analytics-backend/requirements.txt` - Dependencies installed
   - Cloud Run logs - Error messages

2. **Frontend Configuration:**
   - `.env.local` - Backend URL set
   - `src/config/api.js` - API config loads correctly
   - Browser console - Debug messages and errors

3. **Deployment:**
   - Vercel environment variables set
   - Backend deployed to Cloud Run
   - CORS allows your Vercel domain

### Common Fixes:

**"Backend URL: NOT CONFIGURED"**
→ Add `VITE_ANALYTICS_URL` to `.env.local` and restart dev server

**"Connection: Failed"**
→ Deploy backend or check URL is correct

**"Firestore Write: Failed"**
→ Check Firestore permissions and backend logs

**"Summary Endpoint: Failed"**
→ Backend not deployed or endpoint not implemented

---

## 📞 Debug Tools Reference

### Console Commands

| Command | Purpose | Returns |
|---------|---------|---------|
| `portfolioDebug.checkConfig()` | Check configuration | Config object |
| `portfolioDebug.testBackend()` | Test connection | Success/error |
| `portfolioDebug.testFirestore()` | Test Firestore | true/false |
| `portfolioDebug.getSummary()` | Get analytics data | Data object |
| `portfolioDebug.testEvent()` | Send test event | void |
| `portfolioDebug.runAll()` | Run all tests | void |

### Debug Panel (Analytics Dashboard)

- Only visible in development mode
- Click "Run Diagnostics" for instant health check
- Shows detailed test results
- Displays current analytics data

---

## 🎯 Expected Behavior

### Development Mode:
- Events are logged to console but NOT sent to backend
- Debug tools available in console
- Debug panel visible on Analytics Dashboard
- All debug logging active

### Production Mode:
- Events sent to backend
- No debug panel visible
- No console debug tools
- Minimal logging

---

## 📈 Monitoring Production

Once deployed, monitor:

1. **Vercel Logs:** Check for client-side errors
2. **Cloud Run Logs:** Check for backend errors
3. **Firestore Console:** Verify events are being written
4. **Analytics Dashboard:** Should show real data

If dashboard shows 0's in production:
1. Check Vercel environment variables are set
2. Check Cloud Run logs for errors
3. Test a manual event from production site's console
4. Verify CORS includes your production domain

---

## ✅ Success Indicators

You'll know everything is working when:
- ✅ `portfolioDebug.runAll()` shows all green checkmarks
- ✅ Dashboard debug panel shows all tests passing
- ✅ Network tab shows successful POST requests to `/api/track`
- ✅ Firestore console shows events in `portfolio_events` collection
- ✅ Analytics dashboard displays non-zero numbers
- ✅ Real-time activity feed shows events

---

**Need more help?** Check the main [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions.
