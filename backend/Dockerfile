# Use Python base image
FROM python:3.10-slim

# Set work directory
WORKDIR /app

# Copy requirements or Pipfile
COPY . /app/

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt || pip install pipenv && pipenv install --system

# Expose backend port
EXPOSE 8000

# Start backend server
CMD ["python", "app.py"]
