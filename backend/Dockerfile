FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8080
<<<<<<< HEAD
CMD ["python", "main.py"]
=======
CMD ["python", "app.py"]
>>>>>>> 64c659ba82e2af14fdb6313682453ac4bebe5633
