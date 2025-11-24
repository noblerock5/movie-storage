#!/usr/bin/env python3
"""
数据库初始化脚本
创建数据库表和初始数据
"""

from database import engine, Base, SessionLocal
from models import User, Movie, Favorite
from auth import hash_password
import os

def create_tables():
    """创建所有数据库表"""
    print("正在创建数据库表...")
    Base.metadata.create_all(bind=engine)
    print("✅ 数据库表创建完成")

def create_admin_user():
    """创建管理员用户"""
    db = SessionLocal()
    try:
        # 检查是否已存在管理员用户
        admin_user = db.query(User).filter(User.email == "admin@movie.com").first()
        if admin_user:
            print("ℹ️ 管理员用户已存在")
            return
        
        # 创建管理员用户
        admin_user = User(
            username="admin",
            email="admin@movie.com",
            hashed_password=hash_password("admin123")
        )
        db.add(admin_user)
        db.commit()
        print("✅ 管理员用户创建完成")
        print("   邮箱: admin@movie.com")
        print("   密码: admin123")
        
    except Exception as e:
        print(f"❌ 创建管理员用户失败: {e}")
        db.rollback()
    finally:
        db.close()

def create_demo_movies():
    """创建演示电影数据"""
    db = SessionLocal()
    try:
        # 检查是否已有电影数据
        movie_count = db.query(Movie).count()
        if movie_count > 0:
            print("ℹ️ 电影数据已存在，跳过演示数据创建")
            return
        
        # 创建演示电影
        demo_movies = [
            Movie(
                title="复仇者联盟：终局之战",
                description="超级英雄们的终极之战",
                poster_url="https://via.placeholder.com/300x450",
                rating=9.0,
                year=2019,
                genre="动作/科幻",
                duration=181,
                stream_url="https://example.com/avengers-endgame",
                is_local=False
            ),
            Movie(
                title="泰坦尼克号",
                description="经典爱情灾难片",
                poster_url="https://via.placeholder.com/300x450",
                rating=8.5,
                year=1997,
                genre="爱情/灾难",
                duration=194,
                stream_url="https://example.com/titanic",
                is_local=False
            ),
            Movie(
                title="星际穿越",
                description="穿越星际的科幻史诗",
                poster_url="https://via.placeholder.com/300x450",
                rating=8.8,
                year=2014,
                genre="科幻/冒险",
                duration=169,
                stream_url="https://example.com/interstellar",
                is_local=False
            ),
            Movie(
                title="肖申克的救赎",
                description="希望让人自由",
                poster_url="https://via.placeholder.com/300x450",
                rating=9.3,
                year=1994,
                genre="剧情/犯罪",
                duration=142,
                stream_url="https://example.com/shawshank",
                is_local=False
            ),
            Movie(
                title="盗梦空间",
                description="梦境中的现实",
                poster_url="https://via.placeholder.com/300x450",
                rating=8.7,
                year=2010,
                genre="科幻/悬疑",
                duration=148,
                stream_url="https://example.com/inception",
                is_local=False
            )
        ]
        
        for movie in demo_movies:
            db.add(movie)
        
        db.commit()
        print(f"✅ 创建了 {len(demo_movies)} 部演示电影")
        
    except Exception as e:
        print(f"❌ 创建演示电影失败: {e}")
        db.rollback()
    finally:
        db.close()

def main():
    """主函数"""
    print("🎬 初始化电影网站数据库...")
    print()
    
    # 创建数据库表
    create_tables()
    
    # 创建管理员用户
    create_admin_user()
    
    # 创建演示数据
    create_demo_movies()
    
    print()
    print("🎉 数据库初始化完成！")
    print()
    print("📝 默认管理员账户：")
    print("   邮箱: admin@movie.com")
    print("   密码: admin123")
    print()
    print("⚠️ 请在生产环境中修改默认密码！")

if __name__ == "__main__":
    main()