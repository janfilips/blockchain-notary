#!/bin/sh
#gunicorn notary.wsgi:application --bind 0.0.0.0:8000
python3 manage.py runserver 0.0.0.0:8000

