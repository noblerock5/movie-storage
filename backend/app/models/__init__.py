"""Database models."""

from app.models.favorite import Favorite
from app.models.movie import Movie
from app.models.user import User

__all__ = ["User", "Movie", "Favorite"]
