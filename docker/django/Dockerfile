FROM 	python:3.10

LABEL 	"IvanDeLaPoza" "ivandelapozagarcia@gmail.com"

ENV 	PYTHONUNBUFFERED 1
ENV 	PYTHONDONTWRITEBYTECODE 1

EXPOSE 	8000

WORKDIR /usr/src/app

COPY	requirements.txt ./

RUN	apt-get update && \
	apt-get install -y python3-dev libpq-dev graphviz

RUN 	pip install --upgrade pip && \
	pip install --no-cache-dir -r requirements.txt 

#ENTRYPOINT ["python", "manage.py", "runserver","172.18.0.2:8000"]
