#!/usr/bin/env python3
"""
创建测试用户
"""
import asyncio
import sys
import os

# 添加项目根目录到路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import AsyncSessionLocal
from app.models.user import User
from app.core.security import hash_password

async def create_test_user():
    """创建测试用户"""
    if not AsyncSessionLocal:
        print("❌ AsyncSessionLocal 不可用")
        return
        
    async with AsyncSessionLocal() as db:
        # 创建测试用户
        test_users = [
            {
                "username": "testuser",
                "email": "1242320464@qq.com",
                "password": "123456"
            },
            {
                "username": "admin",
                "email": "admin@example.com", 
                "password": "admin123"
            }
        ]
        
        for user_data in test_users:
            # 检查用户是否已存在
            existing_user = await User.get_by_email(db, user_data["email"])
            if existing_user:
                print(f"⚠️  用户 {user_data['email']} 已存在，跳过创建")
                continue
            
            # 创建新用户
            hashed_password = hash_password(user_data["password"])
            user = await User.create(
                db,
                username=user_data["username"],
                email=user_data["email"],
                hashed_password=hashed_password
            )
            
            print(f"✅ 创建用户成功:")
            print(f"   用户名: {user.username}")
            print(f"   邮箱: {user.email}")
            print(f"   密码: {user_data['password']}")
            print("---")
        
        await db.commit()

if __name__ == "__main__":
    asyncio.run(create_test_user())