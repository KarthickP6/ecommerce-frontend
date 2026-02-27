#!/bin/sh
# Entrypoint script for Spring Boot application
# Handles database readiness and signal forwarding

set -e

# Configuration
DB_HOST="${SPRING_DATASOURCE_HOST:-localhost}"
DB_PORT="${SPRING_DATASOURCE_PORT:-5432}"
DB_NAME="${SPRING_DATASOURCE_DATABASE:-furniture}"
DB_USER="${SPRING_DATASOURCE_USERNAME:-furniture_user}"
DB_PASSWORD="${SPRING_DATASOURCE_PASSWORD:-furniture_password}"

# Timeout for database checks (in seconds)
DB_WAIT_TIMEOUT="${DB_WAIT_TIMEOUT:-60}"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Logger function
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') [ENTRYPOINT] $1"
}

# Error logger function
log_error() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') [ENTRYPOINT] ${RED}ERROR: $1${NC}" >&2
}

# Success logger function
log_success() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') [ENTRYPOINT] ${GREEN}$1${NC}"
}

# Warning logger function
log_warn() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') [ENTRYPOINT] ${YELLOW}WARN: $1${NC}"
}

# Wait for PostgreSQL to be ready
wait_for_postgres() {
    local elapsed=0
    local interval=2

    log "Waiting for PostgreSQL at ${DB_HOST}:${DB_PORT}..."

    while [ $elapsed -lt "$DB_WAIT_TIMEOUT" ]; do
        if nc -z "$DB_HOST" "$DB_PORT" 2>/dev/null; then
            log_success "PostgreSQL port is open"

            # Additional check: try to connect with psql if available
            if command -v psql &> /dev/null; then
                if PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1" &>/dev/null; then
                    log_success "PostgreSQL is ready and accepting connections"
                    return 0
                fi
            else
                # If psql is not available, assume port being open is sufficient
                return 0
            fi
        fi

        elapsed=$((elapsed + interval))
        log "PostgreSQL not ready yet... Retrying in ${interval}s (${elapsed}s/${DB_WAIT_TIMEOUT}s)"
        sleep "$interval"
    done

    log_error "PostgreSQL failed to become ready after ${DB_WAIT_TIMEOUT}s"
    return 1
}

# Trap signals for graceful shutdown
trap_handler() {
    log "Received SIGTERM/SIGINT, forwarding to Java process..."
    kill -TERM "$JAVA_PID" 2>/dev/null || true
}

trap trap_handler SIGTERM SIGINT

# Main execution
main() {
    log "Starting Spring Boot application startup sequence..."
    log "Application: Furniture E-Commerce"
    log "Java Options: $JAVA_OPTS"
    log "Database Host: $DB_HOST:$DB_PORT"
    log "Database Name: $DB_NAME"

    # Check if we should skip database checks
    if [ "$SKIP_DB_CHECK" = "true" ]; then
        log_warn "Skipping database readiness check (SKIP_DB_CHECK=true)"
    else
        # Wait for database to be ready
        if ! wait_for_postgres; then
            log_error "Failed to connect to PostgreSQL. Exiting."
            exit 1
        fi
    fi

    log_success "All prerequisites met. Starting application..."
    log "PID 1 will be Java process (for proper signal handling)"

    # Execute Java application with proper PID 1 handling
    # Using 'exec' ensures Java process replaces the shell process (PID 1)
    # This allows proper signal forwarding (SIGTERM, SIGINT, etc.)
    exec java ${JAVA_OPTS} -jar app.jar &
    JAVA_PID=$!

    # Wait for Java process to complete
    wait $JAVA_PID
    EXIT_CODE=$?

    if [ $EXIT_CODE -eq 0 ]; then
        log_success "Application exited successfully"
    else
        log_error "Application exited with code $EXIT_CODE"
    fi

    exit $EXIT_CODE
}

# Run main function
main "$@"

