#!/usr/bin/env python3
"""
数据库连接测试脚本
测试外部PostgreSQL和Redis连接
"""

import psycopg2
import redis
import sys

def test_postgresql():
    """测试PostgreSQL连接"""
    print("🔍 测试PostgreSQL连接...")
    try:
        conn = psycopg2.connect(
            host='43.143.233.242',
            port=5432,
            database='dbmovie',
            user='admin',
            password='admin123456'
        )
        
        # 测试查询
        cursor = conn.cursor()
        cursor.execute('SELECT version();')
        version = cursor.fetchone()[0]
        print(f"✅ PostgreSQL连接成功!")
        print(f"   版本: {version}")
        
        # 检查表是否存在
        cursor.execute("""
            SELECT table_name FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
        """)
        tables = cursor.fetchall()
        print(f"   现有表: {[table[0] for table in tables]}")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ PostgreSQL连接失败: {e}")
        return False

def test_redis():
    """测试Redis连接"""
    print("\n🔍 测试Redis连接...")
    try:
        r = redis.Redis(
            host='43.143.233.242',
            port=6379,
            password='admin123456',
            decode_responses=True
        )
        
        # 测试ping
        r.ping()
        print("✅ Redis连接成功!")
        
        # 测试读写
        r.set('test_key', 'test_value', ex=10)
        value = r.get('test_key')
        print(f"   测试读写: {value}")
        
        # 获取Redis信息
        info = r.info()
        print(f"   Redis版本: {info.get('redis_version', 'Unknown')}")
        print(f"   内存使用: {info.get('used_memory_human', 'Unknown')}")
        
        return True
        
    except Exception as e:
        print(f"❌ Redis连接失败: {e}")
        return False

def main():
    """主函数"""
    print("🎬 电影网站数据库连接测试")
    print("=" * 50)
    
    pg_success = test_postgresql()
    redis_success = test_redis()
    
    print("\n" + "=" * 50)
    if pg_success and redis_success:
        print("🎉 所有连接测试通过！")
        print("💡 提示：可以安全启动应用了")
        return 0
    else:
        print("❌ 连接测试失败，请检查配置")
        return 1

if __name__ == "__main__":
    sys.exit(main())