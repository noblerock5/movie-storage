#!/usr/bin/env python3
"""
测试获取当前用户信息API
"""
import asyncio
import sys
import os

# 添加项目根目录到路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from app.main import app

def test_auth_me():
    """测试获取当前用户信息"""
    client = TestClient(app)
    
    # 先登录获取token
    login_data = {
        "username": "1242320464@qq.com",
        "password": "123456"
    }
    
    print("1. 先登录获取token...")
    login_response = client.post("/api/v1/auth/login", data=login_data)
    
    if login_response.status_code != 200:
        print(f"❌ 登录失败: {login_response.status_code}")
        print(f"响应: {login_response.text}")
        return
    
    token_data = login_response.json()
    token = token_data["access_token"]
    print(f"✅ 登录成功，获得token: {token[:30]}...")
    
    # 测试获取用户信息
    print("\n2. 测试获取当前用户信息...")
    headers = {"Authorization": f"Bearer {token}"}
    me_response = client.get("/api/v1/auth/me", headers=headers)
    
    print(f"状态码: {me_response.status_code}")
    print(f"响应内容: {me_response.text}")
    
    if me_response.status_code == 200:
        print("✅ 获取用户信息成功")
        user_data = me_response.json()
        print(f"用户名: {user_data.get('username')}")
        print(f"邮箱: {user_data.get('email')}")
    else:
        print("❌ 获取用户信息失败")

if __name__ == "__main__":
    test_auth_me()