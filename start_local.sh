#!/bin/bash

echo "🎬 启动电影网站（本地模式）..."

# 检查Python是否安装
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3未安装，请先安装Python 3.12.0"
    exit 1
fi

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ Node.js未安装，请先安装Node.js"
    exit 1
fi

# 安装Python依赖（如果需要）
echo "🔧 检查Python依赖..."
python3 -c "import psycopg2, redis" 2>/dev/null || {
    echo "📦 安装数据库连接依赖..."
    pip3 install psycopg2-binary redis
}

# 检查外部数据库连接
echo "🔍 检查外部数据库连接..."
python3 -c "
import psycopg2
try:
    conn = psycopg2.connect('postgresql://admin:admin123456@43.143.233.242:5432/dbmovie')
    print('✅ PostgreSQL连接成功')
    conn.close()
except Exception as e:
    print(f'❌ PostgreSQL连接失败: {e}')
    exit(1)
" || exit 1

# 检查外部Redis连接
echo "🔍 检查外部Redis连接..."
python3 -c "
import redis
try:
    r = redis.Redis(host='43.143.233.242', port=6379, password='admin123456', decode_responses=True)
    r.ping()
    print('✅ Redis连接成功')
except Exception as e:
    print(f'❌ Redis连接失败: {e}')
    exit(1)
" || exit 1

# 创建必要的目录
mkdir -p uploads
mkdir -p static

echo "📦 安装后端依赖..."
cd backend
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt

echo "🗄️ 初始化数据库..."
python init_db.py

echo "🚀 启动后端服务..."
uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

cd ../frontend

echo "📦 安装前端依赖..."
if [ ! -d "node_modules" ]; then
    npm install
fi

echo "🚀 启动前端服务..."
npm start &
FRONTEND_PID=$!

cd ..

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
echo "- 按 Ctrl+C 停止所有服务"
echo "- 首次启动可能需要几分钟来安装依赖"
echo "- 默认管理员账户: admin@movie.com / admin123"

# 等待用户中断
trap "echo '🛑 正在停止服务...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait