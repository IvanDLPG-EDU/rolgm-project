include .env
up:
	docker compose up
start:
	docker compose up -d
init:
	docker compose up --build

down:
	docker compose down
migrate:
	docker exec -it ${PROJECT_NAME}-server python manage.py makemigrations
	docker exec -it ${PROJECT_NAME}-server python manage.py migrate

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
