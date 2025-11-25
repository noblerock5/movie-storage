# 电影网站

一个基于 FastAPI + React + PostgreSQL + Redis 的现代化电影网站，支持搜索、播放、投屏和收藏功能。

## 功能特性

- 🎬 **高清电影搜索** - 集成多个数据源，搜索海量高清影视资源
- 📺 **在线播放** - 流畅的在线播放体验
- 📱 **电视投屏** - 支持投屏到智能电视和设备
- ❤️ **收藏管理** - 保存喜欢的电影，方便日后观看
- 📤 **本地上传** - 支持上传本地电影资源
- 🎨 **现代UI** - 简洁美观的用户界面
- 🔐 **用户系统** - 注册登录，个人数据管理

## 技术栈

### 后端
- **Python 3.12.0**
- **FastAPI** - 现代化的Web框架
- **PostgreSQL** - 主数据库
- **Redis** - 缓存和会话存储
- **SQLAlchemy** - ORM框架
- **JWT** - 身份认证

### 前端
- **React 18** - 用户界面框架
- **Ant Design** - UI组件库
- **React Router** - 路由管理
- **Axios** - HTTP客户端
- **React Player** - 视频播放器

## 快速开始

### 使用Docker Compose（推荐）

1. 克隆项目
```bash
git clone <repository-url>
cd movie-website
```

2. 启动所有服务
```bash
docker-compose up -d
```

3. 访问应用
- 前端: http://localhost:3000
- 后端API: http://localhost:8000
- API文档: http://localhost:8000/docs

### 手动安装

#### 后端设置

1. 安装Python依赖
```bash
cd backend
pip install -r requirements.txt
```

2. 配置数据库
```bash
# 确保PostgreSQL和Redis正在运行
# 创建数据库
createdb dbmovie
```

3. 设置环境变量
```bash
export DATABASE_URL="postgresql://admin:admin123456@43.143.233.242:5432/dbmovie"
export REDIS_URL="redis://:admin123456@43.143.233.242:6379"
```

4. 启动后端
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### 前端设置

1. 安装Node.js依赖
```bash
cd frontend
npm install
```

2. 启动前端
```bash
npm start
```

## 项目结构

```
movie-website/
├── backend/                 # 后端代码
│   ├── main.py             # FastAPI应用入口
│   ├── models.py           # 数据库模型
│   ├── schemas.py          # Pydantic模式
│   ├── database.py         # 数据库配置
│   ├── auth.py             # 身份认证
│   ├── search_service.py   # 搜索服务
│   ├── cast_service.py     # 投屏服务
│   └── requirements.txt    # Python依赖
├── frontend/               # 前端代码
│   ├── src/
│   │   ├── components/     # React组件
│   │   ├── pages/         # 页面组件
│   │   ├── contexts/      # React上下文
│   │   ├── services/      # API服务
│   │   └── App.js         # 应用入口
│   ├── package.json       # Node.js依赖
│   └── Dockerfile         # Docker配置
├── docker-compose.yml     # Docker编排
└── README.md              # 项目说明
```

## API文档

启动后端服务后，访问 http://localhost:8000/docs 查看完整的API文档。

### 主要API端点

- `POST /auth/register` - 用户注册
- `POST /auth/login` - 用户登录
- `GET /api/movies/search` - 搜索电影
- `GET /api/movies/{id}` - 获取电影详情
- `POST /api/movies/upload` - 上传电影
- `GET /api/favorites` - 获取收藏列表
- `POST /api/favorites/{id}` - 添加收藏
- `DELETE /api/favorites/{id}` - 取消收藏
- `GET /api/cast/{id}` - 获取投屏信息
- `POST /api/cast/start` - 开始投屏

## 配置说明

### 环境变量

后端：
- `DATABASE_URL` - PostgreSQL连接字符串 (已配置为外部数据库)
- `REDIS_URL` - Redis连接字符串 (已配置为外部Redis)
- `SECRET_KEY` - JWT密钥

前端：
- `REACT_APP_API_URL` - 后端API地址

### 数据库配置

项目使用PostgreSQL作为主数据库，Redis作为缓存。确保在启动前这些服务正在运行。

## 开发指南

## 默认管理员账户：
邮箱: admin@movie.com
密码: admin123

### 添加新的搜索源

1. 在 `backend/search_service.py` 中添加新的搜索方法
2. 实现异步搜索逻辑
3. 在 `search_movies` 方法中集成新源

### 添加新的投屏协议

1. 在 `backend/cast_service.py` 中实现新的投屏协议
2. 更新设备发现逻辑
3. 实现投屏控制接口

### 自定义UI主题

1. 修改 `frontend/src/index.css` 中的样式变量
2. 更新Ant Design主题配置
3. 调整组件样式

## 部署

### 使用Docker部署

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 手动部署

1. 配置生产环境变量
2. 使用Gunicorn启动后端
3. 构建前端静态文件
4. 配置Nginx反向代理

## 贡献

欢迎提交Issue和Pull Request来改进项目。

## 许可证

MIT License

## 注意事项

- 请确保拥有上传视频的合法版权
- 投屏功能需要局域网内的智能设备支持
- 搜索功能依赖第三方数据源，可能存在不稳定性
- 建议在生产环境中使用HTTPS