.PHONY: setup check dev build lint db-up db-down

setup:
	bash scripts/setup.sh

check:
	bash scripts/check-env.sh

dev:
	cd frontend && npm run dev

build:
	cd frontend && npm run build

lint:
	cd frontend && npm run lint

db-up:
	cd backend && docker compose up -d mongo

db-down:
	cd backend && docker compose down
