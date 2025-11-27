#!/usr/bin/env python3
"""
简单的 API 测试脚本
"""
import asyncio
import httpx


async def test_api():
    """测试 API 端点"""
    base_url = "http://localhost:8000"
    
    async with httpx.AsyncClient() as client:
        try:
            # 测试根路径
            response = await client.get(f"{base_url}/")
            print(f"根路径: {response.status_code} - {response.json()}")
            
            # 测试健康检查
            response = await client.get(f"{base_url}/health")
            print(f"健康检查: {response.status_code} - {response.json()}")
            
            # 测试 API 文档
            response = await client.get(f"{base_url}/docs")
            print(f"API 文档: {response.status_code}")
            
        except httpx.ConnectError:
            print("无法连接到服务器，请确保服务器正在运行")
        except Exception as e:
            print(f"测试出错: {e}")


if __name__ == "__main__":
    asyncio.run(test_api())