.PHONY: up down build test lint
build:
	docker compose up --build
up:
	docker compose up
down:
	docker compose down
test:
	docker compose run --rm form-dashboard npm test
lint:
	docker compose run --rm form-dashboard npm run lint
app:
	docker compose up app
build-app:
	docker compose up --build app
watch:
	docker compose up --watch
analyzer:
	docker compose up analyzer --build
watch-analyzer:
	docker compose up --watch analyzer
build-watch:
	docker compose up --build --watch