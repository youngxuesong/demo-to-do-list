// 汇率模块 - 获取和显示实时汇率信息

// 主要货币对列表
const currencyPairs = [
    { base: 'USD', target: 'CNY', name: '美元/人民币' },
    { base: 'EUR', target: 'CNY', name: '欧元/人民币' },
    { base: 'GBP', target: 'CNY', name: '英镑/人民币' },
    { base: 'JPY', target: 'CNY', name: '日元/人民币', scale: 100 },
    { base: 'HKD', target: 'CNY', name: '港币/人民币' }
];

// 备用汇率数据（当API请求失败时使用）
const fallbackRates = {
    'USD/CNY': 7.15,
    'EUR/CNY': 7.75,
    'GBP/CNY': 9.10,
    'JPY/CNY': 4.75, // 100日元兑人民币
    'HKD/CNY': 0.92
};

// 获取汇率数据
async function fetchExchangeRates() {
    try {
        // 显示加载状态
        document.getElementById('exchange-rates-container').classList.add('loading');
        document.getElementById('refresh-rates').classList.add('rotating');
        
        // 使用ExchangeRate-API获取汇率数据
        // 注意：免费API可能有请求限制，实际应用中可能需要API密钥
        const response = await fetch('https://open.er-api.com/v6/latest/CNY');
        
        if (!response.ok) {
            throw new Error(`API响应错误: ${response.status}`);
        }
        
        const data = await response.json();
        
        // 处理并显示汇率数据
        displayExchangeRates(data.rates);
        
        // 更新最后更新时间
        updateLastUpdatedTime();
        
        return data.rates;
    } catch (error) {
        console.error('获取汇率数据失败:', error);
        // 使用备用数据
        displayFallbackRates();
        return null;
    } finally {
        // 移除加载状态
        document.getElementById('exchange-rates-container').classList.remove('loading');
        document.getElementById('refresh-rates').classList.remove('rotating');
    }
}

// 显示汇率数据
function displayExchangeRates(rates) {
    const ratesListElement = document.getElementById('exchange-rates-list');
    ratesListElement.innerHTML = '';
    
    currencyPairs.forEach(pair => {
        // 计算汇率（从基础货币到目标货币）
        let rate;
        if (pair.base === 'CNY') {
            rate = rates[pair.target];
        } else {
            // 如果基础货币不是CNY，需要进行转换
            rate = 1 / rates[pair.base];
        }
        
        // 对于特殊货币（如日元），应用比例因子
        const displayRate = pair.scale ? (rate * pair.scale).toFixed(4) : rate.toFixed(4);
        const displayUnit = pair.scale ? `${pair.scale}${pair.base}` : pair.base;
        
        // 创建汇率项
        const rateItem = document.createElement('li');
        rateItem.classList.add('rate-item');
        
        // 确定汇率变化趋势（这里使用随机值模拟，实际应用中应比较历史数据）
        const trend = Math.random() > 0.5 ? 'up' : 'down';
        const trendIcon = trend === 'up' ? 'fa-arrow-up' : 'fa-arrow-down';
        const trendClass = trend === 'up' ? 'trend-up' : 'trend-down';
        
        rateItem.innerHTML = `
            <div class="rate-info">
                <span class="currency-pair">${pair.name}</span>
                <span class="rate-value ${trendClass}">
                    ${displayRate}
                    <i class="fas ${trendIcon} trend-icon"></i>
                </span>
            </div>
            <div class="rate-unit">${displayUnit}/${pair.target}</div>
        `;
        
        ratesListElement.appendChild(rateItem);
    });
}

// 显示备用汇率数据
function displayFallbackRates() {
    const ratesListElement = document.getElementById('exchange-rates-list');
    ratesListElement.innerHTML = '';
    
    currencyPairs.forEach(pair => {
        const key = `${pair.base}/${pair.target}`;
        let rate = fallbackRates[key];
        
        // 创建汇率项
        const rateItem = document.createElement('li');
        rateItem.classList.add('rate-item');
        
        const displayUnit = pair.scale ? `${pair.scale}${pair.base}` : pair.base;
        
        rateItem.innerHTML = `
            <div class="rate-info">
                <span class="currency-pair">${pair.name}</span>
                <span class="rate-value">
                    ${rate.toFixed(4)}
                    <small class="fallback-note">(备用数据)</small>
                </span>
            </div>
            <div class="rate-unit">${displayUnit}/${pair.target}</div>
        `;
        
        ratesListElement.appendChild(rateItem);
    });
    
    // 显示提示信息
    document.getElementById('exchange-rates-note').textContent = '当前显示的是备用数据，非实时汇率';
}

// 更新最后更新时间
function updateLastUpdatedTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    document.getElementById('last-updated-time').textContent = `${hours}:${minutes}:${seconds}`;
}

// 初始化汇率模块
function initExchangeRates() {
    // 获取汇率数据
    fetchExchangeRates();
    
    // 添加刷新按钮事件监听器
    document.getElementById('refresh-rates').addEventListener('click', fetchExchangeRates);
    
    // 设置定时更新（每小时更新一次）
    setInterval(fetchExchangeRates, 3600000);
}

// 当DOM加载完成后初始化汇率模块
document.addEventListener('DOMContentLoaded', initExchangeRates);