# Halcyon Book Club website

## What's in this folder
- `index.html`: the whole site (Accueil, Le club, Genres, Auteurs, Créatrices, Rejoindre, FAQ, Confidentialité) with the FR / EN switch
- `img/`: the 5 photos
- `functions/api/signup.js`: saves every reader who signs up
- `functions/api/export.js`: downloads all signups as a CSV
- `functions/api/count.js`: member count (the site shows it only once you pass 50 members)
- `logo-mark.svg`: the logo mark on its own (for TikTok/Instagram profile pictures, emails)

## 1. Photos
The 5 photos are already in `img/`, compressed for fast loading (licensed through your Adobe Stock account).

## 2. Put it online with Cloudflare Pages
1. Push this folder to a new GitHub repository (for example `halcyon-book-club`).
2. Cloudflare dashboard > Workers & Pages > Create > Pages > Connect to Git > pick the repo. Build command: none. Output folder: `/`.
3. Create the signup storage: Workers & Pages > KV > Create namespace, name it `hbc-signups`.
4. In your Pages project > Settings > Bindings > Add > KV namespace. Variable name: `SIGNUPS`, namespace: `hbc-signups`.
5. Settings > Variables and Secrets > Add a secret named `ADMIN_KEY` with a long password only you know.
6. Redeploy once so the binding and secret are picked up.
7. Custom domain: Pages project > Custom domains > add `club.halcyonliterary.com`. Since your domain is at Hostinger, add the CNAME record Cloudflare shows you in Hostinger's DNS settings.

## 3. See your signups
Open `https://club.halcyonliterary.com/api/export?key=YOUR_ADMIN_KEY`. It downloads a CSV with every member: name, email, genres, language, country, and where they came from. You can import that CSV straight into Brevo or Mailchimp later.

## 4. Track which creator brings readers
Give each BookToker their own link: `https://club.halcyonliterary.com/?ref=sophie#rejoindre`
Every reader who signs up through it is saved with `source = sophie` in your CSV.

## 5. Things to update by hand
- **Seasonal challenge** (home page): change the title and the 3 prompts each season (search for `ch.title` in index.html, French and English).
- **Social preview**: when someone shares the link on WhatsApp or TikTok, it shows the hero photo and the title. This works once the site is live at club.halcyonliterary.com.
