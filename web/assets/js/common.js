/* =============================================
   能源管理系统 - 公共JavaScript功能
   Energy Management System - Common JS
   ============================================= */

// 获取当前语言（由NavigationManager管理）
function getCurrentLanguage() {
    // 避免无限递归，检查是否存在EnergySystem.getCurrentLanguage
    if (window.EnergySystem && window.EnergySystem.getCurrentLanguage && window.EnergySystem.getCurrentLanguage !== getCurrentLanguage) {
        return window.EnergySystem.getCurrentLanguage();
    }
    // 回退到localStorage或默认语言
    return localStorage.getItem('system-lang') || 'zh';
}

// 更新页面文本
function updateTexts() {
    // 更新data-zh/data-en属性的元素
    document.querySelectorAll('[data-zh]').forEach(element => {
        const text = element.getAttribute(`data-${getCurrentLanguage()}`);
        if (text) {
            element.textContent = text;
        }
    });

    // 更新占位符文本
    document.querySelectorAll('[data-zh-placeholder]').forEach(element => {
        const placeholder = element.getAttribute(`data-${getCurrentLanguage()}-placeholder`);
        if (placeholder) {
            element.placeholder = placeholder;
        }
    });

    // 更新title属性
    document.querySelectorAll('[data-zh-title]').forEach(element => {
        const title = element.getAttribute(`data-${getCurrentLanguage()}-title`);
        if (title) {
            element.title = title;
        }
    });
}

// 语言系统现在由NavigationManager统一管理

// 导航高亮功能
function setActiveNavigation(currentPage) {
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        link.classList.toggle('active', href === currentPage || href.endsWith(currentPage));
    });
}

// 格式化数字
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// 格式化货币
function formatCurrency(amount, currency = '₹') {
    if (amount >= 1000000) {
        return `${currency}${(amount / 1000000).toFixed(2)}M`;
    } else if (amount >= 1000) {
        return `${currency}${(amount / 1000).toFixed(1)}K`;
    }
    return `${currency}${amount.toFixed(2)}`;
}

// 格式化日期
function formatDate(date, locale = 'zh-CN') {
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    };

    if (getCurrentLanguage() === 'en') {
        locale = 'en-US';
    }

    return new Date(date).toLocaleDateString(locale, options);
}

// 显示通知
function showNotification(message, type = 'info', duration = 3000) {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // 添加样式
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--background);
        border: var(--border);
        border-radius: var(--radius);
        padding: var(--space-4);
        box-shadow: var(--shadow-elevated);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;

    // 根据类型设置颜色
    const colors = {
        success: 'var(--success)',
        error: 'var(--error)',
        warning: 'var(--warning)',
        info: 'var(--info)'
    };

    notification.style.borderLeftColor = colors[type] || colors.info;
    notification.style.borderLeftWidth = '4px';

    // 添加到页面
    document.body.appendChild(notification);

    // 显示动画
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // 关闭按钮事件
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        hideNotification(notification);
    });

    // 自动关闭
    if (duration > 0) {
        setTimeout(() => {
            hideNotification(notification);
        }, duration);
    }

    return notification;
}

// 隐藏通知
function hideNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// 确认对话框
function showConfirmDialog(message, callback) {
    const dialog = document.createElement('div');
    dialog.className = 'confirm-dialog-overlay';
    dialog.innerHTML = `
        <div class="confirm-dialog">
            <div class="confirm-dialog-content">
                <h3>${getCurrentLanguage() === 'zh' ? '确认操作' : 'Confirm Action'}</h3>
                <p>${message}</p>
                <div class="confirm-dialog-actions">
                    <button class="btn btn-secondary confirm-cancel">
                        ${getCurrentLanguage() === 'zh' ? '取消' : 'Cancel'}
                    </button>
                    <button class="btn btn-primary confirm-ok">
                        ${getCurrentLanguage() === 'zh' ? '确认' : 'Confirm'}
                    </button>
                </div>
            </div>
        </div>
    `;

    // 添加样式
    dialog.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1001;
    `;

    const dialogBox = dialog.querySelector('.confirm-dialog');
    dialogBox.style.cssText = `
        background: var(--background);
        border-radius: var(--radius);
        padding: var(--space-6);
        max-width: 400px;
        width: 90%;
        box-shadow: var(--shadow-elevated);
    `;

    const actions = dialog.querySelector('.confirm-dialog-actions');
    actions.style.cssText = `
        display: flex;
        gap: var(--space-3);
        justify-content: flex-end;
        margin-top: var(--space-5);
    `;

    document.body.appendChild(dialog);

    // 事件处理
    dialog.querySelector('.confirm-cancel').addEventListener('click', () => {
        document.body.removeChild(dialog);
        if (callback) callback(false);
    });

    dialog.querySelector('.confirm-ok').addEventListener('click', () => {
        document.body.removeChild(dialog);
        if (callback) callback(true);
    });

    // 点击遮罩关闭
    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) {
            document.body.removeChild(dialog);
            if (callback) callback(false);
        }
    });
}

// 加载状态管理
function showLoading(element) {
    if (element) {
        element.style.opacity = '0.6';
        element.style.pointerEvents = 'none';

        const loader = document.createElement('div');
        loader.className = 'loading-spinner';
        loader.innerHTML = `
            <div class="spinner"></div>
            <span>${getCurrentLanguage() === 'zh' ? '加载中...' : 'Loading...'}</span>
        `;

        loader.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: var(--space-2);
            color: var(--text-secondary);
            font-size: 14px;
        `;

        const spinner = loader.querySelector('.spinner');
        spinner.style.cssText = `
            width: 20px;
            height: 20px;
            border: 2px solid var(--divider);
            border-top: 2px solid var(--accent);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        `;

        // 添加旋转动画
        if (!document.querySelector('#spinner-keyframes')) {
            const style = document.createElement('style');
            style.id = 'spinner-keyframes';
            style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }

        element.style.position = 'relative';
        element.appendChild(loader);
    }
}

function hideLoading(element) {
    if (element) {
        element.style.opacity = '1';
        element.style.pointerEvents = 'auto';

        const loader = element.querySelector('.loading-spinner');
        if (loader) {
            loader.remove();
        }
    }
}

// 表格搜索功能
function createTableSearch(tableId, searchInputId, columns = []) {
    const table = document.getElementById(tableId);
    const searchInput = document.getElementById(searchInputId);

    if (!table || !searchInput) return;

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        const rows = table.querySelectorAll('tbody tr');

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            let matchFound = false;

            if (columns.length === 0) {
                // 搜索所有列
                cells.forEach(cell => {
                    if (cell.textContent.toLowerCase().includes(searchTerm)) {
                        matchFound = true;
                    }
                });
            } else {
                // 搜索指定列
                columns.forEach(columnIndex => {
                    if (cells[columnIndex] && cells[columnIndex].textContent.toLowerCase().includes(searchTerm)) {
                        matchFound = true;
                    }
                });
            }

            row.style.display = matchFound ? '' : 'none';
        });
    });
}

// 表格排序功能
function createTableSort(tableId) {
    const table = document.getElementById(tableId);
    if (!table) return;

    const headers = table.querySelectorAll('th[data-sortable]');
    headers.forEach((header, index) => {
        header.style.cursor = 'pointer';
        header.style.userSelect = 'none';

        header.addEventListener('click', () => {
            const tbody = table.querySelector('tbody');
            const rows = Array.from(tbody.querySelectorAll('tr'));
            const isAscending = header.classList.contains('sort-asc');

            // 清除其他列的排序状态
            headers.forEach(h => h.classList.remove('sort-asc', 'sort-desc'));

            // 设置当前列的排序状态
            header.classList.add(isAscending ? 'sort-desc' : 'sort-asc');

            // 排序行
            rows.sort((a, b) => {
                const aVal = a.cells[index].textContent.trim();
                const bVal = b.cells[index].textContent.trim();

                // 尝试数字比较
                const aNum = parseFloat(aVal.replace(/[^\d.-]/g, ''));
                const bNum = parseFloat(bVal.replace(/[^\d.-]/g, ''));

                if (!isNaN(aNum) && !isNaN(bNum)) {
                    return isAscending ? bNum - aNum : aNum - bNum;
                }

                // 字符串比较
                return isAscending ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
            });

            // 重新插入排序后的行
            rows.forEach(row => tbody.appendChild(row));
        });
    });
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 节流函数
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 页面初始化现在由NavigationManager统一管理

// 导出全局函数
window.EnergySystem = {
    updateTexts,
    setActiveNavigation,
    formatNumber,
    formatCurrency,
    formatDate,
    showNotification,
    hideNotification,
    showConfirmDialog,
    showLoading,
    hideLoading,
    createTableSearch,
    createTableSort,
    debounce,
    throttle,
    currentLanguage: () => getCurrentLanguage()
};