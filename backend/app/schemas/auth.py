"""Authentication schemas."""

from typing import Any

from pydantic import EmailStr, Field

from app.schemas.base import BaseSchema


class LoginRequest(BaseSchema):
    """Login request schema."""

    email: EmailStr
    password: str = Field(..., min_length=1)


class Token(BaseSchema):
    """Token response schema."""

    access_token: str
    token_type: str = "bearer"
    expires_in: int | None = None


class TokenPayload(BaseSchema):
    """Token payload schema."""

    sub: str | None = None
    exp: int | None = None


class PasswordReset(BaseSchema):
    """Password reset request schema."""

    email: EmailStr


class PasswordResetConfirm(BaseSchema):
    """Password reset confirmation schema."""

    token: str
    new_password: str = Field(..., min_length=8, max_length=128)


class PasswordChange(BaseSchema):
    """Password change schema."""

    current_password: str = Field(..., min_length=1)
    new_password: str = Field(..., min_length=8, max_length=128)
