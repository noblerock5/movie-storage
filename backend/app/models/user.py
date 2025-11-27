"""User model."""

from sqlalchemy import Boolean, Column, Integer, String, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel


class User(BaseModel):
    """User model for authentication and user management."""

    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    username: Mapped[str] = mapped_column(
        String(50), unique=True, index=True, nullable=False, comment="用户名"
    )
    email: Mapped[str] = mapped_column(
        String(100), unique=True, index=True, nullable=False, comment="邮箱"
    )
    hashed_password: Mapped[str] = mapped_column(
        String(255), nullable=False, comment="密码哈希"
    )
    is_active: Mapped[bool] = mapped_column(
        Boolean, default=True, nullable=False, comment="是否激活"
    )
    is_superuser: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False, comment="是否超级用户"
    )

    # Relationships
    movies: Mapped[list["Movie"]] = relationship(
        "Movie", back_populates="owner", cascade="all, delete-orphan"
    )
    favorites: Mapped[list["Favorite"]] = relationship(
        "Favorite", back_populates="user", cascade="all, delete-orphan"
    )

    @classmethod
    async def get_by_email(cls, db: AsyncSession, email: str):
        """Get user by email."""
        result = await db.execute(select(cls).where(cls.email == email))
        return result.scalar_one_or_none()

    @classmethod
    async def create(cls, db: AsyncSession, **kwargs):
        """Create new user."""
        user = cls(**kwargs)
        db.add(user)
        await db.commit()
        await db.refresh(user)
        return user

    async def delete(self, db: AsyncSession):
        """Delete user."""
        await db.delete(self)
        await db.commit()
