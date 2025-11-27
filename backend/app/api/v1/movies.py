import os
import uuid
from typing import List, Optional

from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.config import settings
from app.core.database import get_db
from app.models.movie import Movie
from app.models.user import User
from app.schemas.movie import MovieCreate, MovieList, MovieResponse

router = APIRouter()


@router.get("/search", response_model=MovieList)
async def search_movies(
    q: str = Query(..., description="搜索关键词"),
    page: int = Query(1, ge=1, description="页码"),
    limit: int = Query(20, ge=1, le=100, description="每页数量"),
    db: AsyncSession = Depends(get_db),
):
    """搜索电影"""
    movies, total = await Movie.search(db, q, page, limit)
    return {"movies": movies, "total": total, "page": page, "limit": limit}


@router.get("/{movie_id}", response_model=MovieResponse)
async def get_movie(movie_id: int, db: AsyncSession = Depends(get_db)):
    """获取电影详情"""
    movie = await Movie.get_by_id(db, movie_id)
    if not movie:
        raise HTTPException(status_code=404, detail="电影不存在")
    return movie


@router.get("/", response_model=MovieList)
async def get_movies(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    """获取电影列表"""
    movies, total = await Movie.get_list(db, page, limit)
    return {"movies": movies, "total": total, "page": page, "limit": limit}


@router.post("/upload", response_model=MovieResponse)
async def upload_movie(
    file: UploadFile = File(...),
    title: str = Query(...),
    description: str = Query(""),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """上传电影文件"""
    # 创建上传目录
    upload_dir = "uploads"
    os.makedirs(upload_dir, exist_ok=True)

    # 保存文件
    file_extension = file.filename.split(".")[-1]
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = os.path.join(upload_dir, unique_filename)

    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)

    # 创建电影记录
    movie = await Movie.create(
        db,
        title=title,
        description=description,
        file_path=file_path,
        user_id=current_user.id,
        is_local=True,
    )

    return movie
