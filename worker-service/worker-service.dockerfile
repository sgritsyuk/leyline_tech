FROM python:3.11

WORKDIR /app

COPY src/ /app
COPY requirements.txt /app/
COPY mock_video.mp4 /app/

RUN pip install -r requirements.txt

CMD ["celery", "-A", "main.app", "worker", "-l", "info"]
