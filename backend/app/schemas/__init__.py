"""Pydantic schemas for request/response models."""

from app.schemas.auth import LoginRequest, Token
from app.schemas.favorite import Favorite, FavoriteCreate, FavoriteResponse
from app.schemas.movie import (
    Movie,
    MovieCreate,
    MovieResponse,
    MovieSearch,
    SearchResult,
)
from app.schemas.user import User, UserCreate, UserInDB, UserResponse

__all__ = [
    "User",
    "UserCreate",
    "UserInDB",
    "UserResponse",
    "Movie",
    "MovieCreate",
    "MovieResponse",
    "MovieSearch",
    "SearchResult",
    "Favorite",
    "FavoriteCreate",
    "FavoriteResponse",
    "LoginRequest",
    "Token",
]
