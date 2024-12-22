#!/bin/bash

echo "Please confirm Docker installed on your system!"

docker pull mariadb

echo "Input mariadb root user' password"

read mariadb_pw

docker run -p 3306:3306 --name mariadb -e MARIADB_ROOT_PASSWORD=$mariadb_pw -d mariadb

sleep 3