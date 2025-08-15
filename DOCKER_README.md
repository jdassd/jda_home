# Docker 部署指南

## 项目结构
本项目包含前后端分离的架构：
- **后端**: Node.js + Express + SQLite
- **前端**: Vue 3 + Vite + Nginx

## 快速开始

### 1. 环境准备
确保已安装：
- Docker Engine 20.10+
- Docker Compose 2.0+

### 2. 配置环境变量
```bash
# 复制环境变量示例文件
cp .env.example .env

# 编辑 .env 文件，修改必要的配置
# 特别注意修改 JWT_SECRET 为安全的密钥
```

### 3. 构建和启动服务

#### 使用 Docker Compose（推荐）
```bash
# 构建镜像
docker-compose build

# 启动服务（后台运行）
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down

# 停止并删除数据卷（谨慎使用）
docker-compose down -v
```

#### 单独构建镜像
```bash
# 构建后端镜像
docker build -t nav-backend:latest ./backend

# 构建前端镜像
docker build -t nav-frontend:latest ./frontend
```

## 访问服务
- 前端: http://localhost
- 后端API: http://localhost:3000

## 生产环境部署

### 1. 安全配置
修改 `.env` 文件中的以下配置：
```env
# 使用强密码
JWT_SECRET=your-very-secure-random-string
SESSION_SECRET=another-secure-random-string

# 设置正确的域名
CORS_ORIGIN=https://your-domain.com
FRONTEND_URL=https://your-domain.com
```

### 2. HTTPS 配置
建议使用反向代理（如 Nginx、Traefik）来处理 HTTPS：

```yaml
# docker-compose.prod.yml 示例
version: '3.8'

services:
  traefik:
    image: traefik:v2.10
    command:
      - "--providers.docker=true"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.myresolver.acme.email=your-email@example.com"
      - "--certificatesresolvers.myresolver.acme.storage=/letsencrypt/acme.json"
      - "--certificatesresolvers.myresolver.acme.httpchallenge.entrypoint=web"
    ports:
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./letsencrypt:/letsencrypt
```

### 3. 数据备份
```bash
# 备份数据库
docker exec nav-backend sqlite3 /app/data/database.sqlite ".backup /app/data/backup.db"

# 导出数据卷
docker run --rm -v nav-backend-data:/data -v $(pwd):/backup alpine tar czf /backup/data-backup.tar.gz -C /data .

# 恢复数据卷
docker run --rm -v nav-backend-data:/data -v $(pwd):/backup alpine tar xzf /backup/data-backup.tar.gz -C /data
```

## 性能优化

### 1. 构建优化
使用多阶段构建减小镜像体积（已在 Dockerfile 中实现）

### 2. 缓存配置
前端 Nginx 已配置静态资源缓存

### 3. 资源限制
在 `docker-compose.yml` 中添加资源限制：
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
```

## 监控和日志

### 查看容器日志
```bash
# 实时查看所有服务日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f backend
docker-compose logs -f frontend

# 导出日志
docker-compose logs > app.log
```

### 健康检查
服务已配置健康检查，可通过以下命令查看：
```bash
docker-compose ps
docker inspect nav-backend --format='{{.State.Health.Status}}'
docker inspect nav-frontend --format='{{.State.Health.Status}}'
```

## 常见问题

### 1. 端口占用
如果端口被占用，修改 `docker-compose.yml` 中的端口映射：
```yaml
ports:
  - "8080:80"    # 将80改为8080
  - "3001:3000"  # 将3000改为3001
```

### 2. 权限问题
确保 Docker 有权限访问项目目录：
```bash
# Linux/Mac
sudo chown -R $USER:$USER .
chmod -R 755 .
```

### 3. 构建失败
清理缓存重新构建：
```bash
docker-compose build --no-cache
docker system prune -a
```

### 4. 数据库连接问题
检查环境变量配置和网络连接：
```bash
docker-compose exec backend ping backend
docker-compose exec backend env | grep DATABASE
```

## 开发环境

如需在开发环境使用 Docker：
```bash
# 创建开发用的 docker-compose.dev.yml
# 添加卷映射实现热重载
volumes:
  - ./backend/src:/app/src
  - ./frontend/src:/app/src
```

## 更新部署

```bash
# 拉取最新代码
git pull

# 重新构建镜像
docker-compose build

# 滚动更新
docker-compose up -d --no-deps --build backend
docker-compose up -d --no-deps --build frontend
```

## 卸载

```bash
# 停止并删除容器
docker-compose down

# 删除镜像
docker rmi nav-backend nav-frontend

# 删除数据卷（谨慎！会删除所有数据）
docker volume rm nav-backend-data
```

## 支持

如遇到问题，请检查：
1. Docker 和 Docker Compose 版本
2. 环境变量配置
3. 容器日志
4. 网络连接状态