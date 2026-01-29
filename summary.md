# VPS Implementation Summary: Mercy Software Services + DuckDNS Multi-Project Hosting

**Date:** January 29, 2026  
**Status:** ✅ Complete - All objectives achieved

---

## Overview

Successfully configured a VPS to host **two separate projects** (Waad Nails + Mercy Software Services) using:
- **DuckDNS** for dynamic DNS with multiple subdomains
- **Nginx** as reverse proxy for both projects
- **Let's Encrypt** for HTTPS certificates
- **PM2** for Node.js process management
- **Multiple DuckDNS tokens** for separate domain management

---

## Initial Requirements

### Projects
1. **Waad Nails** (existing)
   - Frontend: `site-waad.duckdns.org` → React app (port 3000)
   - Backend: `api-waad.duckdns.org` → Express API (port 5000)

2. **Mercy Software Services** (new)
   - Frontend: `mercy-software-services.duckdns.org` → React static build
   - Backend: `api-mss.duckdns.org` → Express API (port 5001)

### Objectives
- ✅ Host both projects on same VPS without conflicts
- ✅ Extend DuckDNS auto-update system for new domains
- ✅ Configure Nginx reverse proxies for both projects
- ✅ Set up HTTPS with Let's Encrypt
- ✅ Implement PM2 best practices for multiple services

---

## Implementation Steps

### 1. DuckDNS Multi-Domain Strategy

**Problem:** Need to manage domains from two different DuckDNS accounts/tokens.

**Solution:** Created a multi-config approach with separate config files.

**Files Created:**
- `/home/ubuntu/duckdns/duckdns-mss.conf` - New config for MSS domains
  ```bash
  DOMAINS="mercy-software-services,api-mss"
  TOKEN="2cb38d6a-1ebe-47a8-9ec7-b35f0975accf"
  ```

**Script Updated:**
- `/home/ubuntu/duckdns/update-duckdns.sh` - Enhanced to loop through multiple config files
  - Processes both `duckdns.conf` (Waad) and `duckdns-mss.conf` (MSS)
  - Uses separate tokens for each account
  - Single IP lookup, multiple domain updates

**Result:** All 4 domains (`site-waad`, `api-waad`, `mercy-software-services`, `api-mss`) now update automatically via existing cron job.

---

### 2. Environment Configuration

**Frontend Environment:**
- Updated `/home/ubuntu/mercy-software-services/.env`:
  ```env
  VITE_API_URL=https://api-mss.duckdns.org
  FRONTEND_URL=https://mercy-software-services.duckdns.org
  ```

**Backend Environment:**
- Created `/home/ubuntu/mercy-software-services/backend/.env`:
  ```env
  NODE_ENV=production
  PORT=5001
  FRONTEND_URL=https://mercy-software-services.duckdns.org
  ```

**Key Points:**
- Frontend uses HTTPS URLs (required for production)
- Backend runs on port 5001 (avoiding conflict with Waad backend on 5000)
- CORS configured to allow frontend domain

---

### 3. PM2 Process Management

**Created:** `/home/ubuntu/mercy-software-services/ecosystem.config.js`

```javascript
module.exports = {
  apps: [
    {
      name: 'mss-backend',
      script: 'server.js',
      cwd: '/home/ubuntu/mercy-software-services/backend',
      env: {
        NODE_ENV: 'production',
        PORT: 5001,
        HOST: '0.0.0.0',
        FRONTEND_URL: 'https://mercy-software-services.duckdns.org'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      error_file: '/home/ubuntu/mercy-software-services/backend/logs/err.log',
      out_file: '/home/ubuntu/mercy-software-services/backend/logs/out.log',
      log_file: '/home/ubuntu/mercy-software-services/backend/logs/combined.log'
    }
  ]
};
```

**Actions:**
- Installed missing `dotenv` dependency
- Created log directories
- Started backend with PM2: `pm2 start ecosystem.config.js`
- Saved process list: `pm2 save`

**Result:** Backend runs persistently, auto-restarts on failure, logs managed.

**Note:** Frontend is served as static files by Nginx (no PM2 process needed).

---

### 4. Frontend Build & Static Hosting

**Actions:**
- Installed dependencies: `npm install`
- Built production bundle: `npm run build`
- Output: `/home/ubuntu/mercy-software-services/frontend/dist/`

**Result:** Production-ready static files ready for Nginx to serve.

---

### 5. Nginx Configuration

#### Frontend Configuration
**File:** `/etc/nginx/sites-available/mercy-software-services`

**Initial (HTTP only):**
```nginx
server {
    listen 80;
    server_name mercy-software-services.duckdns.org;

    root /home/ubuntu/mercy-software-services/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Final (HTTPS with redirect):**
```nginx
server {
    listen 80;
    server_name mercy-software-services.duckdns.org;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name mercy-software-services.duckdns.org;

    ssl_certificate /etc/letsencrypt/live/mercy-software-services.duckdns.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/mercy-software-services.duckdns.org/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    root /home/ubuntu/mercy-software-services/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
}
```

#### Backend Configuration
**File:** `/etc/nginx/sites-available/api-mss`

**Final (HTTPS with redirect):**
```nginx
server {
    listen 80;
    server_name api-mss.duckdns.org;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api-mss.duckdns.org;

    ssl_certificate /etc/letsencrypt/live/mercy-software-services.duckdns.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/mercy-software-services.duckdns.org/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    location / {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        add_header X-Frame-Options "DENY" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    }
}
```

**Actions:**
- Created both config files
- Enabled sites: `sudo ln -sf /etc/nginx/sites-available/mercy-software-services /etc/nginx/sites-enabled/`
- Tested config: `sudo nginx -t`
- Reloaded Nginx: `sudo systemctl reload nginx`

**Issues Fixed:**
- **Permission denied (500 error):** Fixed directory permissions so Nginx can read static files
  ```bash
  sudo chmod o+rx /home/ubuntu /home/ubuntu/mercy-software-services /home/ubuntu/mercy-software-services/frontend /home/ubuntu/mercy-software-services/frontend/dist
  ```

---

### 6. HTTPS Certificate Setup

#### Initial Attempts (Failed)

**Problem 1:** HTTP-01 challenge failed due to DNS CAA lookup issues
- Error: `SERVFAIL looking up CAA for duckdns.org`
- Tried: `certbot --nginx` and `certbot --webroot`
- Root cause: DuckDNS nameserver DNS issues, not VPS configuration

**Problem 2:** System DNS resolver failure
- Error: `Server Do53:127.0.0.53@53 answered SERVFAIL`
- Root cause: System DNS resolver couldn't resolve DuckDNS domains

#### Solution: DNS-01 Challenge with DuckDNS Plugin

**Step 1: Install Plugin**
```bash
sudo apt install -y python3-pip
sudo pip3 install certbot-dns-duckdns --break-system-packages
```

**Step 2: Fix System DNS**
```bash
sudo mkdir -p /etc/systemd/resolved.conf.d
sudo bash -c 'cat > /etc/systemd/resolved.conf.d/dns.conf <<EOF
[Resolve]
DNS=8.8.8.8 1.1.1.1
FallbackDNS=8.8.4.4 1.0.0.1
DNSSEC=no
EOF'
sudo systemctl restart systemd-resolved
```

**Step 3: Configure Credentials**
```bash
sudo mkdir -p /etc/letsencrypt/duckdns
sudo chmod 700 /etc/letsencrypt/duckdns
sudo bash -c 'cat > /etc/letsencrypt/duckdns/credentials.ini <<EOF
dns_duckdns_token = 2cb38d6a-1ebe-47a8-9ec7-b35f0975accf
EOF'
sudo chmod 600 /etc/letsencrypt/duckdns/credentials.ini
```

**Step 4: Obtain Certificates**
```bash
sudo certbot certonly --authenticator dns-duckdns \
  --dns-duckdns-credentials /etc/letsencrypt/duckdns/credentials.ini \
  --dns-duckdns-propagation-seconds 180 \
  -d mercy-software-services.duckdns.org \
  -d api-mss.duckdns.org \
  -m yassinefrigui9@gmail.com \
  --agree-tos --non-interactive
```

**Result:** ✅ Successfully obtained certificates
- Certificate location: `/etc/letsencrypt/live/mercy-software-services.duckdns.org/`
- Expires: 2026-04-29
- Auto-renewal: Configured automatically

**Why DNS-01 Works:**
- Uses DuckDNS API to create TXT records for validation
- Bypasses HTTP-01 challenges and DNS CAA issues
- More reliable for DuckDNS domains

---

## Final Architecture

```
Internet
   │
   ├─→ mercy-software-services.duckdns.org (HTTPS)
   │   └─→ Nginx (443) → Static files (/frontend/dist)
   │
   ├─→ api-mss.duckdns.org (HTTPS)
   │   └─→ Nginx (443) → Reverse proxy → Express (localhost:5001)
   │
   ├─→ site-waad.duckdns.org (HTTPS) [Existing]
   │   └─→ Nginx (443) → Reverse proxy → React dev server (localhost:3000)
   │
   └─→ api-waad.duckdns.org (HTTPS) [Existing]
       └─→ Nginx (443) → Reverse proxy → Express (localhost:5000)
```

**Port Allocation:**
- Port 80: HTTP → HTTPS redirects (all domains)
- Port 443: HTTPS (all domains)
- Port 3000: Waad frontend (PM2)
- Port 5000: Waad backend (PM2)
- Port 5001: MSS backend (PM2)

---

## Key Files & Locations

### DuckDNS
- `/home/ubuntu/duckdns/duckdns.conf` - Waad domains config
- `/home/ubuntu/duckdns/duckdns-mss.conf` - MSS domains config
- `/home/ubuntu/duckdns/update-duckdns.sh` - Multi-config updater script
- `/home/ubuntu/duckdns/duckdns.log` - Update logs

### Mercy Software Services
- `/home/ubuntu/mercy-software-services/.env` - Frontend environment
- `/home/ubuntu/mercy-software-services/backend/.env` - Backend environment
- `/home/ubuntu/mercy-software-services/ecosystem.config.js` - PM2 config
- `/home/ubuntu/mercy-software-services/frontend/dist/` - Production build

### Nginx
- `/etc/nginx/sites-available/mercy-software-services` - Frontend config
- `/etc/nginx/sites-available/api-mss` - Backend config
- `/etc/nginx/sites-enabled/` - Symlinks to enabled sites

### SSL Certificates
- `/etc/letsencrypt/live/mercy-software-services.duckdns.org/` - Certificates
- `/etc/letsencrypt/duckdns/credentials.ini` - DuckDNS token (secure)

---

## Verification & Testing

### HTTP → HTTPS Redirects
```bash
curl -I http://mercy-software-services.duckdns.org
# Should return: HTTP/1.1 301 Moved Permanently
# Location: https://mercy-software-services.duckdns.org
```

### HTTPS Frontend
```bash
curl -I https://mercy-software-services.duckdns.org
# Should return: HTTP/2 200
```

### HTTPS Backend
```bash
curl -I https://api-mss.duckdns.org
# Should return: HTTP/2 404 (Express app responding)
```

### PM2 Status
```bash
pm2 list
# Should show: mss-backend (online)
```

### DuckDNS Updates
```bash
tail -20 /home/ubuntu/duckdns/duckdns.log
# Should show successful updates for all 4 domains
```

---

## Issues Encountered & Solutions

### Issue 1: Frontend 500 Error
**Symptom:** Nginx returning 500 Internal Server Error  
**Cause:** Permission denied - Nginx couldn't read static files  
**Solution:** Fixed directory permissions with `chmod o+rx`

### Issue 2: Backend 502 Error
**Symptom:** Nginx returning 502 Bad Gateway  
**Cause:** Missing `dotenv` dependency  
**Solution:** `npm install dotenv --save` in backend directory

### Issue 3: HTTPS Certificate Failures
**Symptom:** HTTP-01 challenges failing with DNS CAA errors  
**Cause:** DuckDNS nameserver issues + system DNS resolver problems  
**Solution:** 
- Fixed system DNS resolver (Google DNS + Cloudflare)
- Switched to DNS-01 challenge using `certbot-dns-duckdns` plugin

### Issue 4: Rate Limiting
**Symptom:** Too many failed authorization attempts  
**Cause:** Multiple retry attempts hit Let's Encrypt rate limits  
**Solution:** Waited for rate limit to expire, then succeeded

---

## Best Practices Implemented

1. **Port Isolation:** Each service uses unique ports (no conflicts)
2. **Environment Separation:** Separate `.env` files for frontend/backend
3. **PM2 Management:** Proper logging, auto-restart, memory limits
4. **Security Headers:** XSS protection, frame options, content-type options
5. **HTTPS Enforcement:** All HTTP traffic redirects to HTTPS
6. **Static File Serving:** Production frontend served directly by Nginx (no Node process)
7. **DNS Strategy:** Multi-config approach for multiple DuckDNS accounts
8. **Certificate Auto-Renewal:** Certbot configured for automatic renewal

---

## Maintenance & Monitoring

### Check PM2 Status
```bash
pm2 list
pm2 logs mss-backend
```

### Check Nginx Status
```bash
sudo systemctl status nginx
sudo nginx -t
```

### Check Certificates
```bash
sudo certbot certificates
```

### Manual DuckDNS Update
```bash
bash /home/ubuntu/duckdns/update-duckdns.sh
```

### Renew Certificates (if needed)
```bash
sudo certbot renew
```

---

## Summary

✅ **All objectives achieved:**
- Both projects hosted on same VPS without conflicts
- DuckDNS auto-update extended for new domains
- Nginx reverse proxies configured for both projects
- HTTPS certificates obtained and configured
- PM2 best practices implemented
- HTTP → HTTPS redirects enabled
- Security headers configured
- Auto-renewal configured

**Final URLs:**
- Frontend: https://mercy-software-services.duckdns.org
- Backend API: https://api-mss.duckdns.org

**Status:** Production-ready and fully operational! 🚀
