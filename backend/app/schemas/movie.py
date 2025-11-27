"""Movie schemas."""

from typing import Any

from pydantic import Field

from app.schemas.base import BaseSchema, TimestampedSchema


class MovieBase(BaseSchema):
    """Base movie schema."""

    title: str = Field(..., min_length=1, max_length=200)
    description: str | None = Field(None, max_length=1000)
    poster_url: str | None = Field(None, max_length=500)
    rating: float | None = Field(None, ge=0, le=10)
    year: int | None = Field(None, ge=1900, le=2100)
    genre: str | None = Field(None, max_length=100)
    duration: int | None = Field(None, ge=0)
    stream_url: str | None = Field(None, max_length=500)


class MovieCreate(MovieBase):
    """Movie creation schema."""

    pass


class MovieUpdate(BaseSchema):
    """Movie update schema."""

    title: str | None = Field(None, min_length=1, max_length=200)
    description: str | None = Field(None, max_length=1000)
    poster_url: str | None = Field(None, max_length=500)
    rating: float | None = Field(None, ge=0, le=10)
    year: int | None = Field(None, ge=1900, le=2100)
    genre: str | None = Field(None, max_length=100)
    duration: int | None = Field(None, ge=0)
    stream_url: str | None = Field(None, max_length=500)


class Movie(MovieBase, TimestampedSchema):
    """Movie response schema."""

    id: int
    is_local: bool
    user_id: int | None = None
    file_path: str | None = None


class MovieResponse(Movie):
    """Movie response alias."""

    pass


class MovieSearch(BaseSchema):
    """Movie search parameters."""

    query: str = Field(..., min_length=1)
    page: int = Field(1, ge=1)
    limit: int = Field(20, ge=1, le=100)
    genre: str | None = None
    year: int | None = None
    min_rating: float | None = Field(None, ge=0, le=10)


class SearchResult(BaseSchema):
    """Search result item schema."""

    title: str
    poster_url: str | None = None
    rating: float | None = None
    year: int | None = None
    genre: str | None = None
    duration: int | None = None
    description: str | None = None
    stream_url: str | None = None
    source: str  # 数据来源


class MovieSearchResponse(BaseSchema):
    """Movie search response schema."""

    results: list[SearchResult]
    total: int
    page: int
    query: str
    has_next: bool
    has_prev: bool


class MovieList(BaseSchema):
    """Movie list response schema."""

    movies: list[MovieResponse]
    total: int
    page: int
    limit: int
