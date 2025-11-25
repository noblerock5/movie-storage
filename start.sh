#!/bin/bash

echo "🎬 启动电影网站（使用外部数据库）..."

# 检查Docker是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker未安装，请先安装Docker"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose未安装，请先安装Docker Compose"
    exit 1
fi

# 创建必要的目录
mkdir -p uploads
mkdir -p static

# 检查外部数据库连接
echo "🔍 检查外部数据库连接..."
docker run --rm --network host python:3.12-slim bash -c "
pip install psycopg2-binary redis > /dev/null 2>&1
python3 -c \"
import psycopg2
try:
    conn = psycopg2.connect('postgresql://admin:admin123456@43.143.233.242:5432/dbmovie')
    print('✅ PostgreSQL连接成功')
    conn.close()
except Exception as e:
    print(f'❌ PostgreSQL连接失败: {e}')
    exit(1)

import redis
try:
    r = redis.Redis(host='43.143.233.242', port=6379, password='admin123456', decode_responses=True)
    r.ping()
    print('✅ Redis连接成功')
except Exception as e:
    print(f'❌ Redis连接失败: {e}')
    exit(1)
\"
" || exit 1

# 启动服务
echo "🚀 启动Docker容器..."
docker-compose up -d

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 10

# 检查服务状态
echo "🔍 检查服务状态..."
docker-compose ps

# 显示访问信息
echo ""
echo "✅ 服务启动成功！"
echo ""
echo "📱 前端地址: http://localhost:3000"
echo "🔧 后端API: http://localhost:8000"
echo "📚 API文档: http://localhost:8000/docs"
echo ""
echo "🎉 享受观影时光！"
echo ""
echo "💡 提示："
echo "- 首次启动可能需要几分钟来下载镜像"
echo "- 如遇问题，请运行 'docker-compose logs' 查看日志"
echo "- 停止服务请运行 'docker-compose down'"