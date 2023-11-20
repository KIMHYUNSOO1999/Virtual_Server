FROM mariadb:latest

WORKDIR /docker-entrypoint-initdb.d/

RUN chmod 755 -R /docker-entrypoint-initdb.d/
COPY init.sql /docker-entrypoint-initdb.d/

EXPOSE 3306