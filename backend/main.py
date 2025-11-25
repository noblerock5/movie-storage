from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import asyncio
import aiohttp
import json
from bs4 import BeautifulSoup
import redis
import uuid
from datetime import datetime

from database import get_db, engine, Base
from models import Movie, User, Favorite
from schemas import MovieCreate, MovieResponse, UserCreate, FavoriteResponse, LoginRequest
from auth import get_current_user, create_access_token, verify_password, hash_password
from search_service import MovieSearchService
from cast_service import CastService

Base.metadata.create_all(bind=engine)

app = FastAPI(title="电影网站 API", version="1.0.0")

# CORS配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 静态文件服务
os.makedirs("uploads", exist_ok=True)
os.makedirs("static", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
app.mount("/static", StaticFiles(directory="static"), name="static")

# Redis连接（可选）
try:
    redis_client = redis.Redis(host='43.143.233.242', port=6379, password='admin123456', db=0, decode_responses=True, socket_connect_timeout=2)
    # 测试连接
    redis_client.ping()
    print("Redis连接成功")
except Exception as e:
    print(f"Redis连接失败，将禁用缓存功能: {e}")
    redis_client = None

# 服务实例
search_service = MovieSearchService()
cast_service = CastService()

@app.get("/")
async def root():
    return {"message": "电影网站 API"}

@app.post("/auth/register")
async def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="邮箱已注册")
    
    hashed_password = hash_password(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    access_token = create_access_token(data={"sub": db_user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/auth/login")
async def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="邮箱或密码错误")
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/auth/me")
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "created_at": current_user.created_at
    }

@app.get("/api/movies/search")
async def search_movies(
    q: str = Query(..., description="搜索关键词"),
    page: int = Query(1, ge=1, description="页码"),
    db: Session = Depends(get_db)
):
    # 先从缓存查找（如果Redis可用）
    cache_key = f"search:{q}:{page}"
    if redis_client:
        try:
            cached_result = redis_client.get(cache_key)
            if cached_result:
                return json.loads(cached_result)
        except Exception:
            pass
    
    # 搜索电影
    results = await search_service.search_movies(q, page, db)
    
    # 缓存结果（如果Redis可用）
    if redis_client:
        try:
            redis_client.setex(cache_key, 3600, json.dumps(results))
        except Exception:
            pass
    
    return results

@app.get("/api/movies/{movie_id}")
async def get_movie(movie_id: int, db: Session = Depends(get_db)):
    movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if not movie:
        raise HTTPException(status_code=404, detail="电影不存在")
    
    return movie

@app.post("/api/movies/upload")
async def upload_movie(
    file: UploadFile = File(...),
    title: str = Query(...),
    description: str = Query(""),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 保存文件
    file_extension = file.filename.split('.')[-1]
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = f"uploads/{unique_filename}"
    
    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
    
    # 创建电影记录
    movie = Movie(
        title=title,
        description=description,
        file_path=file_path,
        user_id=current_user.id,
        is_local=True
    )
    db.add(movie)
    db.commit()
    db.refresh(movie)
    
    return {"message": "上传成功", "movie_id": movie.id}

@app.get("/api/movies")
async def get_movies(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    movies = db.query(Movie).offset((page - 1) * limit).limit(limit).all()
    total = db.query(Movie).count()
    
    return {
        "movies": movies,
        "total": total,
        "page": page,
        "limit": limit
    }

@app.post("/api/favorites/{movie_id}")
async def add_favorite(
    movie_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 检查电影是否存在
    movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if not movie:
        raise HTTPException(status_code=404, detail="电影不存在")
    
    # 检查是否已收藏
    existing_favorite = db.query(Favorite).filter(
        Favorite.user_id == current_user.id,
        Favorite.movie_id == movie_id
    ).first()
    
    if existing_favorite:
        raise HTTPException(status_code=400, detail="已收藏该电影")
    
    favorite = Favorite(user_id=current_user.id, movie_id=movie_id)
    db.add(favorite)
    db.commit()
    
    return {"message": "收藏成功"}

@app.delete("/api/favorites/{movie_id}")
async def remove_favorite(
    movie_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    favorite = db.query(Favorite).filter(
        Favorite.user_id == current_user.id,
        Favorite.movie_id == movie_id
    ).first()
    
    if not favorite:
        raise HTTPException(status_code=404, detail="未收藏该电影")
    
    db.delete(favorite)
    db.commit()
    
    return {"message": "取消收藏成功"}

@app.get("/api/favorites")
async def get_favorites(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    favorites = db.query(Favorite).filter(Favorite.user_id == current_user.id).all()
    movies = [fav.movie for fav in favorites]
    
    return {"movies": movies}

@app.get("/api/cast/{movie_id}")
async def get_cast_info(movie_id: int):
    """获取投屏信息"""
    cast_info = await cast_service.get_cast_info(movie_id)
    return cast_info

@app.post("/api/cast/start")
async def start_cast(
    movie_id: int,
    device_ip: str,
    current_user: User = Depends(get_current_user)
):
    """开始投屏"""
    result = await cast_service.start_cast(movie_id, device_ip)
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)