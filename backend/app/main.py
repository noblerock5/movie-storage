from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import auth, cast, favorites, movies
from app.core.config import settings
from app.core.database import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    # 启动时初始化数据库
    await init_db()
    yield
    # 关闭时的清理工作


app = FastAPI(
    title="电影网站 API", version="1.0.0", description="一个现代化的电影信息管理 API", lifespan=lifespan
)

# CORS 配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_HOSTS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 包含路由
app.include_router(auth.router, prefix="/api/v1/auth", tags=["认证"])
app.include_router(movies.router, prefix="/api/v1/movies", tags=["电影"])
app.include_router(favorites.router, prefix="/api/v1/favorites", tags=["收藏"])
app.include_router(cast.router, prefix="/api/v1/cast", tags=["投屏"])


@app.get("/")
async def root():
    return {"message": "电影网站 API", "version": "1.0.0"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=settings.DEBUG)
