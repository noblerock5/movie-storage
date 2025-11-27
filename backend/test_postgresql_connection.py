#!/usr/bin/env python3
"""
测试PostgreSQL连接
"""
import asyncio
import sys
import os

# 添加项目根目录到路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import AsyncSessionLocal
from app.core.config import settings
from app.models.user import User
from app.core.security import hash_password

async def test_connection():
    """测试PostgreSQL连接"""
    print(f"数据库URL: {settings.DATABASE_URL}")
    
    if not AsyncSessionLocal:
        print("❌ AsyncSessionLocal 不可用")
        return
        
    try:
        async with AsyncSessionLocal() as db:
            # 测试连接
            from sqlalchemy import text
            result = await db.execute(text("SELECT 1"))
            print("✅ PostgreSQL连接成功")
            
            # 检查用户表
            stmt = text("SELECT COUNT(*) FROM users")
            result = await db.execute(stmt)
            count = result.scalar()
            print(f"当前用户数量: {count}")
            
            # 创建测试用户（如果不存在）
            email = "1242320464@qq.com"
            existing_user = await User.get_by_email(db, email)
            
            if existing_user:
                print(f"✅ 用户 {email} 已存在")
                print(f"   用户名: {existing_user.username}")
                print(f"   用户ID: {existing_user.id}")
            else:
                print(f"⚠️  用户 {email} 不存在，正在创建...")
                hashed_password = hash_password("123456")
                user = await User.create(
                    db,
                    username="testuser",
                    email=email,
                    hashed_password=hashed_password
                )
                print(f"✅ 用户创建成功:")
                print(f"   用户名: {user.username}")
                print(f"   邮箱: {user.email}")
                print(f"   密码: 123456")
            
            await db.commit()
            
    except Exception as e:
        print(f"❌ 连接失败: {e}")

if __name__ == "__main__":
    asyncio.run(test_connection())