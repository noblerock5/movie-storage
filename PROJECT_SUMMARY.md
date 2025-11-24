# 🎬 电影网站项目

一个功能完整的现代化电影网站，使用 Python 3.12.0 + FastAPI + React + PostgreSQL + Redis 构建。

## ✨ 主要功能

### 🎥 核心功能
- **智能搜索** - 集成多个数据源，搜索高清影视资源
- **在线播放** - 支持多种视频格式的流畅播放
- **电视投屏** - 支持Chromecast、AirPlay等投屏协议
- **资源收藏** - 保存喜欢的电影，方便日后观看
- **本地上传** - 支持上传本地电影资源到云端

### 🎨 用户体验
- **现代UI设计** - 基于Ant Design的简洁美观界面
- **响应式布局** - 完美适配PC、平板、手机
- **暗色主题** - 护眼的深色界面设计
- **流畅动画** - 精心设计的交互动效

### 🔐 用户系统
- **注册登录** - JWT令牌认证
- **个人资料** - 用户信息管理
- **收藏管理** - 个人收藏夹
- **观看历史** - 记录观看行为

## 🛠 技术架构

### 后端技术栈
```
Python 3.12.0
├── FastAPI          # 现代Web框架
├── SQLAlchemy       # ORM数据库操作
├── PostgreSQL       # 主数据库
├── Redis           # 缓存和会话
├── JWT             # 身份认证
├── Pydantic        # 数据验证
├── aiohttp         # 异步HTTP请求
└── BeautifulSoup   # 网页解析
```

### 前端技术栈
```
React 18
├── Ant Design      # UI组件库
├── React Router    # 路由管理
├── Axios          # HTTP客户端
├── React Player   # 视频播放器
├── Styled Components # CSS-in-JS
└── Context API    # 状态管理
```

### 基础设施
```
Docker & Docker Compose
├── PostgreSQL 15  # 数据库
├── Redis 7        # 缓存
├── Nginx          # 反向代理（生产环境）
└── Gunicorn       # WSGI服务器（生产环境）
```

## 📁 项目结构

```
movie-website/
├── backend/                    # 后端服务
│   ├── main.py                # FastAPI应用入口
│   ├── models.py              # 数据库模型
│   ├── schemas.py             # API数据模式
│   ├── database.py            # 数据库配置
│   ├── auth.py                # 身份认证
│   ├── search_service.py      # 搜索服务
│   ├── cast_service.py        # 投屏服务
│   ├── init_db.py             # 数据库初始化
│   ├── requirements.txt       # Python依赖
│   └── Dockerfile             # Docker配置
├── frontend/                   # 前端应用
│   ├── src/
│   │   ├── components/        # React组件
│   │   │   └── Header.js     # 页头组件
│   │   ├── pages/            # 页面组件
│   │   │   ├── Home.js       # 首页
│   │   │   ├── Search.js     # 搜索页
│   │   │   ├── MovieDetail.js# 电影详情
│   │   │   ├── Favorites.js  # 收藏页
│   │   │   ├── Login.js      # 登录页
│   │   │   ├── Upload.js     # 上传页
│   │   │   └── Profile.js    # 个人资料
│   │   ├── contexts/         # React上下文
│   │   │   └── AuthContext.js
│   │   ├── services/         # API服务
│   │   │   └── api.js
│   │   ├── App.js            # 应用入口
│   │   └── index.js          # 渲染入口
│   ├── package.json          # Node.js依赖
│   └── Dockerfile            # Docker配置
├── docker-compose.yml         # Docker编排
├── start.sh                   # Docker启动脚本
├── start_local.sh             # 本地启动脚本
└── README.md                  # 项目说明
```

## 🚀 快速启动

### 方式一：Docker Compose（推荐）
```bash
# 克隆项目
git clone <repository-url>
cd movie-website

# 启动所有服务
./start.sh
```

### 方式二：本地开发
```bash
# 启动本地服务
./start_local.sh
```

### 访问地址
- 🌐 前端应用: http://localhost:3000
- 🔧 后端API: http://localhost:8000
- 📚 API文档: http://localhost:8000/docs

## 📋 API接口

### 认证相关
```
POST /auth/register    # 用户注册
POST /auth/login       # 用户登录
GET  /auth/me          # 获取当前用户信息
```

### 电影相关
```
GET  /api/movies/search?q=关键词&page=1  # 搜索电影
GET  /api/movies/{id}                    # 获取电影详情
POST /api/movies/upload                  # 上传电影
GET  /api/movies                         # 获取电影列表
```

### 收藏相关
```
GET    /api/favorites        # 获取收藏列表
POST   /api/favorites/{id}   # 添加收藏
DELETE /api/favorites/{id}   # 取消收藏
```

### 投屏相关
```
GET  /api/cast/{id}      # 获取投屏信息
POST /api/cast/start     # 开始投屏
```

## 🎯 核心特性详解

### 🔍 智能搜索系统
- **多数据源集成** - 豆瓣、在线影视站、YouTube预告片
- **智能去重** - 自动合并重复结果
- **缓存优化** - Redis缓存热门搜索结果
- **分页加载** - 高效的数据分页

### 📺 投屏功能
- **设备发现** - 自动发现局域网内的投屏设备
- **多协议支持** - Chromecast、AirPlay、DLNA
- **实时状态** - 投屏连接状态监控
- **断线重连** - 网络异常自动重连

### 🎥 视频播放
- **多格式支持** - MP4、AVI、MKV、MOV等
- **自适应播放** - 根据网络状况调整清晰度
- **播放控制** - 进度条、音量、全屏等完整控制
- **移动端优化** - 触摸手势支持

### 💾 文件管理
- **分片上传** - 大文件分块上传
- **进度显示** - 实时上传进度
- **格式验证** - 上传前文件格式检查
- **存储优化** - 智能存储空间管理

## 🔧 配置说明

### 环境变量
```bash
# 后端配置
DATABASE_URL=postgresql://user:pass@localhost/db
REDIS_URL=redis://localhost:6379
SECRET_KEY=your-secret-key

# 前端配置
REACT_APP_API_URL=http://localhost:8000
REACT_APP_ENABLE_CAST=true
```

### 数据库配置
- PostgreSQL 15+
- Redis 7+
- 支持连接池配置

## 🛡 安全特性

- **JWT认证** - 无状态身份验证
- **密码加密** - bcrypt哈希算法
- **CORS配置** - 跨域请求控制
- **文件验证** - 上传文件类型检查
- **SQL注入防护** - ORM参数化查询

## 📱 移动端适配

- **响应式设计** - 完美适配各种屏幕尺寸
- **触摸优化** - 支持手势操作
- **性能优化** - 懒加载、虚拟滚动
- **PWA支持** - 可安装到主屏幕

## 🚀 部署方案

### 开发环境
```bash
./start_local.sh  # 本地开发环境
```

### 生产环境
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 云平台部署
- **腾讯云** - CVM + COS + RDS
- **阿里云** - ECS + OSS + RDS
- **AWS** - EC2 + S3 + RDS

## 🎨 UI/UX设计

### 设计理念
- **简洁至上** - 清晰的视觉层次
- **暗色主题** - 护眼的深色界面
- **微交互** - 精心设计的动画效果
- **一致性** - 统一的设计语言

### 组件设计
- **卡片布局** - 电影信息展示
- **网格系统** - 响应式布局
- **加载状态** - 优雅的加载动画
- **错误处理** - 友好的错误提示

## 🔮 未来规划

### 功能扩展
- [ ] 电视剧支持
- [ ] 弹幕系统
- [ ] 社交功能
- [ ] 个性化推荐
- [ ] 多语言支持
- [ ] 离线下载

### 技术优化
- [ ] 微服务架构
- [ ] CDN加速
- [ ] 分布式存储
- [ ] AI智能推荐
- [ ] 区块链版权

## 🤝 贡献指南

1. Fork项目
2. 创建功能分支
3. 提交代码
4. 创建Pull Request

## 📄 许可证

MIT License - 详见 LICENSE 文件

## 🙋‍♂️ 常见问题

### Q: 如何添加新的搜索源？
A: 在 `backend/search_service.py` 中添加新的搜索方法。

### Q: 投屏功能如何使用？
A: 确保手机和电视在同一WiFi网络，点击投屏按钮选择设备。

### Q: 支持哪些视频格式？
A: 支持MP4、AVI、MKV、MOV、WMV、FLV等常见格式。

### Q: 如何修改上传文件大小限制？
A: 在后端配置中修改 `MAX_FILE_SIZE` 环境变量。

---

🎬 **享受观影时光！** 🍿