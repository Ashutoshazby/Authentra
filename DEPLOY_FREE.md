# Free Deployment Guide For Authentra

This project can be deployed at zero cost with:

- Frontend: Vercel Hobby
- Backend: Render Free Web Service
- Database: MongoDB Atlas M0 Free Cluster
- AI Service: Hugging Face Spaces CPU Basic

## Current Free-Tier Notes

These are current official free options:

- Vercel Hobby is free: [Vercel Hobby Plan](https://vercel.com/docs/plans/hobby)
- Render Free Web Services are available and spin down after 15 minutes of inactivity: [Render Free](https://render.com/docs/free)
- MongoDB Atlas offers the free-forever `M0` cluster: [MongoDB Pricing](https://www.mongodb.com/pricing), [M0 limits](https://www.mongodb.com/docs/atlas/reference/free-shared-limitations/)
- Hugging Face Spaces provides free `CPU Basic` hardware with 2 vCPU and 16 GB RAM: [Spaces Overview](https://huggingface.co/docs/hub/en/spaces-overview)

## 1. Deploy MongoDB Atlas For Free

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a free project
3. Create an `M0` cluster
4. Create a database user
5. Add network access

For easy setup while testing:

- allow access from anywhere using `0.0.0.0/0`

Then copy your connection string:

```env
mongodb+srv://USERNAME:PASSWORD@cluster-url/authentra?retryWrites=true&w=majority
```

## 2. Deploy The AI Service On Hugging Face Spaces

This repo already includes:

- [Dockerfile](/C:/Users/ashut/OneDrive/Desktop/Authentra/ai-service/Dockerfile)
- [README.md](/C:/Users/ashut/OneDrive/Desktop/Authentra/ai-service/README.md)

Steps:

1. Create a Hugging Face account
2. Open [Create a Space](https://huggingface.co/new-space)
3. Choose:
   - SDK: `Docker`
   - Hardware: `CPU Basic (Free)`
4. Upload the contents of the `ai-service` folder
5. Wait for build and startup

Your AI service URL will look like:

```text
https://YOUR_USERNAME-YOUR_SPACE_NAME.hf.space
```

Test it:

```text
https://YOUR_USERNAME-YOUR_SPACE_NAME.hf.space/health
```

## 3. Deploy The Backend On Render For Free

1. Push this repo to GitHub
2. Sign in to [Render](https://render.com)
3. Create a new `Web Service`
4. Connect your GitHub repo
5. Configure:

- Root Directory: `backend`
- Runtime: `Node`
- Build Command: `npm install`
- Start Command: `npm start`
- Instance Type: `Free`

Add these environment variables:

```env
PORT=10000
MONGODB_URI=your-mongodb-atlas-uri
JWT_SECRET=your-long-random-secret
AI_SERVICE_URL=https://YOUR_USERNAME-YOUR_SPACE_NAME.hf.space
FRONTEND_URL=https://YOUR_VERCEL_APP.vercel.app
```

After deploy, test:

```text
https://YOUR_RENDER_BACKEND.onrender.com/api/health
https://YOUR_RENDER_BACKEND.onrender.com/auth/me
```

Note:

- Render Free services spin down after 15 minutes idle, so the first request can be slow.

## 4. Deploy The Frontend On Vercel For Free

This repo already includes:

- [vercel.json](/C:/Users/ashut/OneDrive/Desktop/Authentra/frontend/vercel.json)

That rewrite is important because this is a React SPA with routes like:

- `/login`
- `/dashboard`
- `/ai-detector`
- `/chatgpt-detector`

Steps:

1. Sign in to [Vercel](https://vercel.com)
2. Import your GitHub repo
3. Set:

- Root Directory: `frontend`
- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`

Add this environment variable:

```env
VITE_API_URL=https://YOUR_RENDER_BACKEND.onrender.com/api
```

Deploy.

Your frontend URL will look like:

```text
https://YOUR_PROJECT.vercel.app
```

## 5. Update Backend CORS

After Vercel gives you the real URL, update Render:

```env
FRONTEND_URL=https://YOUR_PROJECT.vercel.app
```

Then redeploy the backend.

## 6. Final End-To-End Test

Test in this order:

1. Open frontend URL
2. Go to `/signup`
3. Create account
4. Log in
5. Run one scan
6. Confirm next scan locks if `scansRemaining` becomes `0`
7. Use rewarded ad modal
8. Unlock scan
9. Run scan again
10. Confirm AI + plagiarism results render

## 7. Free-Tier Reality Check

This setup is free, but there are a few expected limitations:

- Render backend may cold start after 15 minutes idle
- Hugging Face Space may take longer on first model load
- Atlas `M0` is good for testing and low traffic, not serious production load

Inference:

- Because Hugging Face free Spaces use non-persistent disk by default, model downloads may need to happen again after certain restarts.

## Recommended First Production URLs

Use these temporary URLs until you buy a domain:

- Frontend: `https://your-project.vercel.app`
- Backend: `https://your-backend.onrender.com`
- AI service: `https://your-space.hf.space`

When you buy a domain later, you can attach it to Vercel first and then update:

- `FRONTEND_URL` on Render
- any canonical URLs you want to customize in the frontend SEO pages
