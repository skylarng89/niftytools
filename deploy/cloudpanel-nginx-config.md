# CloudPanel Nginx Configuration for NiftyTools

This document provides nginx configuration examples for CloudPanel to proxy to your NiftyTools Docker containers.

## Prerequisites

1. NiftyTools stack deployed with Docker Swarm
2. CloudPanel installed and configured
3. Domains pointed to your server

## Site Configuration Examples

### User Frontend Site (e.g., niftytools.com)

Create a new site in CloudPanel with your domain, then update the nginx configuration:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name niftytools.com www.niftytools.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name niftytools.com www.niftytools.com;

    # SSL configuration (CloudPanel handles this automatically)
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/private.key;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Proxy to user frontend container
    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 10s;
        proxy_send_timeout 10s;
        proxy_read_timeout 10s;
    }

    # Proxy API requests to backend
    location /api/ {
        proxy_pass http://127.0.0.1:3000/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 10s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
        
        # Handle CORS if needed
        add_header Access-Control-Allow-Origin "$http_origin" always;
        add_header Access-Control-Allow-Credentials true always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Accept,Authorization,Cache-Control,Content-Type,DNT,If-Modified-Since,Keep-Alive,Origin,User-Agent,X-Requested-With" always;
        
        if ($request_method = 'OPTIONS') {
            return 204;
        }
    }
}
```

### Admin Frontend Site (e.g., admin.niftytools.com)

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name admin.niftytools.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name admin.niftytools.com;

    # SSL configuration (CloudPanel handles this automatically)
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/private.key;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Admin access restrictions (optional)
    # allow 192.168.1.0/24;  # Allow local network
    # allow your.ip.address;  # Allow your IP
    # deny all;

    # Proxy to admin frontend container
    location / {
        proxy_pass http://127.0.0.1:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 10s;
        proxy_send_timeout 10s;
        proxy_read_timeout 10s;
    }

    # Proxy API requests to backend
    location /api/ {
        proxy_pass http://127.0.0.1:3000/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 10s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }
}
```

### API-Only Site (Optional - e.g., api.niftytools.com)

If you want a dedicated API endpoint:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name api.niftytools.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.niftytools.com;

    # SSL configuration (CloudPanel handles this automatically)
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/private.key;

    # Rate limiting (optional)
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req zone=api burst=20 nodelay;

    # Proxy all requests to backend
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 10s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
        
        # CORS headers for API
        add_header Access-Control-Allow-Origin "$http_origin" always;
        add_header Access-Control-Allow-Credentials true always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Accept,Authorization,Cache-Control,Content-Type,DNT,If-Modified-Since,Keep-Alive,Origin,User-Agent,X-Requested-With" always;
        
        if ($request_method = 'OPTIONS') {
            return 204;
        }
    }
}
```

## CloudPanel Configuration Steps

1. **Create Sites**:
   - Create a new site for each domain in CloudPanel
   - Choose "Node.js" or "Generic" site type

2. **Update Nginx Config**:
   - Go to each site's settings
   - Navigate to "Nginx" configuration
   - Replace the default config with the appropriate configuration above

3. **SSL Certificates**:
   - CloudPanel will automatically handle SSL via Let's Encrypt
   - Just enable SSL in the site settings

4. **Firewall**:
   - Ensure ports 80 and 443 are open for web traffic
   - Ports 3000, 3001, 3002 should be blocked from external access (Docker swarm handles internal routing)

## Important Notes

- Replace `niftytools.com` with your actual domain
- The backend is accessed via `127.0.0.1:3000` (localhost) since it's not exposed externally
- Frontend containers are accessed via `127.0.0.1:3001` and `127.0.0.1:3002`
- CloudPanel handles SSL certificate management automatically
- Consider adding rate limiting and security measures for production use

## Testing

After configuration:

1. Test frontend: `https://niftytools.com`
2. Test admin: `https://admin.niftytools.com`  
3. Test API through frontend: Browser developer tools should show successful API calls

The containers will serve static files, and CloudPanel nginx will handle all routing, SSL, and API proxying.