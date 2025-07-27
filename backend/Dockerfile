FROM python:3.12.7-slim

WORKDIR /backend


COPY ./requirements.txt /backend/requirements.txt

RUN pip install --no-cache-dir -r /backend/requirements.txt

# Copy application code
COPY ./app /backend/app

WORKDIR /backend/app

EXPOSE 8000


# Run the application with dynamic port from Render
CMD ["uvicorn","main:app","--host","0.0.0.0", "--port","8000"]