
# VPS + DuckDNS Multi-Project Hosting Setup — Problem Statement

## Context

I have a VPS running Linux where I am hosting **Waad Nails** (path : ~/Waad_Nails), which consists of:
- A React frontend (Node.js instance)
- An Express backend (Node.js instance)

Both services are exposed via DuckDNS subdomains:
- One URL for the frontend
- One URL for the backend

I already have an automated DuckDNS update system:

```

/home/ubuntu/duckdns/
├── duckdns.conf
├── update-duckdns.sh
├── duckdns.log

````

### `duckdns.conf`
```bash
DOMAINS="frontendA,apiA"
TOKEN="my_duckdns_token"
````

### `update-duckdns.sh`

```bash
#!/bin/bash

# DuckDNS Update Script for Waad Nails
# This script updates your DuckDNS subdomains to point to your current IP

# Load configuration
CONFIG_FILE="/home/ubuntu/duckdns/duckdns.conf"
if [ -f "$CONFIG_FILE" ]; then
    source "$CONFIG_FILE"
else
    echo "$(date): Configuration file not found: $CONFIG_FILE" >> $LOGFILE
    exit 1
fi

LOGFILE="/home/ubuntu/duckdns/duckdns.log"

# Check if token is set
if [ -z "$TOKEN" ] || [ "$TOKEN" = "YOUR_DUCKDNS_TOKEN_HERE" ]; then
    echo "$(date): DuckDNS token not configured. Please set TOKEN in $CONFIG_FILE" >> $LOGFILE
    exit 1
fi

# Get current IP
CURRENT_IP=$(curl -s -4 ifconfig.me)

# Log the update
echo "$(date): Updating DuckDNS domains $DOMAINS to IP $CURRENT_IP" >> $LOGFILE

# Update DuckDNS for each domain separately
IFS=',' read -ra DOMAIN_ARRAY <<< "$DOMAINS"
for domain in "${DOMAIN_ARRAY[@]}"; do
    domain=$(echo "$domain" | xargs)  # Trim whitespace
    echo "$(date): Updating domain $domain to IP $CURRENT_IP" >> $LOGFILE

    RESPONSE=$(curl -s "https://www.duckdns.org/update?domains=$domain&token=$TOKEN&ip=$CURRENT_IP")

    echo "$(date): Domain $domain response: $RESPONSE" >> $LOGFILE

    if [[ $RESPONSE == "OK" ]]; then
        echo "$(date): Domain $domain update successful" >> $LOGFILE
    else
        echo "$(date): Domain $domain update failed: $RESPONSE" >> $LOGFILE
    fi
done
```

## New Situation

* I logged into DuckDNS and created **two new subdomains**:

  * `api-mss.duckdns.org`
  * `mercy-software-services.duckdns.org`
* I also received a **new DuckDNS token**(New_token_value=2cb38d6a-1ebe-47a8-9ec7-b35f0975accf).
* These new domains are intended for **Mercy Software Services** path : ~/Waad_Nails.

## Application Requirements

### Environment Variables (Mercy Software Services)

The `.env` file must use the new URLs:

```env
VITE_API_URL=https://api-mss.duckdns.org
FRONTEND_URL=https://mercy-software-services.duckdns.org
```

### Networking & Security

* Use **Nginx as a reverse proxy**.
* Use **Let's Encrypt (Certbot)** to secure both URLs with HTTPS.
* Route:

  * `mercy-software-services.duckdns.org` → React app (Node.js)
  * `api-mss.duckdns.org` → Express backend (Node.js)

## Objectives

1. Safely host **Waad_Nails and Mercy Software Services** on the same VPS.
2. Ensure **no DNS conflict** between projects.
3. Extend my existing **DuckDNS auto-update system** to include Mercy Software Services using the new token.
4. Configure **Nginx + HTTPS** for both frontend and backend of Mercy Software Services.
5. Maintain a **clean, scalable structure** using PM2 + Nginx + DuckDNS.

## Request

Provide:

1. A **DNS strategy** for using multiple DuckDNS domains pointing to the same VPS IP.
2. A **complete Nginx configuration** for Mercy Software Services (frontend + backend).
3. A **secure HTTPS setup** using Let's Encrypt.
4. An updated **DuckDNS configuration** supporting both projects (possibly with multiple tokens).
5. Best practices for running multiple Node.js services on one VPS.


