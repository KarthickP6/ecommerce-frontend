# Docker Entrypoint Setup - External PostgreSQL Configuration

## 📋 Overview

This setup uses an `entrypoint.sh` script to:
- ✅ Wait for PostgreSQL readiness before starting the application
- ✅ Handle database connectivity checks
- ✅ Ensure proper signal handling (PID 1 management)
- ✅ Graceful shutdown on SIGTERM/SIGINT
- ✅ Maintain JVM container optimizations
- ✅ Support external PostgreSQL (not in Docker Compose)

---

## 🏗️ Files Structure

```
ecommerce-backend/furniture/
├── Dockerfile              (Updated - uses entrypoint.sh)
├── entrypoint.sh           (NEW - database readiness + signals)
└── .dockerignore           (Excludes build artifacts)
```

---

## 🚀 Quick Start

### Step 1: Build Docker Image

```bash
cd ecommerce-backend/furniture

# Build image
docker build -t furniture:2.0 .

# Verify build
docker images | grep furniture
```

### Step 2: Run PostgreSQL Externally

**Option A: Using Docker (standalone)**
```bash
docker run -d \
  --name furniture-postgres \
  -e POSTGRES_DB=furniture \
  -e POSTGRES_USER=furniture_user \
  -e POSTGRES_PASSWORD=furniture_password \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  postgres:15-alpine
```

**Option B: Using Docker Network (recommended)**
```bash
# Create network
docker network create furniture-network

# Run PostgreSQL on network
docker run -d \
  --name furniture-postgres \
  --network furniture-network \
  -e POSTGRES_DB=furniture \
  -e POSTGRES_USER=furniture_user \
  -e POSTGRES_PASSWORD=furniture_password \
  -v postgres_data:/var/lib/postgresql/data \
  postgres:15-alpine
```

**Option C: External PostgreSQL**
```bash
# Use existing PostgreSQL server (e.g., on host, AWS RDS, etc.)
# Just provide connection details in docker run command
```

### Step 3: Run Spring Boot Application

**Basic Usage (localhost PostgreSQL)**
```bash
docker run -d \
  --name furniture-app \
  -p 8080:8080 \
  -e SPRING_DATASOURCE_HOST=host.docker.internal \
  -e SPRING_DATASOURCE_PORT=5432 \
  -e SPRING_DATASOURCE_DATABASE=furniture \
  -e SPRING_DATASOURCE_USERNAME=furniture_user \
  -e SPRING_DATASOURCE_PASSWORD=furniture_password \
  furniture:2.0
```

**Docker Network (recommended)**
```bash
docker run -d \
  --name furniture-app \
  --network furniture-network \
  -p 8080:8080 \
  -e SPRING_DATASOURCE_HOST=furniture-postgres \
  -e SPRING_DATASOURCE_PORT=5432 \
  -e SPRING_DATASOURCE_DATABASE=furniture \
  -e SPRING_DATASOURCE_USERNAME=furniture_user \
  -e SPRING_DATASOURCE_PASSWORD=furniture_password \
  -e DB_WAIT_TIMEOUT=60 \
  furniture:2.0
```

**With Memory Limit**
```bash
docker run -d \
  --name furniture-app \
  --network furniture-network \
  -p 8080:8080 \
  -m 2g \
  --memory-swap 2g \
  -e SPRING_DATASOURCE_HOST=furniture-postgres \
  -e SPRING_DATASOURCE_USERNAME=furniture_user \
  -e SPRING_DATASOURCE_PASSWORD=furniture_password \
  furniture:2.0
```

---

## 🔍 Entrypoint Script Explanation

### Signal Handling
```bash
trap trap_handler SIGTERM SIGINT
```
- Traps SIGTERM and SIGINT signals
- Forwards them to Java process
- Enables graceful shutdown

### Database Readiness
```bash
wait_for_postgres() {
    # Checks if PostgreSQL port is open
    # Validates connection with psql if available
    # Retries with configurable timeout
}
```

### Process Management
```bash
exec java ${JAVA_OPTS} -jar app.jar &
JAVA_PID=$!
wait $JAVA_PID
```
- `exec` ensures Java replaces shell as PID 1
- Proper signal forwarding to Java process
- Handles exit codes correctly

---

## 📊 Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `SPRING_DATASOURCE_HOST` | localhost | PostgreSQL hostname |
| `SPRING_DATASOURCE_PORT` | 5432 | PostgreSQL port |
| `SPRING_DATASOURCE_DATABASE` | furniture | Database name |
| `SPRING_DATASOURCE_USERNAME` | furniture_user | DB username |
| `SPRING_DATASOURCE_PASSWORD` | furniture_password | DB password |
| `DB_WAIT_TIMEOUT` | 60 | Seconds to wait for DB |
| `SKIP_DB_CHECK` | false | Skip database readiness |
| `JAVA_OPTS` | (optimized) | JVM arguments |

---

## 🔐 Security Features

✅ **Non-root user execution** (appuser:1000)
✅ **Minimal base image** (JRE only)
✅ **No exposed secrets** (use environment variables)
✅ **Network isolation** (Docker networks)
✅ **Read-only volumes** (where applicable)
✅ **Health checks** built-in
✅ **Signal handling** for graceful shutdown

---

## 🐛 Troubleshooting

### Container exits immediately
```bash
docker logs furniture-app

# Check database connectivity
docker exec furniture-app nc -zv furniture-postgres 5432
```

### Database connection timeout
```bash
# Increase timeout
docker run -e DB_WAIT_TIMEOUT=120 furniture:2.0

# Or skip check
docker run -e SKIP_DB_CHECK=true furniture:2.0
```

### Signal handling not working
```bash
# Verify Java is PID 1
docker top furniture-app

# Expected output: Java process should have PID 1
```

### Memory issues
```bash
# Check memory usage
docker stats furniture-app

# Increase limit
docker run -m 4g furniture:2.0
```

---

## ✅ Verification

### Check Container Health
```bash
# View health status
docker inspect --format='{{.State.Health.Status}}' furniture-app

# Expected: healthy

# View detailed health info
docker inspect furniture-app | grep -A 5 '"Health"'
```

### Test Application Endpoint
```bash
# From host machine
curl http://localhost:8080/api/categories

# From within container
docker exec furniture-app curl http://localhost:8080/api/categories

# Expected: JSON response with categories
```

### View Startup Logs
```bash
# All logs
docker logs furniture-app

# Follow logs (tail -f)
docker logs -f furniture-app

# Last 50 lines
docker logs --tail 50 furniture-app

# With timestamps
docker logs -t furniture-app
```

### Monitor Resource Usage
```bash
# Real-time stats
docker stats furniture-app

# One-time snapshot
docker stats --no-stream furniture-app

# Expected memory: <1GB, CPU: <10%
```

---

## 🔄 Lifecycle Management

### Graceful Shutdown
```bash
# Send SIGTERM (graceful)
docker stop furniture-app

# Force kill after timeout
docker kill furniture-app

# Remove container
docker rm furniture-app
```

### Restart Container
```bash
# Restart automatically
docker run --restart=always furniture:2.0

# Restart policies:
# no              - Do not automatically restart
# always          - Always restart
# unless-stopped  - Always restart unless explicitly stopped
# on-failure      - Restart on failure with max retries
```

### View Container Events
```bash
docker events --filter container=furniture-app
```

---

## 🎯 Best Practices Applied

✅ **Multi-stage builds** - Optimized image size (200MB)
✅ **Entrypoint script** - Proper initialization sequence
✅ **Database readiness** - Prevents race conditions
✅ **Signal handling** - Graceful shutdown (PID 1)
✅ **Health checks** - Container orchestration ready
✅ **Non-root user** - Enhanced security
✅ **Memory optimization** - G1GC, container-aware JVM
✅ **Logging** - Clear startup messages with timestamps
✅ **Error handling** - Informative error messages
✅ **Documentation** - Comprehensive guides

---

## 📈 Performance Tuning

### Memory Configuration

```bash
# Default (75% of container memory)
docker run -m 2g furniture:2.0
# JVM gets: 2GB × 0.75 = 1.5GB

# Custom JVM options
docker run \
  -e JAVA_OPTS="-XX:MaxRAMPercentage=85.0 -XX:InitialRAMPercentage=40.0" \
  -m 4g \
  furniture:2.0
```

### GC Tuning

```bash
# For low-latency applications
docker run \
  -e JAVA_OPTS="-XX:MaxGCPauseMillis=100" \
  furniture:2.0

# For throughput optimization
docker run \
  -e JAVA_OPTS="-XX:MaxGCPauseMillis=500" \
  furniture:2.0
```

---

## 🚢 Production Deployment

### Docker Swarm
```bash
docker service create \
  --name furniture-app \
  --network furniture-network \
  -p 8080:8080 \
  -e SPRING_DATASOURCE_HOST=furniture-postgres \
  --health-cmd="curl -f http://localhost:8080/api/categories" \
  --health-interval=30s \
  --health-timeout=10s \
  --health-retries=3 \
  furniture:2.0
```

### Kubernetes
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: furniture-app
spec:
  containers:
  - name: furniture
    image: furniture:2.0
    ports:
    - containerPort: 8080
    env:
    - name: SPRING_DATASOURCE_HOST
      value: furniture-postgres-service
    - name: SPRING_DATASOURCE_PORT
      value: "5432"
    - name: SPRING_DATASOURCE_USERNAME
      valueFrom:
        secretKeyRef:
          name: db-credentials
          key: username
    resources:
      limits:
        memory: "2Gi"
        cpu: "1000m"
      requests:
        memory: "512Mi"
        cpu: "250m"
    livenessProbe:
      httpGet:
        path: /api/categories
        port: 8080
      initialDelaySeconds: 40
      periodSeconds: 10
    readinessProbe:
      httpGet:
        path: /api/categories
        port: 8080
      initialDelaySeconds: 20
      periodSeconds: 5
```

---

## 🔄 Complete Example Workflow

```bash
# 1. Build image
docker build -t furniture:2.0 ecommerce-backend/furniture

# 2. Create network
docker network create furniture-network

# 3. Run PostgreSQL
docker run -d \
  --name furniture-postgres \
  --network furniture-network \
  -e POSTGRES_DB=furniture \
  -e POSTGRES_USER=furniture_user \
  -e POSTGRES_PASSWORD=furniture_password \
  postgres:15-alpine

# 4. Wait for database to be ready
sleep 5

# 5. Run application
docker run -d \
  --name furniture-app \
  --network furniture-network \
  -p 8080:8080 \
  -m 2g \
  -e SPRING_DATASOURCE_HOST=furniture-postgres \
  -e SPRING_DATASOURCE_USERNAME=furniture_user \
  -e SPRING_DATASOURCE_PASSWORD=furniture_password \
  furniture:2.0

# 6. Check health
docker logs furniture-app
curl http://localhost:8080/api/categories

# 7. Monitor
docker stats furniture-app
docker top furniture-app

# 8. Cleanup
docker stop furniture-app furniture-postgres
docker rm furniture-app furniture-postgres
docker network rm furniture-network
```

---

## 📞 Support

For issues:
1. Check logs: `docker logs furniture-app`
2. Verify database: `docker exec furniture-app nc -zv furniture-postgres 5432`
3. Test endpoint: `curl http://localhost:8080/api/categories`
4. Check resources: `docker stats furniture-app`
5. View health: `docker inspect furniture-app`

---

**Last Updated:** February 27, 2026  
**Version:** 2.0  
**Status:** ✅ Production Ready

