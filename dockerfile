FROM php:8.2-apache

# Устанавливаем pdo_mysql для подключения к MySQL
RUN docker-php-ext-install pdo pdo_mysql

# Включаем mod_rewrite
RUN a2enmod rewrite

# Копируем файлы проекта
COPY . /var/www/html/

# Настраиваем права
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/public

# Указываем DocumentRoot на public/
RUN sed -i 's#/var/www/html#/var/www/html/public#g' /etc/apache2/sites-available/000-default.conf

# Разрешаем .htaccess
RUN echo "\
<Directory /var/www/html/public>\n\
    Options Indexes FollowSymLinks\n\
    AllowOverride All\n\
    Require all granted\n\
</Directory>\n" >> /etc/apache2/apache2.conf

EXPOSE 80