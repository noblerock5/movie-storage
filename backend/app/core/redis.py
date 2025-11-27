"""Redis client configuration and utilities."""

from typing import Any, Optional

import redis.asyncio as redis
from redis.asyncio import Redis

from app.core.config import settings


class RedisClient:
    """Async Redis client wrapper."""

    def __init__(self) -> None:
        self._client: Optional[Redis] = None

    async def connect(self) -> None:
        """Initialize Redis connection."""
        try:
            self._client = Redis.from_url(
                settings.redis_url,
                encoding="utf-8",
                decode_responses=True,
                socket_connect_timeout=2,
                socket_timeout=2,
            )
            # Test connection
            await self._client.ping()
            print("Redis连接成功")
        except Exception as e:
            print(f"Redis连接失败，将禁用缓存功能: {e}")
            self._client = None

    async def disconnect(self) -> None:
        """Close Redis connection."""
        if self._client:
            await self._client.close()

    @property
    def client(self) -> Optional[Redis]:
        """Get Redis client instance."""
        return self._client

    async def get(self, key: str) -> Optional[str]:
        """Get value from Redis."""
        if not self._client:
            return None
        try:
            return await self._client.get(key)
        except Exception:
            return None

    async def set(self, key: str, value: str, ex: Optional[int] = None) -> bool:
        """Set value in Redis."""
        if not self._client:
            return False
        try:
            await self._client.set(key, value, ex=ex)
            return True
        except Exception:
            return False

    async def delete(self, key: str) -> bool:
        """Delete key from Redis."""
        if not self._client:
            return False
        try:
            await self._client.delete(key)
            return True
        except Exception:
            return False


# Global Redis client instance
redis_client = RedisClient()
