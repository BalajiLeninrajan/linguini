#!/bin/bash
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Check for .env file and DATABASE_URL
if [ ! -f ".env" ]; then
  echo "Error: .env file not found. Please create a .env file with DATABASE_URL set in the load-hypernyms-data directory."
  exit 1
fi

# Download hypernyms dataset if not present
if [ ! -f data/hypernyms.csv ]; then
  mkdir -p data
  curl -L -o ./data/hypernyms-wordnet.zip https://www.kaggle.com/api/v1/datasets/download/duketemon/hypernyms-wordnet
  unzip data/hypernyms-wordnet.zip -d data
fi

# Create Python virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
  python3 -m venv venv
fi

# Activate the virtual environment
source venv/bin/activate

# Install dependencies if requirements.txt exists
if [ -f requirements.txt ]; then
  pip install --upgrade pip
  pip install -r requirements.txt
fi

# Run the Python script
python load.py
