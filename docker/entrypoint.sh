#!/bin/sh

# Exit on error
set -e

# Clear any stale bootstrap cache before regenerating
php artisan package:discover --ansi

# Fix storage permissions for mounted volumes
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Clear cache (non-fatal: DB might not be ready yet)
php artisan cache:clear || true

# Wait for database to be ready (if DB_HOST is set)
if [ -n "$DB_HOST" ]; then
  echo "Waiting for database at $DB_HOST..."
  until php artisan db:show > /dev/null 2>&1; do
    echo "  Database not ready, retrying in 2s..."
    sleep 2
  done
  echo "Database is ready."
fi

# Run migrations and seeders
php artisan migrate --force --seed

# Cache config, routes and views
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Start the queue worker in the background
echo "Starting queue worker..."
php artisan queue:work --tries=3 --timeout=90 &

# Start PHP-FPM
exec php-fpm
