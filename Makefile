include .env

up:
	docker compose up
start:
	docker compose up -d
init:
	docker compose up --build -d
	docker exec -it ${PROJECT_NAME}-server python manage.py makemigrations
	docker exec -it ${PROJECT_NAME}-server python manage.py migrate authentication_core
	docker exec -it ${PROJECT_NAME}-server python manage.py migrate
	docker exec -it ${PROJECT_NAME}-server python manage.py collectstatic
	docker exec -it ${PROJECT_NAME}-server python manage.py createsuperuser
	docker exec -it ${PROJECT_NAME}-server python insert_data.py
down:
	docker compose down
migrate:
	docker exec -it ${PROJECT_NAME}-server python manage.py makemigrations
	docker exec -it ${PROJECT_NAME}-server python manage.py migrate authentication_core
	docker exec -it ${PROJECT_NAME}-server python manage.py migrate
	docker exec -it ${PROJECT_NAME}-server python manage.py graph_models core --arrow-shape=vee -t django2018 -o models.png

static:
	docker exec -it ${PROJECT_NAME}-server python manage.py collectstatic
	
superuser:
	docker exec -it ${PROJECT_NAME}-server python manage.py createsuperuser

bash-client:
	docker exec -it ${PROJECT_NAME}-client /bin/bash
bash-server:
	docker exec -it ${PROJECT_NAME}-server /bin/bash
bash-database:
	docker exec -it ${PROJECT_NAME}-database /bin/bash

testDb:
	docker exec -it ${PROJECT_NAME}-server python insert_data.py