#!/bin/bash

export MARIADB_USER=$MARIADB_USER
export MARIADB_PASSWORD=$MARIADB_PASSWORD
export MARIADB_DATABASE=$MARIADB_DATABASE
export MARIADB_DATABASE=$MARIADB_DATABASE
export MARIADB_ROOT_PASSWORD=$MARIADB_ROOT_PASSWORD

envsubst < init.sql > init_temp.sql

mariadb -u root -p$MARIADB_ROOT_PASSWORD < init_temp.sql

rm init_temp.sql
