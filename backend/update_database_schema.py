#!/usr/bin/env python3
"""
手动更新数据库schema
"""
import asyncio
import sys
import os

# 添加项目根目录到路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import AsyncSessionLocal
from sqlalchemy import text

async def update_schema():
    """更新数据库schema"""
    if not AsyncSessionLocal:
        print("❌ AsyncSessionLocal 不可用")
        return
        
    try:
        async with AsyncSessionLocal() as db:
            print("正在更新数据库schema...")
            
            # 添加缺失的列到users表
            alter_statements = [
                "ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE",
                "ALTER TABLE users ADD COLUMN IF NOT EXISTS is_superuser BOOLEAN DEFAULT FALSE", 
                "ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP"
            ]
            
            for stmt in alter_statements:
                try:
                    await db.execute(text(stmt))
                    print(f"✅ 执行: {stmt}")
                except Exception as e:
                    print(f"⚠️  跳过: {stmt} - {e}")
            
            # 检查movies表结构
            print("\n检查movies表结构...")
            try:
                result = await db.execute(text("""
                    SELECT column_name, data_type
                    FROM information_schema.columns 
                    WHERE table_name = 'movies' 
                    ORDER BY ordinal_position
                """))
                columns = result.fetchall()
                print("movies表当前列:")
                for col in columns:
                    print(f"  - {col[0]}: {col[1]}")
                    
                # 添加可能缺失的列
                movie_alter_statements = [
                    "ALTER TABLE movies ADD COLUMN IF NOT EXISTS description TEXT",
                    "ALTER TABLE movies ADD COLUMN IF NOT EXISTS release_date DATE",
                    "ALTER TABLE movies ADD COLUMN IF NOT EXISTS poster_url VARCHAR(500)",
                    "ALTER TABLE movies ADD COLUMN IF NOT EXISTS rating FLOAT DEFAULT 0.0",
                    "ALTER TABLE movies ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP",
                    "ALTER TABLE movies ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP"
                ]
                
                for stmt in movie_alter_statements:
                    try:
                        await db.execute(text(stmt))
                        print(f"✅ 执行: {stmt}")
                    except Exception as e:
                        print(f"⚠️  跳过: {stmt} - {e}")
                        
            except Exception as e:
                print(f"❌ 检查movies表失败: {e}")
            
            # 检查favorites表结构
            print("\n检查favorites表结构...")
            try:
                result = await db.execute(text("""
                    SELECT column_name, data_type
                    FROM information_schema.columns 
                    WHERE table_name = 'favorites' 
                    ORDER BY ordinal_position
                """))
                columns = result.fetchall()
                print("favorites表当前列:")
                for col in columns:
                    print(f"  - {col[0]}: {col[1]}")
                    
                # 添加可能缺失的列
                fav_alter_statements = [
                    "ALTER TABLE favorites ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP"
                ]
                
                for stmt in fav_alter_statements:
                    try:
                        await db.execute(text(stmt))
                        print(f"✅ 执行: {stmt}")
                    except Exception as e:
                        print(f"⚠️  跳过: {stmt} - {e}")
                        
            except Exception as e:
                print(f"❌ 检查favorites表失败: {e}")
            
            await db.commit()
            print("\n✅ 数据库schema更新完成!")
            
    except Exception as e:
        print(f"❌ 更新失败: {e}")

if __name__ == "__main__":
    asyncio.run(update_schema())