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
