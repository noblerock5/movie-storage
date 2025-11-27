#!/usr/bin/env python3
"""
重置用户数据
"""
import asyncio
import sys
import os

# 添加项目根目录到路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import AsyncSessionLocal
from app.core.security import hash_password
from sqlalchemy import text

async def reset_users():
    """重置用户数据"""
    if not AsyncSessionLocal:
        print("❌ AsyncSessionLocal 不可用")
        return
        
    try:
        async with AsyncSessionLocal() as db:
            print("正在清理现有用户...")
            
            # 删除所有用户
            await db.execute(text("DELETE FROM users"))
            print("✅ 清理完成")
            
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
                hashed_password = hash_password(user_data["password"])
                await db.execute(text("""
                    INSERT INTO users (username, email, hashed_password, is_active, is_superuser)
                    VALUES (:username, :email, :hashed_password, :is_active, :is_superuser)
                """), {
                    "username": user_data["username"],
                    "email": user_data["email"],
                    "hashed_password": hashed_password,
                    "is_active": True,
                    "is_superuser": user_data["email"] == "admin@example.com"
                })
                
                print(f"✅ 创建用户: {user_data['email']}")
            
            await db.commit()
            print("\n✅ 用户重置完成!")
            
            # 验证用户
            result = await db.execute(text("SELECT username, email FROM users"))
            users = result.fetchall()
            print(f"\n当前用户数: {len(users)}")
            for user in users:
                print(f"  - {user[0]} ({user[1]})")
            
    except Exception as e:
        print(f"❌ 重置失败: {e}")

if __name__ == "__main__":
    asyncio.run(reset_users())