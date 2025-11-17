#!/usr/bin/env bash
set -euo pipefail

cd /var/www/html

# Wait for WP to be reachable
until nc -z db 3306; do sleep 1; done

# Ensure wp-config exists (container provides it)
if ! wp core is-installed --allow-root; then
  echo "Waiting for WordPress tables..."
  sleep 5
fi

# Update URLs everywhere to localhost
wp option update siteurl 'http://localhost:8080' --allow-root || true
wp option update home 'http://localhost:8080' --allow-root || true
wp search-replace 'https://cycemprendimientos.com.ar' 'http://localhost:8080' --all-tables --precise --report-changed-only --allow-root || true

echo "WP CLI init complete."




