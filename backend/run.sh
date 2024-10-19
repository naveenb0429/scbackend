#!/usr/bin/env bash

# source ~/.bashrc
# source .venv/bin/activate
# cd /scwebsite/scbackend-Dev/
# source venv/bin/activate

# cd webdev/scwebsitedev/backend/
# source venv/bin/activate


set -a
if [ "$1" = "dev" ]; then
    source dev.env
else
    source prod.env
fi
set +a

if [ "$2" = "setup" ]; then
    python manage.py createsuperuser
else
    python manage.py makemigrations
    python manage.py migrate
    # python manage.py runserver 
    python manage.py runserver 0.0.0.0:8000
fi