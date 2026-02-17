FROM php:8.2-apache

RUN apt-get update && apt-get install -y \
  libzip-dev \
  zip \
  unzip \
  sqlite3 \
  sqlitebrowser \
  && docker-php-ext-install zip \
  && rm -rf /var/lib/apt/lists/*



