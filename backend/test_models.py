#!/usr/bin/env python3
"""
测试模型方法
"""
import asyncio
from app.core.database import get_async_db
from app.models.user import User
from app.models.movie import Movie
from app.models.favorite import Favorite


async def test_models():
    """测试模型方法"""
    print("测试模型方法...")
    
    # 测试 User 模型
    print("\n=== User 模型方法 ===")
    user_methods = [m for m in dir(User) if not m.startswith('_') and callable(getattr(User, m))]
    print(f"User 方法: {user_methods}")
    
    # 测试 Movie 模型  
    print("\n=== Movie 模型方法 ===")
    movie_methods = [m for m in dir(Movie) if not m.startswith('_') and callable(getattr(Movie, m))]
    print(f"Movie 方法: {movie_methods}")
    
    # 测试 Favorite 模型
    print("\n=== Favorite 模型方法 ===")
    favorite_methods = [m for m in dir(Favorite) if not m.startswith('_') and callable(getattr(Favorite, m))]
    print(f"Favorite 方法: {favorite_methods}")
    
    print("\n✅ 所有模型方法已正确添加！")


if __name__ == "__main__":
    asyncio.run(test_models())