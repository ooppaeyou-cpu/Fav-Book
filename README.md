# 💕 Pages of Us — Romantic Birthday Flipbook

A beautiful, interactive digital flipbook love story website for your girlfriend's birthday.

---

## 📁 File Structure

```
/
├── index.html    ← Main HTML (all pages)
├── style.css     ← All styles (theme, animations, layout)
├── script.js     ← All interactivity (flipbook, modals, effects)
└── README.md     ← This file
```

---

## 🚀 How to Run Locally

### Option 1 — Simple (just open in browser)
1. Download all three files into the same folder.
2. Double-click `index.html` to open it in your browser.
   > **Note:** YouTube embeds may not work with `file://` — use a local server (Option 2) for full functionality.

### Option 2 — Local Server (recommended)
If you have **Node.js** installed:
```bash
npx serve .
# Open http://localhost:3000
```

Or with **Python**:
```bash
# Python 3
python -m http.server 8080
# Open http://localhost:8080
```

Or use the **VS Code Live Server** extension — right-click `index.html` → "Open with Live Server".

---

## ✏️ Customization Guide

### 1. Replace placeholder text
Search for these placeholders in `index.html` and replace them:

| Placeholder          | Replace with                        |
|----------------------|-------------------------------------|
| `[Her Name]`         | Your girlfriend's name              |
| `[Your Name]`        | Your name                           |
| `[Date]`             | Today's date or a romantic date     |
| `[Her Birthday Date]`| Her actual birthday                 |
| `[First Date — Month, Year]` | Your actual first date     |
| `[Special Date]`     | Another milestone date              |
| `[Where did you go?]`| Your actual first trip destination  |
| `[Describe the moment]` | Your personal memory             |
| `[Add your own dream]` | A personal future dream           |

### 2. Add your photos
Replace the placeholder `src` URLs in image tags:
```html
<!-- Find lines like this: -->
<img src="https://placehold.co/600x400/..." />

<!-- Replace with your photo URL or local file: -->
<img src="photos/our-first-photo.jpg" />
```

Also update `data-src` on the `.clickable-photo` div to match.

### 3. Change the secret password
In `script.js`, find:
```js
secretPassword: '01012020',
```
Change `01012020` to your anniversary date in `MMDDYYYY` format.  
Example: January 14, 2021 → `'01142021'`

### 4. Add your video
In `index.html`, find the YouTube iframe and replace the src:
```html
<iframe src="https://www.youtube.com/embed/YOUR_VIDEO_ID" ...></iframe>
```
Get the embed ID from your YouTube video URL.

### 5. Add your music
Replace the audio source in `index.html`:
```html
<audio id="bg-music" loop>
  <source src="your-song.mp3" type="audio/mpeg" />
</audio>
```
Upload an `.mp3` file to your folder and reference it here.

### 6. Change theme colors
In `style.css`, edit the `:root` variables at the top:
```css
:root {
  --pink-deep: #d6789a;   /* Main accent color */
  --pink-mid:  #f4a7b9;   /* Secondary pink */
  --cream:     #fef6f0;   /* Background */
  ...
}
```

### 7. Add a QR code
In the secret page section of `index.html`, replace the QR placeholder:
```html
<div class="qr-box">[ QR Code Here ]</div>
```
With an actual QR code image (generate one free at qr-code-generator.com):
```html
<img src="qr-code.png" alt="Scan for surprise" width="160" />
```

---

## 🌐 Deploy Online

### Option A — GitHub Pages (Free)
1. Create a GitHub account at github.com
2. Create a new repository (e.g. `birthday-site`)
3. Upload all three files
4. Go to Settings → Pages → Source: `main` branch, root folder
5. Your site will be live at: `https://yourusername.github.io/birthday-site`

### Option B — Vercel (Free, fast)
1. Install Vercel CLI: `npm i -g vercel`
2. In your project folder: `vercel`
3. Follow prompts — site deploys in seconds
4. Share the URL!

### Option C — Netlify Drop (easiest)
1. Go to https://app.netlify.com/drop
2. Drag your project folder onto the page
3. Instant live URL — share it!

---

## ✨ Interactive Features Summary

| Feature | How to Use |
|---------|-----------|
| **Open the Book** | Click the cover button |
| **Flip pages** | Click ‹ › buttons, swipe, or use arrow keys |
| **Enlarge photos** | Tap any photo |
| **Hidden message** | Click "Do you remember this day?" on memory pages |
| **Secret page** | Enter password on Page 10 |
| **Music** | Click ♪ Music button (top right) |
| **Final confetti** | Automatically triggers on last page |
| **Read Again** | Button on last page resets everything |

---

Made with ❤️ — a digital love story, written just for her.
