"""Screen casting service."""

import asyncio
from typing import Any


class CastService:
    """Service for screen casting functionality."""

    def __init__(self) -> None:
        self.active_casts: dict[str, dict[str, Any]] = {}

    async def discover_devices(self) -> list[dict[str, Any]]:
        """Discover available casting devices on the local network."""
        # Mock implementation - replace with real device discovery
        mock_devices = [
            {
                "id": "tv_001",
                "name": "客厅电视",
                "ip": "192.168.1.100",
                "type": "chromecast",
                "status": "online",
            },
            {
                "id": "tv_002",
                "name": "卧室电视",
                "ip": "192.168.1.101",
                "type": "chromecast",
                "status": "online",
            },
            {
                "id": "box_001",
                "name": "小米盒子",
                "ip": "192.168.1.102",
                "type": "android_tv",
                "status": "online",
            },
        ]

        return mock_devices

    async def get_cast_info(self, movie_id: int) -> dict[str, Any]:
        """Get casting information for a movie."""
        devices = await self.discover_devices()

        return {
            "movie_id": movie_id,
            "available_devices": devices,
            "cast_protocols": ["chromecast", "airplay", "dlna"],
        }

    async def start_cast(self, movie_id: int, device_ip: str) -> dict[str, Any]:
        """Start casting a movie to a device."""
        try:
            cast_id = f"cast_{movie_id}_{device_ip}"

            # Mock casting implementation
            cast_info = {
                "cast_id": cast_id,
                "movie_id": movie_id,
                "device_ip": device_ip,
                "status": "connecting",
                "started_at": "2024-01-01T00:00:00Z",
            }

            self.active_casts[cast_id] = cast_info

            # Simulate connection
            await asyncio.sleep(2)
            cast_info["status"] = "connected"

            return {"success": True, "cast_info": cast_info, "message": "投屏连接成功"}

        except Exception as e:
            return {"success": False, "error": str(e), "message": "投屏连接失败"}

    async def stop_cast(self, cast_id: str) -> dict[str, Any]:
        """Stop an active casting session."""
        if cast_id in self.active_casts:
            cast_info = self.active_casts[cast_id]
            cast_info["status"] = "disconnected"
            del self.active_casts[cast_id]

            return {"success": True, "message": "投屏已停止"}

        return {"success": False, "message": "投屏会话不存在"}

    async def get_cast_status(self, cast_id: str) -> dict[str, Any]:
        """Get status of an active casting session."""
        if cast_id in self.active_casts:
            return {"success": True, "cast_info": self.active_casts[cast_id]}

        return {"success": False, "message": "投屏会话不存在"}
