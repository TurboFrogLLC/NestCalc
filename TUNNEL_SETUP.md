# Cloudflare Tunnel Setup for NestCalc

**Goal:** Give NestCalc a stable, permanent HTTPS URL (`https://nestcalc.wrecklesstoddler.com`) so the iOS home screen PWA works reliably offline (even when your Mac is off).

This is currently the most reliable way to get real offline behavior for NestCalc on iPhone.

---

## Prerequisites

- You own `wrecklesstoddler.com` at Cloudflare (done)
- You have `brew` installed on your Mac
- NestCalc runs locally on port 3000 (`npm run start`)

---

## Step 1: Install cloudflared

```bash
brew install cloudflared
```

---

## Step 2: Authenticate with Cloudflare

```bash
cloudflared tunnel login
```

This opens a browser window. Log in with your Cloudflare account and select the `wrecklesstoddler.com` domain when prompted.

---

## Step 3: Create a new tunnel

```bash
cloudflared tunnel create nestcalc
```

**Important:** Copy the **Tunnel UUID** that appears in the output. You will need it in the next step.

Example output:
```
Tunnel credentials written to /Users/computer/.cloudflared/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.json. cloudflared chose this file based on where your origin certificate was found.
Created tunnel nestcalc with id xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

---

## Step 4: Create the config file

Run:

```bash
mkdir -p ~/.cloudflared
nano ~/.cloudflared/config.yml
```

Paste the following (replace `YOUR-TUNNEL-UUID-HERE` with the actual UUID from Step 3):

```yaml
tunnel: YOUR-TUNNEL-UUID-HERE
credentials-file: /Users/computer/.cloudflared/YOUR-TUNNEL-UUID-HERE.json

ingress:
  - hostname: nestcalc.wrecklesstoddler.com
    service: http://localhost:3000
  - service: http_status:404
```

Save and exit:
- Press `Ctrl + O` → Enter
- Press `Ctrl + X`

---

## Step 5: Route DNS

```bash
cloudflared tunnel route dns nestcalc nestcalc.wrecklesstoddler.com
```

This creates the `nestcalc.wrecklesstoddler.com` subdomain and points it at your tunnel.

---

## Step 6: Start the tunnel

In a dedicated terminal window, run:

```bash
cloudflared tunnel run nestcalc
```

Leave this running. You should see logs showing the tunnel is connected.

---

## Step 7: Start NestCalc (production mode)

In a **separate** terminal window:

```bash
cd ~/wrecklesstoddler/vibe/projects/NestCalc

npm run build
npm run start
```

---

## Step 8: Add to iPhone Home Screen

1. On your iPhone, open **DuckDuckGo** (or Safari) and go to:

   ```
   https://nestcalc.wrecklesstoddler.com
   ```

2. Once the app loads cleanly, tap the **Share** button → **Add to Home Screen**.

3. Name it `NestCalc` and tap **Add**.

---

## Step 9: Test Offline Behavior

1. Make sure the PWA is added to your home screen.
2. Turn **off Wi-Fi** on your iPhone.
3. Kill the `cloudflared` tunnel and the NestCalc server on your Mac (or shut the Mac down completely).
4. Tap the NestCalc icon on your iPhone.

If everything is set up correctly, it should open and work without needing the server.

---

## Notes & Tips

- **Always run production mode** (`npm run start`) when testing the PWA, not `npm run dev`.
- The tunnel must be running for the first install and initial cache warm-up on the phone.
- After the first successful offline test, you can usually kill the tunnel and it should still work (as long as the service worker cached properly).
- If you restart the tunnel and get a new URL, you may need to re-add the PWA to your home screen.
- This setup uses real trusted HTTPS from Cloudflare — no self-signed cert warnings.

---

## Troubleshooting

| Problem | Likely Cause | Fix |
|---------|--------------|-----|
| iPhone shows "offline" or fails to load | Service worker didn't fully precache | Re-add to home screen while tunnel + server are running |
| Certificate warning on iPhone | Using self-signed cert instead of tunnel | Use the Cloudflare Tunnel URL only |
| Tunnel won't start | Wrong UUID in config.yml | Double-check the UUID in `~/.cloudflared/config.yml` |
| Changes not showing on phone | Old cached version | Delete the home screen icon completely, then re-add it |

---

## Files Created

- `~/.cloudflared/config.yml` — Tunnel configuration
- `~/.cloudflared/<tunnel-uuid>.json` — Tunnel credentials (do not share)

---

**Status:** This is currently the most reliable free/cheap path for getting NestCalc working offline on iPhone as a real home screen PWA.

Created: June 30, 2026  
For: wReckless Toddler LLC — NestCalc iOS PWA offline setup