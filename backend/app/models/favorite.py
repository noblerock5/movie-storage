"""Favorite model."""

from sqlalchemy import ForeignKey, Integer, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel
from app.models.movie import Movie


class Favorite(BaseModel):
    """Favorite model for user-movie relationships."""

    __tablename__ = "favorites"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id"), nullable=False, comment="用户ID"
    )
    movie_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("movies.id"), nullable=False, comment="电影ID"
    )

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="favorites")
    movie: Mapped["Movie"] = relationship("Movie", back_populates="favorites")

    @classmethod
    async def get_user_favorite(cls, db: AsyncSession, user_id: int, movie_id: int):
        """Get user's favorite for a specific movie."""
        result = await db.execute(
            select(cls).where(cls.user_id == user_id, cls.movie_id == movie_id)
        )
        return result.scalar_one_or_none()

    @classmethod
    async def get_user_movies(cls, db: AsyncSession, user_id: int):
        """Get all movies favorited by a user."""
        result = await db.execute(
            select(Movie)
            .join(cls, Movie.id == cls.movie_id)
            .where(cls.user_id == user_id)
            .order_by(cls.created_at.desc())
        )
        return result.scalars().all()

    @classmethod
    async def create(cls, db: AsyncSession, **kwargs):
        """Create new favorite."""
        favorite = cls(**kwargs)
        db.add(favorite)
        await db.commit()
        await db.refresh(favorite)
        return favorite

    async def delete(self, db: AsyncSession):
        """Delete favorite."""
        await db.delete(self)
        await db.commit()
