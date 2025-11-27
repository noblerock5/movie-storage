"""Database configuration and session management."""

from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.ext.declarative import declarative_base

from app.core.config import settings

# Async engine for PostgreSQL
database_url = settings.DATABASE_URL
if database_url.startswith("postgresql://"):
    database_url = database_url.replace("postgresql://", "postgresql+asyncpg://")

async_engine = create_async_engine(
    database_url,
    echo=settings.DEBUG,
    pool_pre_ping=True,
    pool_recycle=300,
)

# Async session maker
AsyncSessionLocal = async_sessionmaker(
    async_engine, class_=AsyncSession, expire_on_commit=False
)

Base = declarative_base()


async def init_db() -> None:
    """Initialize database tables."""
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Get asynchronous database session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()


async def get_db_session() -> AsyncSession:
    """Get a database session for manual management."""
    return AsyncSessionLocal()


async def close_db():
    """Close database connections."""
    await async_engine.dispose()
