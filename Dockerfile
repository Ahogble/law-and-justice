# Stage 1: Build assets with Node.js
FROM node:22-alpine AS build-stage
WORKDIR /app

RUN apk add --no-cache \
    php83 \
    php83-curl \
    php83-mbstring \
    php83-xml \
    php83-simplexml \
    php83-tokenizer \
    php83-dom \
    php83-phar \
    php83-openssl \
    php83-iconv \
    php83-session \
    php83-fileinfo \
    libc6-compat \
    curl

RUN ln -s /usr/bin/php83 /usr/bin/php

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY composer.json composer.lock ./
RUN composer install --no-interaction --no-dev --no-scripts --no-autoloader

COPY package*.json ./
RUN npm ci

COPY . .

RUN composer dump-autoload --no-dev --optimize && \
    npm run build

# Stage 2: PHP Application
FROM php:8.3-fpm-alpine AS php-stage

WORKDIR /var/www/html

RUN apk add --no-cache \
    curl \
    libpng-dev \
    libxml2-dev \
    zip \
    unzip \
    git \
    postgresql-dev \
    oniguruma-dev \
    linux-headers \
    icu-dev \
    libzip-dev

RUN docker-php-ext-install pdo_pgsql mbstring exif pcntl bcmath gd intl zip opcache

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

ARG CACHEBUST=1
COPY . .

COPY --from=build-stage /app/public/build ./public/build

RUN composer install --no-interaction --optimize-autoloader --no-dev

RUN mkdir -p storage/framework/sessions storage/framework/views storage/framework/cache bootstrap/cache && \
    chown -R www-data:www-data /var/www/html && \
    chmod -R 755 /var/www/html && \
    chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

COPY docker/entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 9000

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

# Stage 3: Nginx
FROM nginx:alpine AS nginx-stage

WORKDIR /var/www/html

COPY docker/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
COPY --from=php-stage /var/www/html/public ./public

RUN chown -R nginx:nginx /var/www/html/public && \
    chmod -R 755 /var/www/html/public

EXPOSE 80
