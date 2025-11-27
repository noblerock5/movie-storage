#!/usr/bin/env python3
"""
检查数据库表结构
"""
import asyncio
import sys
import os

# 添加项目根目录到路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import AsyncSessionLocal
from sqlalchemy import text

async def check_structure():
    """检查数据库表结构"""
    if not AsyncSessionLocal:
        print("❌ AsyncSessionLocal 不可用")
        return
        
    try:
        async with AsyncSessionLocal() as db:
            # 检查所有表
            result = await db.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
            """))
            tables = result.fetchall()
            print("数据库中的表:")
            for table in tables:
                print(f"  - {table[0]}")
            
            # 检查users表结构
            if any('users' in table for table in tables):
                print("\nusers表结构:")
                result = await db.execute(text("""
                    SELECT column_name, data_type, is_nullable
                    FROM information_schema.columns 
                    WHERE table_name = 'users' 
                    ORDER BY ordinal_position
                """))
                columns = result.fetchall()
                for col in columns:
                    print(f"  - {col[0]}: {col[1]} (nullable: {col[2]})")
            
    except Exception as e:
        print(f"❌ 检查失败: {e}")

if __name__ == "__main__":
    asyncio.run(check_structure())