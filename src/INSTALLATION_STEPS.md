# 📦 INSTALLATION STEPS - FIX ERRORS

**Status:** 🔴 Missing Dependencies  
**Action Required:** Install Supabase packages

---

## 🚨 CURRENT ERROR

```
ReferenceError: process is not defined
```

**Root Cause:** Missing `@supabase/supabase-js` package

---

## ✅ QUICK FIX (2 minutes)

### STEP 1: Install Supabase Package

```bash
npm install @supabase/supabase-js
```

### STEP 2: Install Auth Helpers (Optional, for later)

```bash
npm install @supabase/auth-helpers-nextjs
```

### STEP 3: Restart Dev Server

```bash
# Stop current server (Ctrl+C)
npm run dev
```

---

## 📊 WHAT WILL HAPPEN

### Before Fix:
```
❌ ReferenceError: process is not defined
❌ Cannot import supabase client
❌ App crashes
```

### After Fix:
```
✅ Supabase client loads
✅ App runs in MOCK mode (no errors)
⚠️  Console: "Supabase not configured - using mock"
✅ Everything works (with mock data)
```

---

## 🔍 VERIFICATION

After installing, run:

```bash
npm run dev
```

**Expected Console Output:**
```
⚠️ Supabase not configured - using mock authentication
⚠️ Configure .env.local with Supabase credentials to use real auth
```

**This is GOOD!** ✅

The app is working in mock mode.

---

## 🎯 NEXT STEPS

### Option A: Continue with Mock Mode
If you want to keep developing without Supabase:

```bash
# Just continue coding
npm run dev

# Everything works with mock data
# No need to configure anything
```

### Option B: Setup Supabase (Recommended)
If you want real data persistence:

1. **Follow:** `SETUP_GUIDE.md`
2. **Time:** ~1 hour
3. **Result:** Real data, real auth, production-ready

---

## 📋 PACKAGE.JSON UPDATE

Your `package.json` will be updated with:

```json
{
  "dependencies": {
    ...existing packages,
    "@supabase/supabase-js": "^2.39.0"
  }
}
```

---

## 🐛 TROUBLESHOOTING

### Error persists after install?

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Different error appears?

Check console for specific error message and let me know.

---

## ✅ CHECKLIST

- [ ] Run: `npm install @supabase/supabase-js`
- [ ] Wait for install to complete
- [ ] Restart dev server
- [ ] Verify: App loads without errors
- [ ] See: Warning about mock mode (this is OK!)

---

## 🎉 SUCCESS CRITERIA

After fix, you should see:

1. ✅ App loads successfully
2. ✅ Login page appears
3. ⚠️  Console warning about mock mode
4. ✅ Can login with: coach@demo.com / coach123
5. ✅ Dashboard loads with mock data

**All of this is CORRECT!** 

The app is working in safe mock mode until you configure Supabase.

---

**Time to Fix:** 2 minutes  
**Difficulty:** ⭐ (Very Easy)  
**Next:** Continue with SETUP_GUIDE.md or keep developing in mock mode

🚀 **Run: `npm install @supabase/supabase-js` now!**
