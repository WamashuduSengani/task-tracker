#!/bin/bash
# This script cleans up Docker artifacts and builds the Spring Boot JAR before running docker-compose

set -e


# Detect Docker Compose version and recommend upgrade if v1 is found
if command -v docker-compose &> /dev/null; then
	VERSION=$(docker-compose --version 2>/dev/null | grep -oE '[0-9]+\.[0-9]+')
	if [[ "$VERSION" == "1."* ]]; then
		echo "\n[ERROR] Docker Compose v1 detected. Please upgrade to v2 for reliability!"
		echo "Run: sudo apt-get remove docker-compose && sudo apt-get update && sudo apt-get install docker-compose-plugin"
		exit 1
	fi
fi

# Remove stopped containers, unused networks, dangling images, and build cache
echo "Cleaning up Docker system..."
docker compose down --volumes --remove-orphans || true
docker system prune -af || true

echo "Cleaning up old target directory..."
rm -rf target || true

# Build the Spring Boot JAR
echo "Building Spring Boot application..."
./mvnw clean package

# Run docker compose build and up
echo "Starting docker compose..."
docker compose up --build
