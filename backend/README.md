# Movie Storage API

A modern FastAPI application for movie storage and streaming, built with Python 3.12 and following best practices.

## Features

- **Authentication**: JWT-based user authentication and authorization
- **Movie Management**: CRUD operations for movies with metadata
- **Search**: Multi-source movie search (local database, external APIs)
- **Favorites**: User favorite movies management
- **Screen Casting**: Device discovery and casting functionality
- **File Upload**: Support for local movie file uploads
- **Caching**: Redis-based caching for improved performance
- **Async Support**: Full async/await support throughout the application

## Tech Stack

- **Framework**: FastAPI 0.104+
- **Python**: 3.12+
- **Database**: PostgreSQL with SQLAlchemy 2.0 (async)
- **Authentication**: JWT with bcrypt password hashing
- **Caching**: Redis
- **Validation**: Pydantic v2
- **Testing**: Pytest with async support
- **Type Checking**: MyPy
- **Code Formatting**: Black, isort
- **Containerization**: Docker

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── deps.py          # Dependencies
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── api.py       # API router
│   │       ├── auth.py      # Auth routes
│   │       ├── movies.py    # Movie routes
│   │       ├── favorites.py # Favorite routes
│   │       └── cast.py      # Casting routes
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py        # Configuration
│   │   ├── database.py      # Database setup
│   │   ├── redis.py         # Redis client
│   │   └── security.py      # Security utilities
│   ├── models/
│   │   ├── __init__.py
│   │   ├── base.py          # Base model
│   │   ├── user.py          # User model
│   │   ├── movie.py         # Movie model
│   │   └── favorite.py      # Favorite model
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── base.py          # Base schemas
│   │   ├── auth.py          # Auth schemas
│   │   ├── user.py          # User schemas
│   │   ├── movie.py         # Movie schemas
│   │   └── favorite.py      # Favorite schemas
│   ├── services/
│   │   ├── __init__.py
│   │   ├── search_service.py    # Movie search
│   │   └── cast_service.py      # Screen casting
│   └── main.py              # FastAPI app
├── migrations/              # Alembic migrations
├── tests/                   # Test suite
├── requirements.txt         # Dependencies
├── pyproject.toml          # Project config
├── Dockerfile              # Docker setup
├── .env.example            # Environment template
└── README.md               # This file
```

## Installation

### Prerequisites

- Python 3.12+
- PostgreSQL
- Redis (optional, for caching)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd movie-storage/backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Run database migrations**
   ```bash
   alembic upgrade head
   ```

6. **Start the application**
   ```bash
   uvicorn app.main:app --reload
   ```

### Docker Development

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

## API Documentation

Once the application is running, you can access:

- **Interactive API docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## Development

### Code Quality

The project uses several tools to maintain code quality:

```bash
# Type checking
mypy app/

# Code formatting
black app/ tests/

# Import sorting
isort app/ tests/

# Linting
flake8 app/ tests/
```

### Testing

Run the test suite:

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_auth.py
```

### Database Migrations

Create new migrations:

```bash
alembic revision --autogenerate -m "Description of changes"
```

Apply migrations:

```bash
alembic upgrade head
```

## Configuration

The application uses Pydantic Settings for configuration. Key settings include:

- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: JWT secret key
- `REDIS_HOST/PORT/PASSWORD`: Redis connection settings
- `ALLOWED_ORIGINS`: CORS allowed origins

See `.env.example` for all available settings.

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user info

### Movies
- `GET /api/v1/movies/` - List movies
- `POST /api/v1/movies/` - Create movie
- `GET /api/v1/movies/{id}` - Get movie by ID
- `PUT /api/v1/movies/{id}` - Update movie
- `DELETE /api/v1/movies/{id}` - Delete movie
- `GET /api/v1/movies/search` - Search movies
- `POST /api/v1/movies/upload` - Upload movie file

### Favorites
- `GET /api/v1/favorites/` - Get user favorites
- `POST /api/v1/favorites/{movie_id}` - Add to favorites
- `DELETE /api/v1/favorites/{movie_id}` - Remove from favorites

### Casting
- `GET /api/v1/cast/devices` - Discover casting devices
- `GET /api/v1/cast/movie/{movie_id}` - Get cast info
- `POST /api/v1/cast/start` - Start casting
- `POST /api/v1/cast/stop/{cast_id}` - Stop casting

## License

This project is licensed under the MIT License.