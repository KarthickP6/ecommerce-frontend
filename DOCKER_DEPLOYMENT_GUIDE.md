# Docker Deployment Guide - Furniture E-Commerce Application

## 📋 Overview

Production-ready Docker setup for Spring Boot 3 application using:
- **Multi-stage build** for optimized image size
- **Eclipse Temurin 17 JRE** for minimal runtime image
- **JVM container optimizations** for memory and GC
- **Health checks** for container orchestration
- **Non-root user** for security
- **Docker Compose** for full stack deployment

---

## 🐳 Dockerfile Features

### Stage 1: Builder
- Uses `eclipse-temurin:17-jdk-jammy` (larger, has compiler)
- Downloads Maven dependencies (cached)
- Compiles Spring Boot application
- Creates optimized JAR file

### Stage 2: Runtime
- Uses `eclipse-temurin:17-jre-jammy` (smaller, runtime only)
- Minimal dependencies (curl for health checks)
- Non-root user (appuser) for security
- JVM optimizations enabled
- Health check configured

---

## 🚀 Quick Start

### Build Docker Image
```bash
cd ecommerce-backend/furniture

# Build image
docker build -t furniture:1.0 .

# List images
docker images | grep furniture
```

### Run Container
```bash
# Run standalone
docker run -d \
  --name furniture-app \
  -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/furniture \
  -e SPRING_DATASOURCE_USERNAME=furniture_user \
  -e SPRING_DATASOURCE_PASSWORD=your_password \
  furniture:1.0
```

### Check Container Status
```bash
# View logs
docker logs furniture-app

# View container stats
docker stats furniture-app

# Check health
docker inspect --format='{{.State.Health.Status}}' furniture-app
```

---

## 🐳 Docker Compose (Recommended)

### Complete Stack with Database

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f furniture-app

# Stop services
docker-compose down

# Remove volumes (WARNING: deletes database)
docker-compose down -v
```

### What It Includes
- PostgreSQL 15 database
- Furniture Spring Boot application
- Networking configured
- Health checks enabled
- Data persistence

### Environment Variables
```yaml
Database:
  Host: postgres
  Port: 5432
  Database: furniture
  Username: furniture_user
  Password: furniture_secure_password_123

Application:
  Port: 8080
  Health Check: http://localhost:8080/api/categories
```

---

## 📊 Image Size Comparison

### With Multi-stage Build (Recommended)
```
Stage 1 (Builder): ~600MB (discarded)
Stage 2 (Runtime): ~200MB (final image)
Total: 200MB
```

### Without Multi-stage Build
```
Single stage with JDK: ~800MB
```

**Savings: 4x smaller image!**

---

## ⚙️ JVM Optimizations

The Dockerfile includes optimal JVM settings:

```
-XX:+UseContainerSupport
  → Detects container memory limits

-XX:MaxRAMPercentage=75.0
  → Use 75% of container memory

-XX:InitialRAMPercentage=25.0
  → Start with 25% of container memory

-XX:+UseG1GC
  → G1 Garbage Collector (low latency)

-XX:MaxGCPauseMillis=200
  → Max 200ms pause times

-XX:+UnlockExperimentalVMOptions
  → Enable experimental JVM features

-XX:G1NewCollectionHeuristicThresholdPercent=20
  → Tuned for container memory

-XX:G1MaxNewGenTaskPercent=30
  → Parallel GC optimization
```

---

## 🏥 Health Check

The container includes automatic health monitoring:

```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8080/api/categories || exit 1
```

**Configuration:**
- **Interval:** Check every 30 seconds
- **Timeout:** Wait 10 seconds for response
- **Start Period:** Allow 40 seconds for startup
- **Retries:** Fail after 3 consecutive failures
- **Endpoint:** `/api/categories` (indicates database connectivity)

**Check Status:**
```bash
docker inspect furniture-app --format='{{json .State.Health}}'
```

---

## 🔒 Security Features

### Non-root User
```dockerfile
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser
```

Benefits:
- Container runs as unprivileged user
- Limits damage if container is compromised
- Follows security best practices

### Minimal Image
- Only includes JRE, not JDK
- Reduced attack surface
- Faster pulls and deployments

---

## 📦 Build Optimization

### .dockerignore File
Reduces build context size:
```
target/         (compiled classes)
.git/           (version control)
.idea/          (IDE files)
node_modules/   (frontend deps)
test-results/   (test outputs)
```

### Multi-stage Build Benefits
1. **Build dependencies not in final image**
   - Maven, JDK compiler excluded
   - Smaller runtime size

2. **Cached layers**
   - Dependencies layer cached separately
   - Faster rebuilds when code changes

3. **Optimized for production**
   - Only runtime JRE included
   - No build tools in production

---

## 🚢 Production Deployment

### Docker Registry (Push to Registry)
```bash
# Login to registry
docker login registry.example.com

# Tag image
docker tag furniture:1.0 registry.example.com/furniture:1.0

# Push to registry
docker push registry.example.com/furniture:1.0

# Pull on production server
docker pull registry.example.com/furniture:1.0
docker run -d registry.example.com/furniture:1.0
```

### Kubernetes Deployment (Optional)
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: furniture-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: furniture
  template:
    metadata:
      labels:
        app: furniture
    spec:
      containers:
      - name: furniture
        image: registry.example.com/furniture:1.0
        ports:
        - containerPort: 8080
        env:
        - name: SPRING_DATASOURCE_URL
          valueFrom:
            secretKeyRef:
              name: db-creds
              key: url
        livenessProbe:
          httpGet:
            path: /api/categories
            port: 8080
          initialDelaySeconds: 40
          periodSeconds: 30
        readinessProbe:
          httpGet:
            path: /api/categories
            port: 8080
          initialDelaySeconds: 20
          periodSeconds: 10
```

---

## 🔍 Troubleshooting

### Container won't start
```bash
# Check logs
docker logs furniture-app

# Check resource limits
docker stats furniture-app

# Increase memory
docker run -m 2g furniture:1.0
```

### Health check failing
```bash
# Check endpoint manually
docker exec furniture-app curl http://localhost:8080/api/categories

# Check database connection
docker exec furniture-app curl -v http://postgres:5432
```

### Image too large
```bash
# Check image layers
docker history furniture:1.0

# Verify multi-stage build worked
docker inspect furniture:1.0 | grep Size
```

### Port conflicts
```bash
# Change port mapping
docker run -p 9080:8080 furniture:1.0

# Check port usage
netstat -an | grep 8080
```

---

## 📝 Environment Variables

Required for running the application:

```bash
# Database Configuration
SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/furniture
SPRING_DATASOURCE_USERNAME=furniture_user
SPRING_DATASOURCE_PASSWORD=your_secure_password

# JPA/Hibernate
SPRING_JPA_HIBERNATE_DDL_AUTO=validate

# Server Configuration
SERVER_PORT=8080
SERVER_SERVLET_CONTEXT_PATH=/

# Application Config
SPRING_APPLICATION_NAME=furniture
LOGGING_LEVEL_ROOT=INFO
```

---

## 📈 Performance Monitoring

### Memory Usage
```bash
docker stats furniture-app --no-stream

# Sample output:
# CONTAINER    MEM USAGE    MEM %    LIMIT
# furniture    450M         56%      800M
```

### CPU Usage
```bash
docker top furniture-app
```

### Log Analysis
```bash
# Last 100 lines
docker logs --tail 100 furniture-app

# Follow logs
docker logs -f furniture-app

# With timestamps
docker logs --timestamps furniture-app
```

---

## ✅ Verification Checklist

Before production deployment, verify:

- [ ] Image builds without errors
- [ ] Container starts successfully
- [ ] Health check passes
- [ ] Application responds on port 8080
- [ ] Database connection working
- [ ] Logs show no errors
- [ ] Memory usage is reasonable (<1GB)
- [ ] CPU usage is stable
- [ ] Non-root user running container
- [ ] Image size is ~200MB
- [ ] Health check endpoint accessible
- [ ] Environment variables set correctly

---

## 🎯 Best Practices Applied

✅ **Multi-stage builds** - Optimized image size  
✅ **Minimal base images** - JRE only, no JDK  
✅ **Non-root user** - Enhanced security  
✅ **Health checks** - Container orchestration ready  
✅ **JVM tuning** - Container-aware settings  
✅ **.dockerignore** - Efficient build context  
✅ **Explicit ports** - Clear service mapping  
✅ **Proper labels** - Metadata for tracking  
✅ **Error handling** - Graceful startup/shutdown  
✅ **Documentation** - Comprehensive guide  

---

## 🚀 Next Steps

1. Build the image
2. Test locally with docker-compose
3. Push to registry
4. Deploy to production (Kubernetes/Docker Swarm/Cloud)
5. Monitor and collect metrics
6. Set up CI/CD pipeline for auto-deployment

---

## 📞 Support

For issues:
1. Check logs: `docker logs furniture-app`
2. Verify health: `docker inspect furniture-app`
3. Test connectivity: `docker exec furniture-app curl http://localhost:8080`
4. Check resources: `docker stats furniture-app`

---

**Last Updated:** February 27, 2026  
**Status:** ✅ Production Ready

