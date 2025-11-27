"""User schemas."""

from typing import Any

from pydantic import EmailStr, Field

from app.schemas.base import BaseSchema, TimestampedSchema


class UserBase(BaseSchema):
    """Base user schema."""

    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr


class UserCreate(UserBase):
    """User creation schema."""

    password: str = Field(..., min_length=8, max_length=128)


class UserUpdate(BaseSchema):
    """User update schema."""

    username: str | None = Field(None, min_length=3, max_length=50)
    email: EmailStr | None = None
    is_active: bool | None = None


class UserInDB(UserBase):
    """User schema as stored in database."""

    id: int
    hashed_password: str
    is_active: bool
    is_superuser: bool


class User(UserInDB):
    """User response schema."""

    pass


class UserResponse(UserBase, TimestampedSchema):
    """User response with timestamps."""

    id: int
    is_active: bool


class UserSearch(BaseSchema):
    """User search parameters."""

    query: str | None = None
    is_active: bool | None = None
    skip: int = Field(0, ge=0)
    limit: int = Field(100, ge=1, le=100)
