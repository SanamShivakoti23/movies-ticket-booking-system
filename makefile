# CONTAINERS
APP_CONTAINER = ticket_booking_app
DB_CONTAINER = ticket_booking_db

# COMPOSE FILES
COMPOSE_DEV = docker-compose -f docker-compose.yml -f docker-compose.dev.yml
COMPOSE_PROD = docker-compose -f docker-compose.yml -f docker-compose.prod.yml

# DEVELOPMENT COMMANDS
dev:
	$(COMPOSE_DEV) up -d --build

dev-down:
	$(COMPOSE_DEV) down

dev-restart:
	$(COMPOSE_DEV) down && $(COMPOSE_DEV) up -d --build

dev-logs:
	$(COMPOSE_DEV) logs -f


# PRODUCTION COMMANDS
prod:
	$(COMPOSE_PROD) up -d --build

prod-down:
	$(COMPOSE_PROD) down

prod-restart:
	$(COMPOSE_PROD) down && $(COMPOSE_PROD) up -d --build

prod-logs:
	$(COMPOSE_PROD) logs -f


# DATABASE COMMANDS (COMMON)
db-push:
	docker exec -it $(APP_CONTAINER) bun run db:push

db-generate:
	docker exec -it $(APP_CONTAINER) bun run db:generate

db-migrate:
	docker exec -it $(APP_CONTAINER) bun run db:migrate

db-seed:
	docker exec -it $(APP_CONTAINER) bun run seed

# FULL SETUP
setup-dev: dev db-push db-seed

setup-prod: prod db-push db-seed

# CLEAN / RESET
reset:
	docker-compose down -v

reset-dev:
	$(COMPOSE_DEV) down -v
	$(COMPOSE_DEV) up -d --build

reset-prod:
	$(COMPOSE_PROD) down -v
	$(COMPOSE_PROD) up -d --build