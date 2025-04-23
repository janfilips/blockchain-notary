#!/bin/sh
python3 -m venv .venv
source .venv/bin/activate
python3 -m pip install -r requirements.txt
python3 manage.py migrate --run-syncdb
python3 manage.py runserver 0.0.0.0:8001
