#!/bin/bash

echo "🚀 开始部署 Energy Management System 到 GitHub..."
echo "📍 当前目录: $(pwd)"
echo ""

# 确保在正确的目录
cd "/Users/xuexinhai/Desktop/印度/web"

echo "📦 初始化 Git 仓库..."
git init

echo "➕ 添加所有文件..."
git add .

echo "💾 创建提交..."
git commit -m "🌐 Energy Management System - English Default

✨ Complete Features:
- English as default language across all pages
- Complete logout functionality with confirmation dialogs
- Unified navigation with dropdown menus
- Modern responsive UI design
- Session management system

🔧 Technical Implementation:
- Fixed auto-redirect issues on login page
- Added logout functionality to all 12 pages
- Pure CSS dropdown menus (no JS dependencies)
- Language persistence across pages
- Mobile responsive design

🎯 Page Coverage:
✅ index.html (Login - English default)
✅ dashboard.html (Dashboard)
✅ bills.html (Bills Management)
✅ space-management.html (Building Management)
✅ user-management.html (User Management)
✅ device-management.html (Device Management)
✅ device-detail.html (Device Details)
✅ settings.html (System Settings)
✅ users.html (Users)
✅ pricing-designer.html (Pricing Designer)
✅ pricing-templates.html (Pricing Templates)
✅ bill-detail.html (Bill Details)

🌍 Language Support:
- Default: English (EN) ⭐
- Secondary: Chinese (ZH)
- Persistent language selection
- Global language synchronization

🚀 Ready for production deployment!"

echo "🔗 设置远程仓库..."
# 尝试添加远程仓库，如果已存在则更新URL
git remote add origin https://github.com/moss-xxh/Techno-Meters-web.git 2>/dev/null || git remote set-url origin https://github.com/moss-xxh/Techno-Meters-web.git

echo "🌿 设置主分支..."
git branch -M main

echo "🚀 推送到 GitHub (强制覆盖)..."
git push -f origin main

echo ""
echo "✅ 部署完成！"
echo "📋 仓库地址: https://github.com/moss-xxh/Techno-Meters-web"
echo "🌍 如果启用了 GitHub Pages，访问: https://moss-xxh.github.io/Techno-Meters-web/"
echo ""
echo "🎉 Energy Management System 已成功部署！默认语言：英文"