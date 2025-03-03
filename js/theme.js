// 主题切换功能

// 主题配置
const themes = {
    light: {
        bodyBackground: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        containerBackground: '#fff',
        textColor: '#333',
        headerColor: '#2c3e50',
        quoteBackground: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        todoItemBackground: '#f8f9fa',
        todoItemBorderColor: '#4dabf7',
        completedBackground: '#e8f5e9',
        completedBorderColor: '#66bb6a'
    },
    dark: {
        bodyBackground: 'linear-gradient(135deg, #2c3e50 0%, #1a1a1a 100%)',
        containerBackground: '#2c2c2c',
        textColor: '#fff',
        headerColor: '#fff',
        quoteBackground: 'linear-gradient(135deg, #3a3a3a 0%, #2c2c2c 100%)',
        todoItemBackground: '#3a3a3a',
        todoItemBorderColor: '#4dabf7',
        completedBackground: '#2c4a2e',
        completedBorderColor: '#66bb6a'
    }
};

// 当前主题状态
let currentTheme = localStorage.getItem('theme') || 'light';

// 应用主题
function applyTheme(theme) {
    const root = document.documentElement;
    const themeConfig = themes[theme];
    
    // 设置CSS变量
    root.style.setProperty('--body-bg', themeConfig.bodyBackground);
    root.style.setProperty('--container-bg', themeConfig.containerBackground);
    root.style.setProperty('--text-color', themeConfig.textColor);
    root.style.setProperty('--header-color', themeConfig.headerColor);
    root.style.setProperty('--quote-bg', themeConfig.quoteBackground);
    root.style.setProperty('--todo-item-bg', themeConfig.todoItemBackground);
    root.style.setProperty('--todo-border-color', themeConfig.todoItemBorderColor);
    root.style.setProperty('--completed-bg', themeConfig.completedBackground);
    root.style.setProperty('--completed-border-color', themeConfig.completedBorderColor);
    
    // 保存主题设置到本地存储
    localStorage.setItem('theme', theme);
    currentTheme = theme;
    
    // 更新主题切换按钮的图标
    const themeIcon = document.getElementById('theme-toggle-icon');
    if (themeIcon) {
        themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

// 切换主题
function toggleTheme() {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
    
    // 播放切换音效
    playThemeToggleSound();
    
    // 添加切换动画
    document.body.classList.add('theme-transition');
    setTimeout(() => {
        document.body.classList.remove('theme-transition');
    }, 300);
}

// 主题切换音效
function playThemeToggleSound() {
    const audio = new Audio();
    audio.src = currentTheme === 'light' ? 'sounds/theme-dark.mp3' : 'sounds/theme-light.mp3';
    audio.volume = 0.3;
    audio.play().catch(err => console.log('音效播放失败:', err));
}

// 初始化主题功能
function initTheme() {
    // 创建主题切换按钮
    const header = document.querySelector('header');
    const themeToggle = document.createElement('button');
    themeToggle.id = 'theme-toggle';
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = `<i id="theme-toggle-icon" class="fas ${currentTheme === 'light' ? 'fa-moon' : 'fa-sun'}"></i>`;
    themeToggle.title = '切换主题';
    
    // 将按钮插入到header的第一个子元素之前
    header.insertBefore(themeToggle, header.firstChild);
    
    // 添加点击事件监听器
    themeToggle.addEventListener('click', toggleTheme);
    
    // 应用初始主题
    applyTheme(currentTheme);
}

// 当DOM加载完成后初始化主题功能
document.addEventListener('DOMContentLoaded', initTheme);