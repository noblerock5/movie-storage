from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()


class CastStartRequest(BaseModel):
    movie_id: int
    device_ip: str


class CastInfo(BaseModel):
    movie_id: int
    title: str
    status: str
    device_info: Optional[dict] = None


class CastResponse(BaseModel):
    success: bool
    message: str
    cast_info: Optional[CastInfo] = None


@router.get("/{movie_id}", response_model=CastInfo)
async def get_cast_info(movie_id: int, current_user: User = Depends(get_current_user)):
    """获取投屏信息"""
    # 这里应该实现实际的投屏信息获取逻辑
    # 目前返回模拟数据
    return CastInfo(
        movie_id=movie_id,
        title=f"电影 {movie_id}",
        status="ready",
        device_info={"ip": "192.168.1.100", "name": "客厅电视", "type": "chromecast"},
    )


@router.post("/start", response_model=CastResponse)
async def start_cast(
    request: CastStartRequest, current_user: User = Depends(get_current_user)
):
    """开始投屏"""
    # 这里应该实现实际的投屏逻辑
    # 目前返回模拟响应
    return CastResponse(
        success=True,
        message=f"开始向 {request.device_ip} 投屏电影 {request.movie_id}",
        cast_info=CastInfo(
            movie_id=request.movie_id,
            title=f"电影 {request.movie_id}",
            status="casting",
            device_info={"ip": request.device_ip, "name": "投屏设备", "type": "chromecast"},
        ),
    )
