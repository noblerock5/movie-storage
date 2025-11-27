#!/usr/bin/env python3
"""
测试密码验证
"""
import asyncio
import sys
import os

# 添加项目根目录到路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import asyncpg
from app.core.security import verify_password

async def test_password():
    """测试密码验证"""
    try:
        # 直接连接PostgreSQL
        conn = await asyncpg.connect(
            host="43.143.233.242",
            port=5432,
            user="admin",
            password="admin123456",
            database="dbmovie"
        )
        
        print("✅ 连接成功")
        
        # 获取用户数据
        user = await conn.fetchrow(
            "SELECT * FROM users WHERE email = $1", 
            "1242320464@qq.com"
        )
        
        if not user:
            print("❌ 用户不存在")
            return
            
        print(f"✅ 找到用户: {user['username']} ({user['email']})")
        print(f"   密码哈希: {user['hashed_password']}")
        
        # 测试密码验证
        test_passwords = ["123456", "password", "admin123", ""]
        for pwd in test_passwords:
            try:
                is_valid = verify_password(pwd, user['hashed_password'])
                print(f"   密码 '{pwd}' 验证: {'✅ 通过' if is_valid else '❌ 失败'}")
            except Exception as e:
                print(f"   密码 '{pwd}' 验证: ❌ 错误 - {e}")
        
        await conn.close()
        
    except Exception as e:
        print(f"❌ 测试失败: {e}")

if __name__ == "__main__":
    asyncio.run(test_password())