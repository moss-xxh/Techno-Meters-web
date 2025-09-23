/**
 * 电费账单APP - 主要功能脚本
 * 实现中英文语言切换和交互功能
 */

// 当前语言状态 - 强制默认英文
localStorage.setItem('bill-app-language', 'en');
let currentLanguage = 'en';

// 语言文本映射
const languageTexts = {
    zh: {
        // 页面标题和导航
        'page-title': '电费账单',
        'share': '分享',

        // 用户信息
        'user-name': '志闪',
        'switch-account': '切换户号',
        'account-id': '用电户号:',
        'address': '用电地址:',
        'user-address': '山西省运城市万荣县******087号',

        // 日期
        'date-text': '2025年7月',

        // 账单信息
        'bill-info': '账单信息',
        'bill-guide': '账单阅读指南',
        'subscribe-download': '订阅下载',
        'bill-period': '账单周期:',
        'payment-due': '缴费截止日期:',

        // 用电量和费用
        'current-usage': '本期电量',
        'current-bill': '本期电费',

        // 表格头部
        'cost-type': '费用类别',
        'usage-kwh': '电量(kW·h)',
        'rate-kwh': '电价(₹/kW·h)',
        'cost-inr': '电费(₹)',

        // 费用类别
        'electricity-fee': '电度电费',
        'tier-surcharge': '三档加价电费',

        // 阶梯电量
        'tiered-usage-title': '阶梯电量使用情况',
        'unit-kwh': '单位：千瓦时',
        'your-tier-is': '您的阶梯电量正处于',
        'second-tier': '第二阶梯',
        'cumulative-usage': '累计电量',
        'tier-1': '第一阶梯',
        'tier-2': '第二阶梯',
        'tier-3': '第三阶梯',
        'tier-3-range': '521-以上'
    },
    en: {
        // Page title and navigation
        'page-title': 'Electricity Bill',
        'share': 'Share',

        // User info
        'user-name': 'Zhishan',
        'switch-account': 'Switch Account',
        'account-id': 'Account ID:',
        'address': 'Address:',
        'user-address': 'Shanxi Province, Yuncheng, Wanrong County ******087',

        // Date
        'date-text': 'July 2025',

        // Bill information
        'bill-info': 'Bill Information',
        'bill-guide': 'Bill Reading Guide',
        'subscribe-download': 'Subscribe & Download',
        'bill-period': 'Bill Period:',
        'payment-due': 'Payment Due Date:',

        // Usage and cost
        'current-usage': 'Current Usage',
        'current-bill': 'Current Bill',

        // Table headers
        'cost-type': 'Cost Type',
        'usage-kwh': 'Usage(kW·h)',
        'rate-kwh': 'Rate(₹/kW·h)',
        'cost-inr': 'Cost(₹)',

        // Cost categories
        'electricity-fee': 'Electricity Fee',
        'tier-surcharge': 'Tier Surcharge',

        // Tiered usage
        'tiered-usage-title': 'Tiered Usage Status',
        'unit-kwh': 'Unit: kWh',
        'your-tier-is': 'Your tiered usage is at',
        'second-tier': 'Second Tier',
        'cumulative-usage': 'Cumulative Usage',
        'tier-1': 'Tier 1',
        'tier-2': 'Tier 2',
        'tier-3': 'Tier 3',
        'tier-3-range': '521+'
    }
};

// DOM元素
const langToggleBtn = document.getElementById('langToggle');
const elementsWithDataAttrs = document.querySelectorAll('[data-zh], [data-en]');

// 初始化应用
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    updateLanguageDisplay();
});

/**
 * 初始化应用
 */
function initializeApp() {
    // 设置初始语言
    setLanguage(currentLanguage);

    // 模拟实时数据更新
    updateBatteryLevel();
    updateCurrentTime();

    // 启动定时器
    setInterval(updateCurrentTime, 60000); // 每分钟更新时间
    setInterval(updateBatteryLevel, 300000); // 每5分钟更新电池
}

/**
 * 设置事件监听器
 */
function setupEventListeners() {
    // 语言切换按钮
    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', toggleLanguage);
    }

    // 日期选择器点击事件
    const dateSelector = document.querySelector('.date-selector');
    if (dateSelector) {
        dateSelector.addEventListener('click', handleDateSelectorClick);
    }

    // 切换户号按钮
    const switchAccountBtn = document.querySelector('.switch-account-btn');
    if (switchAccountBtn) {
        switchAccountBtn.addEventListener('click', handleSwitchAccount);
    }

    // 分享按钮
    const shareBtn = document.querySelector('.share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', handleShare);
    }

    // 账单操作按钮
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.textContent.trim();
            handleActionButtonClick(action);
        });
    });

    // 用电量卡片点击展开
    const usageCards = document.querySelectorAll('.usage-card');
    usageCards.forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = this.style.transform === 'scale(1.02)' ? 'scale(1)' : 'scale(1.02)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    });
}

/**
 * 切换语言
 */
function toggleLanguage() {
    currentLanguage = currentLanguage === 'zh' ? 'en' : 'zh';
    setLanguage(currentLanguage);
    localStorage.setItem('bill-app-language', currentLanguage);
}

/**
 * 设置语言
 */
function setLanguage(lang) {
    currentLanguage = lang;

    // 更新所有带有data-zh和data-en属性的元素
    elementsWithDataAttrs.forEach(element => {
        const text = element.getAttribute(`data-${lang}`);
        if (text) {
            if (element.tagName === 'INPUT' && element.type === 'submit') {
                element.value = text;
            } else if (element.hasAttribute('placeholder')) {
                element.placeholder = text;
            } else {
                element.textContent = text;
            }
        }
    });

    // 更新HTML lang属性
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';

    updateLanguageDisplay();
}

/**
 * 更新语言切换按钮显示
 */
function updateLanguageDisplay() {
    if (langToggleBtn) {
        const langText = langToggleBtn.querySelector('.lang-text');
        if (langText) {
            langText.textContent = currentLanguage === 'zh' ? 'EN' : '中';
        }
    }
}

/**
 * 更新当前时间
 */
function updateCurrentTime() {
    const timeElement = document.querySelector('.status-time');
    if (timeElement) {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        timeElement.textContent = `${hours}:${minutes}`;
    }
}

/**
 * 更新电池电量（模拟）
 */
function updateBatteryLevel() {
    const batteryLevel = document.querySelector('.battery-level');
    const batteryFill = document.querySelector('.battery-fill');

    if (batteryLevel && batteryFill) {
        // 模拟电池电量变化（90-100%之间）
        const level = Math.floor(Math.random() * 11) + 90;
        batteryLevel.textContent = `${level}%`;
        batteryFill.style.width = `${level}%`;

        // 根据电量调整颜色
        if (level > 20) {
            batteryLevel.style.color = '#34c759';
            batteryFill.style.backgroundColor = '#34c759';
        } else {
            batteryLevel.style.color = '#ff3b30';
            batteryFill.style.backgroundColor = '#ff3b30';
        }
    }
}

/**
 * 处理日期选择器点击
 */
function handleDateSelectorClick() {
    // 显示日期选择菜单（这里可以添加更复杂的日期选择逻辑）
    showToast(currentLanguage === 'zh' ? '点击了日期选择' : 'Date selector clicked');
}

/**
 * 处理切换户号
 */
function handleSwitchAccount() {
    showToast(currentLanguage === 'zh' ? '切换户号功能' : 'Switch account feature');
}

/**
 * 处理分享
 */
function handleShare() {
    if (navigator.share) {
        navigator.share({
            title: currentLanguage === 'zh' ? '电费账单' : 'Electricity Bill',
            text: currentLanguage === 'zh' ? '我的电费账单详情' : 'My electricity bill details',
            url: window.location.href
        }).catch(err => {
            console.log('分享失败:', err);
            fallbackShare();
        });
    } else {
        fallbackShare();
    }
}

/**
 * 备用分享方法
 */
function fallbackShare() {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href).then(() => {
            showToast(currentLanguage === 'zh' ? '链接已复制到剪贴板' : 'Link copied to clipboard');
        });
    } else {
        showToast(currentLanguage === 'zh' ? '分享功能' : 'Share feature');
    }
}

/**
 * 处理操作按钮点击
 */
function handleActionButtonClick(action) {
    const messages = {
        zh: {
            '账单阅读指南': '打开账单阅读指南',
            '订阅下载': '订阅下载功能'
        },
        en: {
            'Bill Reading Guide': 'Open bill reading guide',
            'Subscribe & Download': 'Subscribe and download feature'
        }
    };

    const message = messages[currentLanguage][action] || action;
    showToast(message);
}

/**
 * 显示提示消息
 */
function showToast(message, duration = 2000) {
    // 移除现有的toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    // 创建新的toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 10000;
        animation: fadeInOut ${duration}ms ease-in-out;
    `;

    // 添加CSS动画
    if (!document.querySelector('#toastAnimation')) {
        const style = document.createElement('style');
        style.id = 'toastAnimation';
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                15% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                85% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(toast);

    // 自动移除
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, duration);
}

/**
 * 数据更新功能（模拟实时数据）
 */
function updateBillData() {
    // 这里可以添加从API获取最新账单数据的逻辑
    console.log('Updating bill data...');
}

/**
 * 导出功能（供其他模块使用）
 */
window.BillApp = {
    setLanguage: setLanguage,
    getCurrentLanguage: () => currentLanguage,
    updateBillData: updateBillData,
    showToast: showToast
};

// 支持PWA功能
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(err => {
        console.log('Service Worker registration failed:', err);
    });
}

// 防止页面缩放
document.addEventListener('touchmove', function(event) {
    if (event.scale !== 1) {
        event.preventDefault();
    }
}, { passive: false });

// 防止双击缩放
let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);