.DEFAULT_GOAL := help
SHELL := /bin/bash

ifndef UID
UID := $(shell id -u)
export UID
endif

ifndef GID
GID := $(shell id -g)
export GID
endif

ifndef ENV_FILE
ENV_FILE := .env
export ENV_FILE
endif

ifndef DEVENV_FILE
DEVENV_FILE := .env.devenv
export DEVENV_FILE
endif

ifndef DATA_PATH
DATA_PATH := ./
export DATA_PATH
endif

ifndef DEVENV_PROJECT_NAME
DEVENV_PROJECT_NAME := multi-channel-forum
export DEVENV_PROJECT_NAME
endif

_DATAENV := docker compose --env-file $$ENV_FILE -p $$DEVENV_PROJECT_NAME -f docker-compose.yaml -f docker-compose.dataenv.yaml
_DEVENV := docker compose --env-file $$ENV_FILE -p $$DEVENV_PROJECT_NAME -f docker-compose.devenv.yaml

OS_NAME := $(shell uname -s | tr A-Z a-z)
ifeq ($(OS_NAME), darwin)
    # macOS don't set user for some priviliges problem
	RUNNER := $(_DEVENV) run --rm
else
    # Not found
	RUNNER := $(_DEVENV) run --rm --user $$UID:$$GID
endif



.PHONY: devenv-up
devenv-up:
	$(_DEVENV) up -d

.PHONY: devenv-down
devenv-down: ## debug all devenv services with docker compose up -d
	$(_DEVENV) down -v --remove-orphans

devenv-logs: ## follow all devenv services logs
	$(_DEVENV) logs -f
devenv-ps:
	$(_DEVENV) ps

.PHONY: devenv-backend-server
devenv-backend-server:
	$(RUNNER) backend-server sh -c "npm start"

run-local-backend-server:
	source scripts/export-env.sh $$ENV_FILE;\
	source scripts/export-env.sh $$DEVENV_FILE;\
	npm start

DATAENV_SERVICES := mysql redis

.PHONY: dataenv-up
dataenv-up: _dataenv-volumes
	$(_DATAENV) up -d $(DATAENV_SERVICES)

_dataenv-volumes: ## create data folder with current user permissions
	mkdir -p $$DATA_PATH/.data/mysql \
		$$DATA_PATH/.data/redis \

dataenv-down:
	$(_DATAENV) down -v --remove-orphans

dataenv-ps:
	$(_DATAENV) ps

dataenv-logs:
	$(_DATAENV) logs -f