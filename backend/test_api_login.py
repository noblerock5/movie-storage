#!/usr/bin/env python3
"""
测试API登录
"""
import asyncio
import sys
import os

# 添加项目根目录到路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from app.main import app

def test_login():
    """测试登录API"""
    client = TestClient(app)
    
    # 测试登录
    login_data = {
        "username": "1242320464@qq.com",  # OAuth2使用username字段，但实际是email
        "password": "123456"
    }
    
    print("测试登录API...")
    print(f"登录数据: {login_data}")
    
    response = client.post(
        "/api/v1/auth/login",
        data=login_data  # 使用form data，不是json
    )
    
    print(f"状态码: {response.status_code}")
    print(f"响应头: {dict(response.headers)}")
    print(f"响应内容: {response.text}")
    
    if response.status_code == 200:
        print("✅ 登录成功")
        token_data = response.json()
        print(f"访问令牌: {token_data.get('access_token', 'N/A')[:30]}...")
    else:
        print("❌ 登录失败")

if __name__ == "__main__":
    test_login()