#!/bin/bash

# 启动后端服务
echo "正在启动后端服务..."
cd /Users/apple/Desktop/python项目集/my_project/project12/movie-storage

# 激活虚拟环境并启动服务
if [ -d "venv" ]; then
    source venv/bin/activate
    echo "虚拟环境已激活"
else
    echo "创建虚拟环境..."
    python3 -m venv venv
    source venv/bin/activate
    echo "安装基础依赖..."
    pip install fastapi uvicorn sqlalchemy python-jose passlib python-multipart pydantic python-dotenv
fi

echo "启动FastAPI服务器..."
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000