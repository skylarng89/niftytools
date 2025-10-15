# Docker Production Deployment

Docker setup is optimized for **production deployments only**. For development, use the manual setup (see README.md) which is faster and provides better debugging experience.

## 🎯 Philosophy

**Development**: Manual setup with `npm run dev` (hot reload, instant feedback, easy debugging)  
**Production**: Docker with optimized images, health checks, and security hardening

## 🚀 Quick Start

### Deploy to Production

```bash
# Build and start all services
docker compose up -d --build

# Check status
docker compose ps

# View logs
docker compose logs -f

# Stop services
docker compose down
```

### Access Points

- **Frontend**: http://localhost:80
- **API Gateway**: http://localhost:3000
- **Text Tools Service**: http://localhost:3001

## 🔒 Security Features

### Non-Root Users
All services run as non-root users for security:
- **Backend services**: `nodejs` user (UID 1001)
- **Frontend**: `nginx` user (UID 101)

### Signal Handling
- **dumb-init** ensures proper signal handling (SIGTERM, SIGINT)
- Graceful shutdowns prevent data loss
- No zombie processes

### Minimal Attack Surface
- Alpine Linux base images
- Only production dependencies
- No dev tools in production images
- Security headers on frontend (XSS, clickjacking protection)

## 🚀 Performance Optimizations

### Multi-Stage Builds
Each Dockerfile uses two stages:

1. **Build stage**: Compiles TypeScript, installs dependencies
2. **Production stage**: Minimal runtime with only what's needed

### Image Sizes
- **Gateway**: ~150MB
- **Text Tools Service**: ~150MB
- **Frontend**: ~50MB (Nginx + static files)
- **Total**: ~350MB for entire stack

### Layer Caching
- Dependencies installed before source code
- Maximizes Docker layer cache efficiency
- Faster rebuilds

## 🏥 Health Checks

All services include health checks:

**Configuration:**
- Interval: 30s
- Timeout: 3s
- Retries: 3
- Start period: 10s

**Backend services:**
```bash
curl http://localhost:3000/health  # Gateway
curl http://localhost:3001/health  # Text Tools
```

**Frontend:**
```bash
curl http://localhost:80/
```

## 📊 Resource Limits

Production docker-compose.yml includes resource limits:

**Gateway & Text Tools Service:**
- CPU: 0.25-0.5 cores
- Memory: 256M-512M

**Frontend:**
- CPU: 0.1-0.25 cores
- Memory: 128M-256M

Adjust these based on your production load.

## 📝 Logging

**Configuration:**
- Driver: `json-file`
- Max size: 10MB per file
- Max files: 3 (30MB total per service)
- Automatic rotation

**View logs:**
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f gateway

# Last 100 lines
docker compose logs --tail=100 gateway
```

## 🔄 Deployment Workflow

### Initial Deployment
```bash
docker compose up -d --build
```

### Update a Service
```bash
# Rebuild and restart specific service
docker compose up -d --build gateway

# Or rebuild all
docker compose build
docker compose up -d
```

### Rolling Updates
```bash
# Update one service at a time
docker compose up -d --no-deps --build gateway
docker compose up -d --no-deps --build text-tools-service
docker compose up -d --no-deps --build frontend
```

### Rollback
```bash
# Stop and remove containers
docker compose down

# Use previous image or rebuild from git
git checkout <previous-commit>
docker compose up -d --build
```

## 🌐 Nginx Configuration

The frontend uses Nginx with production optimizations:

### Compression
- Gzip enabled (level 6)
- Min size: 1KB
- Compressed types: HTML, CSS, JS, JSON, fonts, SVG

### Caching
- **Static assets**: 1 year cache (immutable)
- **HTML files**: No cache (for SPA routing)
- **API requests**: No cache

### Security Headers
- `X-Frame-Options`: Prevent clickjacking
- `X-Content-Type-Options`: Prevent MIME sniffing
- `X-XSS-Protection`: XSS protection
- `Referrer-Policy`: Control referrer
- `Permissions-Policy`: Restrict browser features

### API Proxying
- Timeout: 60s
- Proper header forwarding
- Buffer optimization

## 🔧 Troubleshooting

### Service Won't Start

```bash
# Check logs
docker compose logs <service-name>

# Check health
docker compose ps

# Rebuild from scratch
docker compose down -v
docker compose build --no-cache
docker compose up -d
```

### High Memory Usage

```bash
# Check current usage
docker stats

# Adjust limits in docker-compose.yml
deploy:
  resources:
    limits:
      memory: 1G  # Increase if needed
```

### Slow Builds

```bash
# Use BuildKit
DOCKER_BUILDKIT=1 docker compose build

# Clean build cache
docker builder prune

# Remove unused images
docker image prune -a
```

### Network Issues

```bash
# Check network
docker network inspect niftytools

# Recreate network
docker compose down
docker network rm niftytools
docker compose up -d
```

## 📋 Production Checklist

Before deploying to production:

- [ ] Set environment variables properly
- [ ] Configure external secrets management (not in docker-compose.yml)
- [ ] Set up external logging (ELK, Datadog, CloudWatch, etc.)
- [ ] Configure monitoring and alerts
- [ ] Set up backup strategy
- [ ] Configure reverse proxy with HTTPS (Traefik, Nginx, Caddy)
- [ ] Enable HTTPS with valid certificates (Let's Encrypt)
- [ ] Configure firewall rules
- [ ] Set up CI/CD pipeline
- [ ] Document deployment procedures
- [ ] Test disaster recovery
- [ ] Configure auto-scaling (if using orchestrator)

## 🔐 Security Scan

Scan images for vulnerabilities:

```bash
# Using Docker scan
docker scan niftytools-gateway
docker scan niftytools-text-tools
docker scan niftytools-frontend

# Using Trivy
trivy image niftytools-gateway
trivy image niftytools-text-tools
trivy image niftytools-frontend
```

## 📊 Monitoring

### Health Checks
```bash
# Check all services
docker compose ps

# Automated monitoring
watch -n 5 'docker compose ps'
```

### Resource Usage
```bash
# Real-time stats
docker stats

# Specific container
docker stats niftytools-gateway
```

### Logs
```bash
# Follow all logs
docker compose logs -f

# Search logs
docker compose logs | grep ERROR

# Export logs
docker compose logs > logs.txt
```

## 🚀 Advanced Usage

### Environment-Specific Configs

```bash
# Use different compose files
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Override with environment
COMPOSE_FILE=docker-compose.yml:docker-compose.prod.yml docker compose up -d
```

### Scaling Services

```bash
# Scale text-tools-service
docker compose up -d --scale text-tools-service=3

# Note: Requires load balancer configuration
```

### Custom Networks

```bash
# Create external network
docker network create niftytools-prod

# Update docker-compose.yml to use external network
networks:
  niftytools:
    external: true
    name: niftytools-prod
```

## 📚 Best Practices

1. ✅ **Never run as root** - All services use non-root users
2. ✅ **Health checks** - Automatic recovery and monitoring
3. ✅ **Resource limits** - Prevent resource exhaustion
4. ✅ **Logging** - Rotation prevents disk space issues
5. ✅ **Secrets management** - Use Docker secrets or external vault
6. ✅ **Multi-stage builds** - Small, optimized images
7. ✅ **Layer caching** - Fast builds
8. ✅ **.dockerignore** - Exclude unnecessary files
9. ✅ **Security headers** - Protect against common attacks
10. ✅ **Regular updates** - Keep base images and dependencies updated

## 🎯 Why Not Docker for Development?

**Manual setup is better for development because:**

1. **Faster iteration** - No container rebuilds
2. **Better debugging** - Direct access to Node.js debugger
3. **Simpler** - Just `npm run dev` in 3 terminals
4. **Hot reload works better** - No volume mount issues
5. **Less resource usage** - No Docker overhead

**Use Docker only for:**
- Production deployments
- Testing production builds
- CI/CD pipelines
- Ensuring deployment consistency

---

**Your production deployment is ready!** 🎉

For development, see README.md for manual setup instructions.
