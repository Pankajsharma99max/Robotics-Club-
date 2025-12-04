# Deployment Guide

## Prerequisites

- GitHub account
- MongoDB Atlas account (free tier)
- Vercel account (for frontend)
- Railway/Render account (for backend)

---

## Step 1: Database Setup (MongoDB Atlas)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database password
6. Whitelist IP: 0.0.0.0/0 (for development)

Example connection string:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/robotics-club
```

---

## Step 2: Backend Deployment (Railway)

### Using Railway.app

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Choose `backend` as root directory
6. Add environment variables:

```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRE=7d
FRONTEND_URL=https://your-frontend.vercel.app
PORT=5000
NODE_ENV=production
MAX_FILE_SIZE=5242880
```

7. Deploy!
8. Copy your backend URL (e.g., `https://your-app.railway.app`)

### Create Admin User

After deployment:
```bash
# SSH into Railway or use Railway CLI
railway run npm run seed
```

---

## Step 3: Frontend Deployment (Vercel)

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Import your repository
5. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

6. Add environment variable:
```env
VITE_API_URL=https://your-backend.railway.app/api
```

7. Deploy!

---

## Step 4: Post-Deployment

### Test Backend
```bash
curl https://your-backend.railway.app/api/health
```

### Test Frontend
1. Visit your Vercel URL
2. Navigate to `/admin/login`
3. Login with admin credentials
4. Test creating an event

### Update CORS

In backend `.env`, update:
```env
FRONTEND_URL=https://your-actual-frontend.vercel.app
```

Redeploy backend after this change.

---

## Alternative: Render.com (Backend)

1. Go to [render.com](https://render.com)
2. Create "New Web Service"
3. Connect GitHub repository
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add same environment variables as Railway
6. Deploy

---

## Troubleshooting

### CORS Errors
- Verify `FRONTEND_URL` matches your actual frontend URL
- Check browser console for exact error

### Database Connection Failed
- Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0
- Check connection string has correct password
- Ensure database user has read/write permissions

### File Uploads Not Working
- Check `uploads` directory exists
- Verify file size limits in environment variables
- Check server logs for specific errors

### Build Fails
- Ensure all dependencies are in `package.json`
- Check Node version compatibility (use Node 18+)
- Review build logs for specific errors

---

## Custom Domain (Optional)

### Frontend (Vercel)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### Backend (Railway)
1. Go to Project Settings → Domains
2. Add custom domain
3. Update DNS records
4. Update `FRONTEND_URL` in backend env vars

---

## Monitoring & Maintenance

### Logs
- **Railway**: View logs in dashboard
- **Vercel**: View deployment logs and runtime logs

### Database Backups
- MongoDB Atlas provides automatic backups
- Configure backup schedule in Atlas dashboard

### Updates
- Push to main branch to trigger automatic redeployment
- Test in development before pushing to production

---

## Production Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Backend deployed to Railway/Render
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured
- [ ] Admin user created
- [ ] CORS configured correctly
- [ ] File uploads tested
- [ ] All pages load correctly
- [ ] Admin panel functional
- [ ] Custom domain configured (optional)
- [ ] SSL certificates active
- [ ] Monitoring set up

---

## Cost Estimate

- **MongoDB Atlas**: Free (512MB storage)
- **Railway**: Free tier ($5 credit/month)
- **Vercel**: Free (hobby plan)

**Total**: $0/month for small-scale deployment

For production with more traffic, expect $10-30/month.
