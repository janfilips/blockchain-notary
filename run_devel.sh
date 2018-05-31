#!/bin/sh
gunicorn notary.wsgi:application --bind 0.0.0.0:8000
