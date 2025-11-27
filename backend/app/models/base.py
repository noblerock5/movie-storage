"""Base model with common fields."""

from datetime import datetime

from sqlalchemy import Column, DateTime
from sqlalchemy.sql import func

from app.core.database import Base


class BaseModel(Base):
    """Base model class with common fields."""

    __abstract__ = True

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
        comment="创建时间",
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
        comment="更新时间",
    )
