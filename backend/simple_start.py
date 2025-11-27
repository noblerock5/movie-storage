#!/usr/bin/env python3
"""
简单的后端启动脚本
"""
import sys
import os
import subprocess

# 添加项目根目录到路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def install_package(package):
    """安装包"""
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "--break-system-packages", package])
        print(f"✅ {package} 安装成功")
    except subprocess.CalledProcessError:
        print(f"❌ {package} 安装失败")

def main():
    """主函数"""
    print("🚀 启动电影网站后端服务...")
    
    # 检查必要的包
    required_packages = [
        "fastapi",
        "uvicorn[standard]", 
        "sqlalchemy",
        "asyncpg",
        "psycopg2-binary",
        "python-jose[cryptography]",
        "passlib[bcrypt]",
        "python-multipart",
        "pydantic",
        "python-dotenv"
    ]
    
    print("📦 检查并安装必要的包...")
    for package in required_packages:
        try:
            __import__(package.replace("[", "").replace("]", "").replace("-", "_"))
            print(f"✅ {package} 已安装")
        except ImportError:
            print(f"📦 安装 {package}...")
            install_package(package)
    
    print("🚀 启动服务器...")
    try:
        import uvicorn
        uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
    except Exception as e:
        print(f"❌ 启动失败: {e}")

if __name__ == "__main__":
    main()