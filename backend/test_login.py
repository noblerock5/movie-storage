#!/usr/bin/env python3
"""
测试登录功能
"""
import asyncio
import sys
import os

# 添加项目根目录到路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import AsyncSessionLocal
from app.models.user import User
from app.core.security import verify_password

async def test_login():
    """测试登录功能"""
    if not AsyncSessionLocal:
        print("❌ AsyncSessionLocal 不可用")
        return
        
    async with AsyncSessionLocal() as db:
        # 先查看所有用户
        from sqlalchemy import select
        stmt = select(User)
        result = await db.execute(stmt)
        users = result.scalars().all()
        
        print(f"数据库中共有 {len(users)} 个用户:")
        for user in users:
            print(f"  - ID: {user.id}, 用户名: {user.username}, 邮箱: {user.email}")
        
        if not users:
            print("❌ 数据库中没有用户，请先注册用户")
            return
        
        # 查找指定用户
        email = "1242320464@qq.com"
        user = await User.get_by_email(db, email)
        
        if not user:
            print(f"❌ 用户 {email} 不存在")
            print("可用的邮箱:")
            for user in users:
                print(f"  - {user.email}")
            return
        
        print(f"✅ 找到用户: {user.username} ({user.email})")
        print(f"   用户ID: {user.id}")
        print(f"   是否激活: {user.is_active}")
        print(f"   密码哈希: {user.hashed_password[:50]}...")
        
        # 测试密码验证
        test_passwords = ["123456", "password", "admin123"]
        for pwd in test_passwords:
            is_valid = verify_password(pwd, user.hashed_password)
            print(f"   密码 '{pwd}' 验证: {'✅ 通过' if is_valid else '❌ 失败'}")

if __name__ == "__main__":
    asyncio.run(test_login())