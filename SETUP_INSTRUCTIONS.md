# 🚀 Portfolio Setup Instructions for Sai Ganesh Nellore

## 📋 **Step 1: Install Dependencies**

Run this command in your terminal:

```bash
pnpm install
```

This will install the OpenAI SDK, Vercel AI SDK, and all other dependencies.

## 🔐 **Step 2: Set Up Environment Variables**

Create a file called `.env.local` in your project root with this content:

```env
# OpenAI API Configuration
OPENAI_API_KEY=your_actual_openai_api_key_here

# Environment
NODE_ENV=development
```

**How to get your OpenAI API Key:**
1. Go to [platform.openai.com](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new secret key
5. Copy and paste it into `.env.local`

**Replace `your_actual_openai_api_key_here` with your real OpenAI API key.**

## 🎯 **Step 3: Test Locally**

Run the development server:

```bash
pnpm dev
```

Visit `http://localhost:3000` to test your portfolio.

### **What to Test:**
- ✅ AI chat functionality on the home page
- ✅ Navigate to `/chat` for full chat interface
- ✅ Test quick-question buttons (Me, Resume, Projects, Skills, etc.)
- ✅ Dark/light theme toggle
- ✅ Mobile responsiveness

## 🚀 **Step 4: Deploy to Vercel**

### **Option A: Using Vercel CLI (Recommended)**

1. **Install Vercel CLI:**
   ```bash
   pnpm add -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Add environment variable:**
   ```bash
   vercel env add OPENAI_API_KEY
   ```
   Paste your OpenAI API key when prompted.

5. **Redeploy with environment variable:**
   ```bash
   vercel --prod
   ```

### **Option B: Using Vercel Dashboard**

1. **Push to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure project settings:
     - **Framework Preset:** Next.js
     - **Build Command:** `pnpm build`
     - **Output Directory:** `.next`

3. **Add Environment Variables:**
   - In project settings, go to "Environment Variables"
   - Add: `OPENAI_API_KEY` = `your_openai_api_key`
   - Make sure it's available for Production, Preview, and Development

4. **Deploy!** 🎉

## ✅ **What's Been Customized:**

### **Personal Information:**
- ✅ **Name:** Sai Ganesh Nellore
- ✅ **Title:** Lead Machine Learning Engineer
- ✅ **Experience:** 3+ Years
- ✅ **Location:** Chicago, IL, USA
- ✅ **Education:** MS in AI from Northwestern (GPA: 3.95)

### **Contact Details:**
- ✅ **Email:** nsaiganesh2003@gmail.com
- ✅ **Phone:** +1 (773) 822-5301
- ✅ **LinkedIn:** linkedin.com/in/saiganeshn
- ✅ **GitHub:** github.com/SAIGANESH02
- ✅ **Portfolio:** saiganesh02.github.io/SaiGanesh02

### **Professional Content:**
- ✅ **Work Experience:** XSELL, Vanguard, Paramount, Zoho
- ✅ **Projects:** 12+ AI/ML projects with live previews
- ✅ **Skills:** 50+ technologies (Python, TensorFlow, AWS, LLMs, etc.)
- ✅ **AI Personality:** Customized with your background and expertise

### **Features:**
- ✅ Interactive AI chat powered by OpenAI
- ✅ Full-time job search card
- ✅ Resume with download functionality
- ✅ Dynamic project showcase with iframe previews
- ✅ Dark/light theme toggle
- ✅ Northwestern esports section
- ✅ Responsive mobile design

## 🎨 **Next Steps (Optional Customizations):**

### **1. Add Your Photo**
Replace these files in `/public`:
- `saiganesh.jpeg` - Your professional headshot
- `landing-memojis.png` - Landing page avatar

### **2. Add Your Logo**
Replace `/public/logo-saiganesh.svg` with your personal branding

### **3. Add Esports Photos** (Optional)
Create `/public/esports/` folder and add:
- `team-photo.jpg` - Northwestern esports team photo
- `tournament-win.jpg` - Valorant tournament victory photo

Then update `Sports.tsx` to display them.

### **4. Update Project Screenshots** (Optional)
If you have better project screenshots, update files in `/public/projects/`

### **5. Add Analytics** (Recommended)
1. Get Google Analytics tracking ID
2. Update `layout.tsx` with your GA ID
3. Track visitor engagement

### **6. Custom Domain** (Optional)
1. Purchase domain (e.g., saiganesh.dev)
2. Add to Vercel project settings
3. Configure DNS records

## 🔧 **Troubleshooting:**

### **Issue: Linter Errors About Missing Modules**
**Solution:**
```bash
pnpm install
# Restart your dev server
pnpm dev
```

### **Issue: AI Chat Not Working**
**Check:**
1. Is `OPENAI_API_KEY` set in `.env.local`?
2. Is the API key valid?
3. Do you have OpenAI credits?
4. Check browser console for errors

### **Issue: Build Fails on Vercel**
**Check:**
1. Environment variables are set in Vercel dashboard
2. Build command is `pnpm build`
3. Node version is compatible (v18+)
4. Check build logs for specific errors

### **Issue: Images Not Loading**
**Check:**
1. Files exist in `/public` folder
2. File names match exactly (case-sensitive)
3. Clear browser cache
4. Check image paths in components

### **Issue: Dark Mode Not Working**
**Solution:**
```bash
# Make sure theme-provider is properly configured
# Check ThemeToggle component is imported
```

## 📚 **Useful Commands:**

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint

# Vercel
vercel                # Deploy to preview
vercel --prod         # Deploy to production
vercel env ls         # List environment variables
vercel logs           # View deployment logs
```

## 🆘 **Need Help?**

If you encounter issues:
1. Check the [Next.js Documentation](https://nextjs.org/docs)
2. Review [Vercel AI SDK Docs](https://sdk.vercel.ai/docs)
3. Check [OpenAI API Documentation](https://platform.openai.com/docs)
4. Open an issue on GitHub with error details

## 🎓 **Learning Resources:**

- **Next.js 14:** [https://nextjs.org/learn](https://nextjs.org/learn)
- **Vercel AI SDK:** [https://sdk.vercel.ai/docs](https://sdk.vercel.ai/docs)
- **Tailwind CSS:** [https://tailwindcss.com/docs](https://tailwindcss.com/docs)
- **Framer Motion:** [https://www.framer.com/motion/](https://www.framer.com/motion/)

## ✨ **Success Checklist:**

- [ ] Dependencies installed (`pnpm install`)
- [ ] Environment variables configured (`.env.local`)
- [ ] Local development working (`pnpm dev`)
- [ ] AI chat functioning correctly
- [ ] All personal info updated
- [ ] Photos/images added
- [ ] Deployed to Vercel
- [ ] Environment variables set in Vercel
- [ ] Production build successful
- [ ] Custom domain configured (optional)
- [ ] Analytics added (optional)

---

**🎉 Congratulations!** Your AI-powered ML Engineer portfolio is ready to impress recruiters and showcase your production AI systems expertise!

---

**Built by:** Sai Ganesh Nellore  
**Contact:** nsaiganesh2003@gmail.com  
**GitHub:** github.com/SAIGANESH02