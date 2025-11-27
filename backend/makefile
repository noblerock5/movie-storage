.PHONY: help install dev test lint format clean docker-build docker-run

help:
	@echo "Available commands:"
	@echo "  install     - Install dependencies"
	@echo "  dev         - Start development server"
	@echo "  test        - Run tests"
	@echo "  test-cov    - Run tests with coverage"
	@echo "  lint        - Run linting"
	@echo "  format      - Format code"
	@echo "  clean       - Clean cache files"
	@echo "  docker-build - Build Docker image"
	@echo "  docker-run  - Run with Docker"

install:
	pip install -r requirements.txt
	pip install -e .

dev:
	python run.py

test:
	pytest

test-cov:
	pytest --cov=app --cov-report=html --cov-report=term

lint:
	mypy app/
	flake8 app/ tests/
	black --check app/ tests/
	isort --check-only app/ tests/

format:
	black app/ tests/
	isort app/ tests/

clean:
	find . -type d -name "__pycache__" -delete
	find . -type f -name "*.pyc" -delete
	rm -rf .pytest_cache
	rm -rf .mypy_cache
	rm -rf htmlcov
	rm -rf .coverage

docker-build:
	docker build -t movie-storage-api .

docker-run:
	docker run -p 8000:8000 --env-file .env movie-storage-api

migration:
	alembic revision --autogenerate -m "$(MSG)"

migrate:
	alembic upgrade head

migrate-down:
	alembic downgrade -1