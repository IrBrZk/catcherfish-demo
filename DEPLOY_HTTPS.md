# HTTPS deployment for CatcherFish API

GitHub Pages runs on `https://`, so the API must also be reachable over `https://` or browser fetches will be blocked as mixed content.

## Recommended setup

1. Use a real domain name for the VPS.
2. Point the domain's DNS `A` record to the VPS IP.
3. Run FastAPI on `127.0.0.1:8000` with `uvicorn`.
4. Put Nginx in front as a reverse proxy.
5. Issue a Let's Encrypt certificate with Certbot.

## Why a domain is needed

Let's Encrypt certificates are domain-validated. For a browser-trusted certificate, the API endpoint should be a domain such as `api.example.com`, not a bare IP address.

## Nginx flow

- HTTP on port 80 redirects to HTTPS.
- HTTPS on port 443 terminates TLS.
- Nginx proxies requests to `http://127.0.0.1:8000`.

## Files in this repo

- `nginx/catcherfish-api.conf`
- `catcherfish-api.service`

## VPS commands

```bash
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx

sudo cp catcherfish-api.conf /etc/nginx/sites-available/catcherfish-api
sudo ln -s /etc/nginx/sites-available/catcherfish-api /etc/nginx/sites-enabled/catcherfish-api
sudo nginx -t
sudo systemctl reload nginx

sudo certbot --nginx -d api.example.com
sudo systemctl enable catcherfish-api
sudo systemctl start catcherfish-api
```

## Frontend

After TLS is enabled, set the admin panel API base to:

```js
const API_BASE = 'https://api.example.com';
```
