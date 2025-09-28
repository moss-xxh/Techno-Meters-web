/**
 * 统一导航栏功能
 * 处理语言切换、活动状态管理和响应式导航
 */

// 导航栏管理器
class NavigationManager {
    constructor() {
        this.currentLanguage = 'en'; // 默认英文
        this.init();
    }

    init() {
        this.loadLanguagePreference();
        this.initLanguageSelector();
        this.setActiveNavigation();
        this.initMobileMenu();
        this.updateUserInfo();
        this.applyLanguage();
    }

    // 加载语言偏好
    loadLanguagePreference() {
        const savedLang = localStorage.getItem('system-lang');
        console.log('Loading language preference:', savedLang);
        if (savedLang && ['zh', 'en'].includes(savedLang)) {
            this.currentLanguage = savedLang;
            console.log('Set current language to:', this.currentLanguage);
        } else {
            console.log('No valid saved language, using default:', this.currentLanguage);
        }
    }

    // 初始化语言选择器
    initLanguageSelector() {
        const languageSelect = document.getElementById('language-select');
        if (!languageSelect) return;

        // 设置当前选中的语言
        languageSelect.value = this.currentLanguage;

        // 添加变化监听器
        languageSelect.addEventListener('change', (e) => {
            this.switchLanguage(e.target.value);
        });
    }

    // 切换语言
    switchLanguage(lang) {
        if (!['zh', 'en'].includes(lang)) return;

        console.log('Switching language from', this.currentLanguage, 'to', lang);
        this.currentLanguage = lang;
        localStorage.setItem('system-lang', lang);
        console.log('Saved to localStorage:', localStorage.getItem('system-lang'));
        this.applyLanguage();

        // 触发语言变化事件
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: lang }
        }));
    }

    // 应用语言到页面
    applyLanguage() {
        console.log('Applying language:', this.currentLanguage);
        const elementsWithLang = document.querySelectorAll('[data-zh][data-en]');

        elementsWithLang.forEach(element => {
            const text = element.getAttribute(`data-${this.currentLanguage}`);
            if (text) {
                element.textContent = text;
            }
        });

        // 处理占位符
        const placeholderElements = document.querySelectorAll('[data-zh-placeholder][data-en-placeholder]');
        placeholderElements.forEach(element => {
            const placeholder = element.getAttribute(`data-${this.currentLanguage}-placeholder`);
            if (placeholder) {
                element.placeholder = placeholder;
            }
        });

        // 更新页面标题
        const titleElements = document.querySelectorAll('title[data-zh][data-en]');
        titleElements.forEach(element => {
            const title = element.getAttribute(`data-${this.currentLanguage}`);
            if (title) {
                document.title = title;
            }
        });

        // 更新语言选择器显示
        const languageSelect = document.getElementById('language-select');
        if (languageSelect) {
            languageSelect.value = this.currentLanguage;
        }

        // 调用common.js的updateTexts函数以确保所有文本都被更新
        if (typeof updateTexts === 'function') {
            updateTexts();
        }
    }

    // 设置当前页面的活动导航
    setActiveNavigation() {
        const currentPath = window.location.pathname;
        const filename = currentPath.split('/').pop() || 'dashboard.html';

        // 移除所有活动状态
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // 设置当前页面的活动状态
        const activeLink = document.querySelector(`.nav-link[href="${filename}"]`) ||
                          document.querySelector(`.nav-link[href*="${filename}"]`);

        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    // 初始化移动端菜单
    initMobileMenu() {
        // 创建移动端菜单切换按钮（如果不存在）
        const navActions = document.querySelector('.nav-actions');
        const existingToggle = document.querySelector('.mobile-menu-toggle');

        if (navActions && !existingToggle && window.innerWidth <= 640) {
            const mobileToggle = document.createElement('button');
            mobileToggle.className = 'mobile-menu-toggle';
            mobileToggle.innerHTML = '☰';
            mobileToggle.setAttribute('aria-label', 'Toggle menu');

            // 插入到导航操作区域的开头
            navActions.insertBefore(mobileToggle, navActions.firstChild);

            // 添加点击事件
            mobileToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }

        // 处理窗口大小变化
        window.addEventListener('resize', () => {
            if (window.innerWidth > 640) {
                const navMenu = document.querySelector('.nav-menu');
                if (navMenu) {
                    navMenu.classList.remove('mobile-open');
                }
            }
        });
    }

    // 切换移动端菜单
    toggleMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        const mobileToggle = document.querySelector('.mobile-menu-toggle');

        if (navMenu) {
            navMenu.classList.toggle('mobile-open');

            // 更新按钮图标
            if (mobileToggle) {
                mobileToggle.innerHTML = navMenu.classList.contains('mobile-open') ? '✕' : '☰';
            }
        }
    }

    // 更新用户信息显示
    updateUserInfo() {
        const username = sessionStorage.getItem('username');
        if (username) {
            const userAvatar = document.querySelector('.user-avatar');
            const userSpan = document.querySelector('.user-menu span');

            if (userAvatar) {
                userAvatar.textContent = username.charAt(0).toUpperCase();
            }
            if (userSpan) {
                userSpan.textContent = username;
            }
        }
    }

    // 获取当前语言
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    // 检查登录状态 - 已禁用自动重定向
    checkLoginStatus() {
        // 暂时禁用登录状态检查，避免自动重定向
        return true;
    }
}

// 全局导航管理器实例 - 立即初始化以确保语言功能可用
let navigationManager = new NavigationManager();

// DOM加载完成后进行额外初始化
document.addEventListener('DOMContentLoaded', function() {
    // 已禁用登录状态检查
    // navigationManager.checkLoginStatus();

    // 确保语言应用到所有元素
    navigationManager.applyLanguage();
});

// 导出全局函数供其他脚本使用
window.NavigationManager = NavigationManager;
window.getCurrentLanguage = () => navigationManager ? navigationManager.getCurrentLanguage() : 'en';
window.switchLanguage = (lang) => navigationManager ? navigationManager.switchLanguage(lang) : null;