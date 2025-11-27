#!/bin/bash

echo "启动后端服务器..."
cd backend
.venv/bin/python run.py &
BACKEND_PID=$!

# 等待服务器启动
sleep 3

echo "测试前端 API 调用..."
cd ../frontend
node test_api.js

echo "停止后端服务器..."
kill $BACKEND_PID

echo "测试完成！"