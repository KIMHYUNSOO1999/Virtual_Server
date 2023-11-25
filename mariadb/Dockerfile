FROM mariadb:latest

WORKDIR /docker-entrypoint-initdb.d/

RUN apt-get update && apt-get install -y gettext

RUN chmod 755 -R /docker-entrypoint-initdb.d/
COPY init.sql /docker-entrypoint-initdb.d/
COPY sql.sh /docker-entrypoint-initdb.d/

EXPOSE 3306