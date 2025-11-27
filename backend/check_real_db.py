#!/usr/bin/env python3
"""
直接检查PostgreSQL数据库中的实际数据
"""
import asyncio
import sys
import os

# 添加项目根目录到路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import asyncpg
from app.core.config import settings

async def check_real_db():
    """直接连接PostgreSQL检查数据"""
    print(f"连接数据库: {settings.DATABASE_URL}")
    
    try:
        # 直接使用asyncpg连接
        conn = await asyncpg.connect(
            host="43.143.233.242",
            port=5432,
            user="admin",
            password="admin123456",
            database="dbmovie"
        )
        
        print("✅ PostgreSQL直接连接成功")
        
        # 检查所有表
        tables = await conn.fetch("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        """)
        
        print("\n数据库中的表:")
        for table in tables:
            print(f"  - {table['table_name']}")
        
        # 检查users表数据
        users = await conn.fetch("SELECT * FROM users")
        print(f"\nusers表中的数据 ({len(users)} 条):")
        for user in users:
            print(f"  ID: {user['id']}")
            print(f"  用户名: {user['username']}")
            print(f"  邮箱: {user['email']}")
            print(f"  密码哈希: {user['hashed_password'][:30]}...")
            print(f"  是否激活: {user.get('is_active', 'N/A')}")
            print(f"  是否超级用户: {user.get('is_superuser', 'N/A')}")
            print(f"  创建时间: {user.get('created_at', 'N/A')}")
            print("---")
        
        await conn.close()
        
    except Exception as e:
        print(f"❌ 连接失败: {e}")

if __name__ == "__main__":
    asyncio.run(check_real_db())