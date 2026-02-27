# Docker Run Commands Reference

## 🚀 Quick Reference Card

### Build Image
```bash
docker build -t furniture:2.0 ecommerce-backend/furniture
```

---

## 🗄️ PostgreSQL Setup

### Option 1: Local Docker Container
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

### Option 2: Docker Network (Recommended)
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

---

## ☕ Spring Boot Application

### Basic (localhost PostgreSQL)
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

### With Docker Network
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

### With Memory Limits
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

### With Custom JVM Options
```bash
docker run -d \
  --name furniture-app \
  --network furniture-network \
  -p 8080:8080 \
  -m 4g \
  -e SPRING_DATASOURCE_HOST=furniture-postgres \
  -e JAVA_OPTS="-XX:MaxRAMPercentage=85.0 -XX:MaxGCPauseMillis=100" \
  -e SPRING_DATASOURCE_USERNAME=furniture_user \
  -e SPRING_DATASOURCE_PASSWORD=furniture_password \
  furniture:2.0
```

### Skip Database Check (debugging)
```bash
docker run -d \
  --name furniture-app \
  --network furniture-network \
  -p 8080:8080 \
  -e SKIP_DB_CHECK=true \
  -e SPRING_DATASOURCE_HOST=furniture-postgres \
  -e SPRING_DATASOURCE_USERNAME=furniture_user \
  -e SPRING_DATASOURCE_PASSWORD=furniture_password \
  furniture:2.0
```

### With Extended Timeout
```bash
docker run -d \
  --name furniture-app \
  --network furniture-network \
  -p 8080:8080 \
  -e SPRING_DATASOURCE_HOST=furniture-postgres \
  -e DB_WAIT_TIMEOUT=120 \
  -e SPRING_DATASOURCE_USERNAME=furniture_user \
  -e SPRING_DATASOURCE_PASSWORD=furniture_password \
  furniture:2.0
```

### Foreground Mode (Debugging)
```bash
docker run -it \
  --name furniture-app \
  --network furniture-network \
  -p 8080:8080 \
  -e SPRING_DATASOURCE_HOST=furniture-postgres \
  -e SPRING_DATASOURCE_USERNAME=furniture_user \
  -e SPRING_DATASOURCE_PASSWORD=furniture_password \
  furniture:2.0
```

### With Restart Policy
```bash
docker run -d \
  --restart=always \
  --name furniture-app \
  --network furniture-network \
  -p 8080:8080 \
  -e SPRING_DATASOURCE_HOST=furniture-postgres \
  -e SPRING_DATASOURCE_USERNAME=furniture_user \
  -e SPRING_DATASOURCE_PASSWORD=furniture_password \
  furniture:2.0
```

### With Log Driver
```bash
docker run -d \
  --log-driver=json-file \
  --log-opt max-size=10m \
  --log-opt max-file=3 \
  --name furniture-app \
  --network furniture-network \
  -p 8080:8080 \
  -e SPRING_DATASOURCE_HOST=furniture-postgres \
  -e SPRING_DATASOURCE_USERNAME=furniture_user \
  -e SPRING_DATASOURCE_PASSWORD=furniture_password \
  furniture:2.0
```

### Full Production Setup
```bash
docker run -d \
  --name furniture-app \
  --network furniture-network \
  -p 8080:8080 \
  -m 2g \
  --memory-swap 2g \
  -e SPRING_DATASOURCE_HOST=furniture-postgres \
  -e SPRING_DATASOURCE_PORT=5432 \
  -e SPRING_DATASOURCE_DATABASE=furniture \
  -e SPRING_DATASOURCE_USERNAME=furniture_user \
  -e SPRING_DATASOURCE_PASSWORD=furniture_password \
  -e DB_WAIT_TIMEOUT=60 \
  -e JAVA_OPTS="-XX:MaxRAMPercentage=75.0 -XX:InitialRAMPercentage=25.0 -XX:+UseG1GC" \
  --restart=unless-stopped \
  --log-driver=json-file \
  --log-opt max-size=10m \
  --log-opt max-file=3 \
  furniture:2.0
```

---

## 🔍 Monitoring & Debugging Commands

### View Logs
```bash
# All logs
docker logs furniture-app

# Follow logs (tail -f)
docker logs -f furniture-app

# Last 50 lines
docker logs --tail 50 furniture-app

# With timestamps
docker logs -t furniture-app

# Since specific time
docker logs --since 2026-02-27T12:00:00 furniture-app
```

### Check Container Status
```bash
# Process info
docker top furniture-app

# Full container details
docker inspect furniture-app

# Health status
docker inspect --format='{{.State.Health.Status}}' furniture-app

# IP address
docker inspect --format='{{.NetworkSettings.IPAddress}}' furniture-app

# Container stats
docker stats furniture-app
docker stats --no-stream furniture-app
```

### Test Connectivity
```bash
# From host
curl http://localhost:8080/api/categories

# From within container
docker exec furniture-app curl http://localhost:8080/api/categories

# Test database from container
docker exec furniture-app nc -zv furniture-postgres 5432

# Test with psql
docker exec furniture-postgres psql -U furniture_user -d furniture -c "SELECT 1;"
```

### Execute Commands
```bash
# Interactive bash
docker exec -it furniture-app /bin/bash

# Check Java version
docker exec furniture-app java -version

# Check environment
docker exec furniture-app env | grep SPRING

# Run curl command
docker exec furniture-app curl -i http://localhost:8080/api/categories
```

---

## 🛑 Container Management

### Stop Container
```bash
# Graceful stop (SIGTERM)
docker stop furniture-app

# Immediate kill (SIGKILL)
docker kill furniture-app

# Stop all
docker stop $(docker ps -aq)
```

### Remove Container
```bash
# Remove single
docker rm furniture-app

# Force remove (if running)
docker rm -f furniture-app

# Remove all
docker rm $(docker ps -aq)
```

### Restart Container
```bash
# Restart
docker restart furniture-app

# Restart all
docker restart $(docker ps -aq)
```

---

## 🌐 Network Management

### Create Network
```bash
docker network create furniture-network
```

### List Networks
```bash
docker network ls
docker network inspect furniture-network
```

### Connect Container to Network
```bash
docker network connect furniture-network furniture-app
```

### Disconnect Container from Network
```bash
docker network disconnect furniture-network furniture-app
```

### Remove Network
```bash
docker network rm furniture-network
```

---

## 📦 Image Management

### Build
```bash
docker build -t furniture:2.0 .
```

### List Images
```bash
docker images | grep furniture
docker images -q furniture
```

### Tag Image
```bash
docker tag furniture:2.0 myregistry/furniture:2.0
```

### Push to Registry
```bash
docker push myregistry/furniture:2.0
```

### Remove Image
```bash
docker rmi furniture:2.0
docker rmi -f furniture:2.0  # Force remove
```

### View Image History
```bash
docker history furniture:2.0
```

---

## 💾 Volume Management

### Create Volume
```bash
docker volume create postgres_data
```

### List Volumes
```bash
docker volume ls
docker volume inspect postgres_data
```

### Remove Volume
```bash
docker volume rm postgres_data

# Remove unused volumes
docker volume prune
```

---

## 🧹 Cleanup Commands

### Remove Stopped Containers
```bash
docker container prune
```

### Remove Unused Images
```bash
docker image prune
```

### Remove Unused Volumes
```bash
docker volume prune
```

### Complete Cleanup
```bash
docker system prune
docker system prune -a  # Also removes unused images
```

---

## 📊 Environment Variables Quick Reference

| Variable | Example Value |
|----------|---------------|
| SPRING_DATASOURCE_HOST | furniture-postgres |
| SPRING_DATASOURCE_PORT | 5432 |
| SPRING_DATASOURCE_DATABASE | furniture |
| SPRING_DATASOURCE_USERNAME | furniture_user |
| SPRING_DATASOURCE_PASSWORD | furniture_password |
| DB_WAIT_TIMEOUT | 60 |
| SKIP_DB_CHECK | false |
| JAVA_OPTS | -XX:MaxRAMPercentage=75.0 |

---

## 🎯 Common Scenarios

### Scenario 1: Local Development
```bash
# Start PostgreSQL
docker run -d --name furniture-postgres \
  --network furniture-network \
  -e POSTGRES_USER=furniture_user \
  -e POSTGRES_PASSWORD=furniture_password \
  postgres:15-alpine

# Start App
docker run -it --network furniture-network \
  -p 8080:8080 \
  -e SPRING_DATASOURCE_HOST=furniture-postgres \
  furniture:2.0
```

### Scenario 2: Production
```bash
# With all safeguards
docker run -d \
  --name furniture-app \
  --network furniture-network \
  -p 8080:8080 \
  -m 2g \
  --restart=unless-stopped \
  --log-opt max-size=10m \
  -e SPRING_DATASOURCE_HOST=furniture-postgres \
  -e DB_WAIT_TIMEOUT=60 \
  furniture:2.0
```

### Scenario 3: Staging/Testing
```bash
# Similar to production but with relaxed limits
docker run -d \
  --name furniture-app \
  --network furniture-network \
  -p 8080:8080 \
  -m 1.5g \
  -e SPRING_DATASOURCE_HOST=furniture-postgres \
  furniture:2.0
```

---

**Last Updated:** February 27, 2026  
**Status:** ✅ Complete Reference

