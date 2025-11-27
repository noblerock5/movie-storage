# 电影存储项目

一个现代化的电影信息管理系统，包含前端和后端完整的解决方案。

## 项目结构

```
movie-storage/
├── backend/                 # FastAPI 后端
│   ├── app/                # 应用主目录
│   │   ├── api/           # API 路由
│   │   │   └── v1/        # API v1 版本
│   │   │       ├── auth.py    # 认证相关
│   │   │       ├── movies.py  # 电影管理
│   │   │       ├── favorites.py # 收藏功能
│   │   │       └── cast.py     # 投屏功能
│   │   ├── core/          # 核心配置
│   │   │   ├── config.py     # 应用配置
│   │   │   ├── database.py   # 数据库配置
│   │   │   ├── security.py   # 安全相关
│   │   │   └── redis.py      # Redis 配置
│   │   ├── models/        # 数据模型
│   │   │   ├── user.py       # 用户模型
│   │   │   ├── movie.py      # 电影模型
│   │   │   └── favorite.py   # 收藏模型
│   │   ├── schemas/       # Pydantic 模型
│   │   │   ├── auth.py       # 认证模式
│   │   │   ├── user.py       # 用户模式
│   │   │   └── movie.py      # 电影模式
│   │   └── main.py        # 应用入口
│   ├── requirements.txt      # Python 依赖
│   ├── run.py              # 启动脚本
│   ├── Dockerfile          # Docker 配置
│   └── .env.example        # 环境变量示例
├── frontend/               # 前端应用
│   ├── src/               # 源代码
│   ├── public/            # 静态资源
│   └── package.json       # Node.js 依赖
├── docker-compose.yml     # Docker 编排
└── README.md             # 项目说明
```

## 技术栈

### 后端
- **FastAPI**: 现代、快速的 Web 框架
- **SQLAlchemy 2.0**: 异步 ORM
- **PostgreSQL/SQLite**: 数据库
- **Redis**: 缓存和会话存储
- **JWT**: 身份认证
- **Pydantic**: 数据验证
- **Alembic**: 数据库迁移

### 前端
- **React**: 用户界面库
- **TypeScript**: 类型安全的 JavaScript
- **Vite**: 构建工具
- **Tailwind CSS**: CSS 框架

## 快速开始

### 环境要求
- Python 3.12.0+
- Node.js 18+
- Docker (可选)

### 后端启动

1. 进入后端目录
```bash
cd backend
```

2. 创建虚拟环境
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# 或
venv\Scripts\activate     # Windows
```

3. 安装依赖
```bash
pip install -r requirements.txt
```

4. 配置环境变量
```bash
cp .env.example .env
# 编辑 .env 文件，配置数据库等信息
```

5. 运行数据库迁移
```bash
alembic upgrade head
```

6. 启动应用
```bash
python run.py
```

### 前端启动

1. 进入前端目录
```bash
cd frontend
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

### Docker 启动

使用 Docker Compose 一键启动：

```bash
docker-compose up -d
```

## API 文档

启动后端服务后，访问以下地址查看 API 文档：

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 主要功能

- 🔐 用户认证和授权
- 🎬 电影信息管理
- 🔍 电影搜索功能
- ⭐ 收藏功能
- 📺 投屏功能
- 📁 文件上传
- 🚀 异步处理
- 💾 Redis 缓存

## 开发指南

### 代码规范
- 使用 Python 3.12.0 新特性
- 遵循 MyPy 类型检查
- 使用 Pydantic 进行数据验证
- 遵循 FastAPI 最佳实践

### 测试
```bash
# 后端测试
cd backend
pytest

# 前端测试
cd frontend
npm test
```

## 部署

### 后端部署
```bash
cd backend
docker build -t movie-backend .
docker run -p 8000:8000 movie-backend
```

### 前端部署
```bash
cd frontend
npm run build
```

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License