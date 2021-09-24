#!/bin/bash

if [ $1 == "migrate" ]
then
echo "Migrating"
docker-compose run api sh -c "python manage.py makemigrations && python manage.py migrate"
elif [ $1 == "test" ]
then
echo "Testing"
if [ $2 == "" ]
then
docker-compose run api sh -c "python manage.py test && flake8"
else
docker-compose run api sh -c "python manage.py test $2 && flake8"
fi
elif [ $1 == "startapp" ]
then
echo "Creating new app"
docker-compose run api sh -c "python manage.py startapp $2"
elif [ $1 == "shell" ]
then
docker-compose run api sh -c "python manage.py shell"
elif [ $1 == "debug" ]
then
docker-compose -f docker-compose.debug.yml up
else
echo "Initiating..."
docker-compose run api sh -c "$1"
fi
