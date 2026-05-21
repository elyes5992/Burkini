FROM php:8.2-fpm

# Install dependencies
RUN apt-get update && apt-get install -y \
    nodejs npm nginx postgresql-client \
    libpq-dev zip unzip git curl

RUN docker-php-ext-install pdo pdo_pgsql

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . .

RUN composer install --no-dev --optimize-autoloader
RUN npm install && npm run build

COPY docker/nginx.conf /etc/nginx/nginx.conf

RUN chown -R www-data:storage bootstrap/cache

EXPOSE 80
CMD ["sh", "-c", "php-fpm -D && nginx -g 'daemon off;'"]