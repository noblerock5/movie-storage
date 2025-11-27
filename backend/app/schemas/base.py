"""Base Pydantic schemas."""

from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict


class BaseSchema(BaseModel):
    """Base schema with common configuration."""

    model_config = ConfigDict(
        from_attributes=True,
        str_strip_whitespace=True,
        validate_assignment=True,
        extra="forbid",
    )


class TimestampedSchema(BaseSchema):
    """Base schema with timestamp fields."""

    created_at: datetime
    updated_at: datetime


class ResponseSchema(BaseSchema):
    """Base response schema."""

    success: bool = True
    message: str | None = None
    data: Any | None = None
