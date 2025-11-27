"""Application configuration settings."""

from functools import cached_property
from typing import Any

from pydantic import Field, SecretStr
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings using Pydantic BaseSettings."""

    # Application
    APP_NAME: str = "Movie Storage API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # Database
    DATABASE_URL: str = Field(
        default="postgresql://admin:admin123456@43.143.233.242:5432/dbmovie",
        description="Database connection URL",
    )

    # Security
    SECRET_KEY: SecretStr = Field(
        default="your-secret-key-here", description="JWT secret key"
    )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    EMAIL_RESET_TOKEN_EXPIRE_HOURS: int = 24

    # CORS
    ALLOWED_ORIGINS: list[str] = Field(
        default=["http://localhost:3000"], description="Allowed CORS origins"
    )
    ALLOWED_HOSTS: list[str] = Field(
        default=["http://localhost:3000", "http://127.0.0.1:3000"],
        description="Allowed CORS hosts",
    )

    # Redis
    REDIS_HOST: str = "43.143.233.242"
    REDIS_PORT: int = 6379
    REDIS_PASSWORD: SecretStr = Field(default="admin123456")
    REDIS_DB: int = 0

    # File Storage
    UPLOAD_DIR: str = "uploads"
    STATIC_DIR: str = "static"
    MAX_FILE_SIZE: int = 100 * 1024 * 1024  # 100MB

    # API
    API_V1_STR: str = "/api/v1"

    class Config:
        env_file = ".env"
        case_sensitive = True

    @cached_property
    def redis_url(self) -> str:
        """Get Redis connection URL."""
        return f"redis://:{self.REDIS_PASSWORD.get_secret_value()}@{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}"


settings = Settings()
