#!/usr/bin/env bash
# Install python dependencies
pip install -r requirements.txt

# Collect static files
python manage.py collectstatic --noinput

# Make sure media folder exists
mkdir -p media