from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.favorite import Favorite
from app.models.movie import Movie
from app.models.user import User
from app.schemas.favorite import FavoriteResponse
from app.schemas.movie import MovieResponse

router = APIRouter()


@router.post("/{movie_id}", response_model=FavoriteResponse)
async def add_favorite(
    movie_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """添加收藏"""
    # 检查电影是否存在
    movie = await Movie.get_by_id(db, movie_id)
    if not movie:
        raise HTTPException(status_code=404, detail="电影不存在")

    # 检查是否已收藏
    existing_favorite = await Favorite.get_user_favorite(db, current_user.id, movie_id)
    if existing_favorite:
        raise HTTPException(status_code=400, detail="已收藏该电影")

    # 创建收藏
    favorite = await Favorite.create(db, user_id=current_user.id, movie_id=movie_id)

    return favorite


@router.delete("/{movie_id}")
async def remove_favorite(
    movie_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """取消收藏"""
    favorite = await Favorite.get_user_favorite(db, current_user.id, movie_id)

    if not favorite:
        raise HTTPException(status_code=404, detail="未收藏该电影")

    await favorite.delete(db)

    return {"message": "取消收藏成功"}


@router.get("/", response_model=List[MovieResponse])
async def get_favorites(
    current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    """获取收藏列表"""
    movies = await Favorite.get_user_movies(db, current_user.id)
    return movies
