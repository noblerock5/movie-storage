#!/usr/bin/env python3
"""
测试 API 端点
"""
import asyncio
import httpx
import urllib.parse


async def test_endpoints():
    """测试所有 API 端点"""
    base_url = "http://localhost:8000"
    
    async with httpx.AsyncClient(timeout=10.0) as client:
        print("🚀 开始测试 API 端点...")
        
        try:
            # 测试根路径
            try:
                response = await client.get(f"{base_url}/")
                print(f"✅ 根路径: {response.status_code} - {response.json()}")
            except Exception as e:
                print(f"❌ 根路径失败: {e}")
            
            # 测试健康检查
            try:
                response = await client.get(f"{base_url}/health")
                print(f"✅ 健康检查: {response.status_code} - {response.json()}")
            except Exception as e:
                print(f"❌ 健康检查失败: {e}")
            
            # 测试电影搜索
            try:
                response = await client.get(f"{base_url}/api/v1/movies/search?q=test&page=1")
                print(f"✅ 电影搜索: {response.status_code}")
                if response.status_code == 200:
                    data = response.json()
                    print(f"   搜索结果: {len(data.get('movies', []))} 个电影")
            except Exception as e:
                print(f"❌ 电影搜索失败: {e}")
            
            # 测试电影列表
            try:
                response = await client.get(f"{base_url}/api/v1/movies?page=1&limit=5")
                print(f"✅ 电影列表: {response.status_code}")
                if response.status_code == 200:
                    data = response.json()
                    print(f"   电影总数: {data.get('total', 0)}")
            except Exception as e:
                print(f"❌ 电影列表失败: {e}")
            
            # 测试登录（预期失败，但端点应该存在）
            try:
                form_data = urllib.parse.urlencode({
                    'username': 'test@example.com', 
                    'password': 'testpassword'
                })
                response = await client.post(
                    f"{base_url}/api/v1/auth/login",
                    content=form_data,
                    headers={'Content-Type': 'application/x-www-form-urlencoded'}
                )
                print(f"✅ 登录端点: {response.status_code}")
                if response.status_code != 200:
                    print(f"   预期错误: {response.text}")
            except Exception as e:
                print(f"❌ 登录端点失败: {e}")
            
            # 测试收藏列表（预期 401，但端点应该存在）
            try:
                response = await client.get(f"{base_url}/api/v1/favorites")
                print(f"✅ 收藏端点: {response.status_code}")
                if response.status_code == 401:
                    print("   预期 401: 需要认证")
            except Exception as e:
                print(f"❌ 收藏端点失败: {e}")
                
            print("\n🎉 API 端点测试完成！")
            
        except httpx.ConnectError:
            print("❌ 无法连接到服务器，请确保后端正在运行在 http://localhost:8000")
        except Exception as e:
            print(f"❌ 测试过程中出现错误: {e}")


if __name__ == "__main__":
    asyncio.run(test_endpoints())