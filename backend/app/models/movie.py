"""Movie model."""

from sqlalchemy import (
    Boolean,
    Column,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
    select,
)
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel


class Movie(BaseModel):
    """Movie model for storing movie information."""

    __tablename__ = "movies"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(
        String(200), index=True, nullable=False, comment="电影标题"
    )
    description: Mapped[str] = mapped_column(Text, nullable=True, comment="电影描述")
    poster_url: Mapped[str] = mapped_column(String(500), nullable=True, comment="海报URL")
    rating: Mapped[float] = mapped_column(Float, nullable=True, comment="评分")
    year: Mapped[int] = mapped_column(Integer, nullable=True, comment="年份")
    genre: Mapped[str] = mapped_column(String(100), nullable=True, comment="类型")
    duration: Mapped[int] = mapped_column(Integer, nullable=True, comment="时长(分钟)")
    file_path: Mapped[str] = mapped_column(String(500), nullable=True, comment="文件路径")
    stream_url: Mapped[str] = mapped_column(
        String(500), nullable=True, comment="流媒体URL"
    )
    is_local: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False, comment="是否本地文件"
    )
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id"), nullable=True, comment="上传用户ID"
    )

    # Relationships
    owner: Mapped["User"] = relationship("User", back_populates="movies")
    favorites: Mapped[list["Favorite"]] = relationship(
        "Favorite", back_populates="movie", cascade="all, delete-orphan"
    )

    @classmethod
    async def get_by_id(cls, db: AsyncSession, movie_id: int):
        """Get movie by ID."""
        result = await db.execute(select(cls).where(cls.id == movie_id))
        return result.scalar_one_or_none()

    @classmethod
    async def search(cls, db: AsyncSession, query: str, page: int = 1, limit: int = 20):
        """Search movies by title or description."""
        offset = (page - 1) * limit

        # Build search query
        search_filter = (
            cls.title.ilike(f"%{query}%")
            | cls.description.ilike(f"%{query}%")
            | cls.genre.ilike(f"%{query}%")
        )

        # Get total count
        count_result = await db.execute(select(func.count(cls.id)).where(search_filter))
        total = count_result.scalar()

        # Get movies with pagination
        result = await db.execute(
            select(cls)
            .where(search_filter)
            .offset(offset)
            .limit(limit)
            .order_by(cls.created_at.desc())
        )
        movies = result.scalars().all()

        return list(movies), total

    @classmethod
    async def get_list(cls, db: AsyncSession, page: int = 1, limit: int = 20):
        """Get movie list with pagination."""
        offset = (page - 1) * limit

        # Get total count
        count_result = await db.execute(select(func.count(cls.id)))
        total = count_result.scalar()

        # Get movies with pagination
        result = await db.execute(
            select(cls).offset(offset).limit(limit).order_by(cls.created_at.desc())
        )
        movies = result.scalars().all()

        return list(movies), total

    @classmethod
    async def create(cls, db: AsyncSession, **kwargs):
        """Create new movie."""
        movie = cls(**kwargs)
        db.add(movie)
        await db.commit()
        await db.refresh(movie)
        return movie
