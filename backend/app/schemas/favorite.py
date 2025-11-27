"""Favorite schemas."""

from typing import Any

from pydantic import Field

from app.schemas.base import BaseSchema, TimestampedSchema


class FavoriteBase(BaseSchema):
    """Base favorite schema."""

    movie_id: int = Field(..., gt=0)


class FavoriteCreate(FavoriteBase):
    """Favorite creation schema."""

    pass


class Favorite(FavoriteBase, TimestampedSchema):
    """Favorite response schema."""

    id: int
    user_id: int


class FavoriteResponse(BaseSchema):
    """Favorite response with movie details."""

    id: int
    movie_id: int
    created_at: Any  # Will be populated with movie data
    movie: dict | None = None


class FavoriteListResponse(BaseSchema):
    """Favorite list response schema."""

    favorites: list[FavoriteResponse]
    total: int
    page: int
    limit: int
