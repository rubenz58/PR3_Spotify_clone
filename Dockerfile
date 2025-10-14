# Stage 1: Build the React frontend
FROM node:18 AS frontend-build

WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./

# Install frontend dependencies
RUN npm install

# Copy all frontend source code
COPY frontend/ ./

# Build the React app (creates build/ folder)
RUN npm run build

# Stage 2: Build the Python backend
FROM python:3.9-slim

# Set working directory inside container
WORKDIR /app

# Copy Python requirements from backend folder
COPY backend/Pipfile backend/Pipfile.lock ./

# Install pipenv and Python dependencies
RUN pip install pipenv && \
    pipenv install --system --deploy

# Copy the backend application code
COPY backend/ .

# Copy the built frontend from the frontend-build stage
COPY --from=frontend-build /app/frontend/build ./build

# Set environment variables
ENV FLASK_APP=app.py
ENV FLASK_ENV=production

# Railway uses port 8080
EXPOSE 8080

# Command to run the application
# CMD ["python", "app.py"]
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "--workers", "4", "app:app"]