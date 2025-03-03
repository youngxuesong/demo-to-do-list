/**
 * 新闻聚合功能模块
 * 负责从多个平台获取热点新闻并展示
 */

// 新闻API配置
const NEWS_APIS = {
    // 每日新闻API
    everyday: {
        url: 'https://api.vvhan.com/api/60s',
        params: {},
        name: '每日新闻',
        parseResponse: (data) => {
            return data.map(title => ({
                title: title,
                url: 'https://www.baidu.com/s?wd=' + encodeURIComponent(title),
                publishedAt: new Date().toISOString(),
                source: '每日新闻'
            }));
        }
    },
    // 知乎热榜API
    zhihu: {
        url: 'https://api.vvhan.com/api/zhihu',
        params: {},
        name: '知乎热榜',
        parseResponse: (data) => {
            if (!data || !Array.isArray(data.data)) return [];
            return data.data.map(item => ({
                title: item.title,
                url: item.url,
                publishedAt: new Date().toISOString(),
                source: '知乎热榜'
            }));
        }
    },
    // 每日一言API
    hitokoto: {
        url: 'https://v1.hitokoto.cn',
        params: {c: 'd', encode: 'json'},
        name: '每日一言',
        parseResponse: (data) => {
            return [{
                title: data.hitokoto,
                url: 'https://hitokoto.cn?uuid=' + data.uuid,
                publishedAt: new Date().toISOString(),
                source: '每日一言'
            }];
        }
    },
    // 天气API
    weather: {
        url: 'https://api.vvhan.com/api/weather',
        params: {city: '北京'},
        name: '今日天气',
        parseResponse: (data) => {
            if (!data || !data.info) return [];
            return [{
                title: `${data.city}天气: ${data.info.type} ${data.info.low}~${data.info.high} ${data.info.fengxiang}`,
                url: 'https://www.baidu.com/s?wd=' + encodeURIComponent(data.city + '天气'),
                publishedAt: new Date().toISOString(),
                source: '今日天气'
            }];
        }
    }
};

/**
 * 格式化日期
 * @param {string} dateString - ISO格式的日期字符串
 * @returns {string} 格式化后的日期字符串
 */
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        // 根据时间差返回不同格式
        if (diffMins < 60) {
            return `${diffMins}分钟前`;
        } else if (diffHours < 24) {
            return `${diffHours}小时前`;
        } else if (diffDays < 7) {
            return `${diffDays}天前`;
        } else {
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        }
    } catch (e) {
        console.error('日期格式化错误:', e);
        return '未知时间';
    }
}

/**
 * 通用API获取函数
 * @param {string} apiKey - API配置对象的键名
 * @returns {Promise<Array>} 新闻数组
 */
async function fetchApiNews(apiKey) {
    try {
        const api = NEWS_APIS[apiKey];
        if (!api) {
            throw new Error(`未找到API配置: ${apiKey}`);
        }
        
        const params = new URLSearchParams(api.params);
        const response = await fetch(`${api.url}?${params}`);
        
        if (!response.ok) {
            throw new Error(`${api.name} API响应错误: ${response.status}`);
        }
        
        const data = await response.json();
        
        // 如果API有自定义解析函数，则使用它
        if (typeof api.parseResponse === 'function') {
            return api.parseResponse(data);
        }
        
        // 默认解析逻辑
        if (apiKey === 'gnews' && data.articles) {
            return data.articles.map(article => ({
                title: article.title,
                url: article.url,
                publishedAt: article.publishedAt,
                source: article.source?.name || api.name
            }));
        } else if (apiKey === 'newsdata' && data.results) {
            return data.results.slice(0, 5).map(article => ({
                title: article.title,
                url: article.link,
                publishedAt: article.pubDate,
                source: article.source_id || api.name
            }));
        }
        
        return [];
    } catch (error) {
        console.error(`获取${NEWS_APIS[apiKey]?.name || apiKey}新闻失败:`, error);
        return [];
    }
}

// 获取知乎热榜
async function fetchZhihuAPI() {
    return fetchApiNews('zhihu');
}

/**
 * 获取每日一言
 * @returns {Promise<Array>} 新闻数组
 */
async function fetchHitokotoAPI() {
    return fetchApiNews('hitokoto');
}

/**
 * 获取天气信息
 * @returns {Promise<Array>} 新闻数组
 */
async function fetchWeatherAPI() {
    return fetchApiNews('weather');
}

/**
 * 获取所有平台的新闻并合并
 * @returns {Promise<Array>} 合并后的新闻数组
 */
async function fetchAllNews() {
    try {
        // 显示加载状态
        const newsContainer = document.getElementById('news-list');
        if (newsContainer) {
            newsContainer.innerHTML = '<div class="news-loading"><i class="fas fa-spinner fa-spin"></i> 正在加载新闻...</div>';
        }
        
        let allNews = [];
        
        // 并行获取所有新闻源数据
        const [everydayResults, zhihuResults, hitokotoResults, weatherResults] = await Promise.allSettled([
            fetchApiNews('everyday'),
            fetchApiNews('zhihu'),
            fetchApiNews('hitokoto'),
            fetchApiNews('weather')
        ]);
        
        // 添加成功获取的新闻数据
        if (everydayResults.status === 'fulfilled' && everydayResults.value.length > 0) {
            allNews = [...allNews, ...everydayResults.value];
        }
        
        if (zhihuResults.status === 'fulfilled' && zhihuResults.value.length > 0) {
            allNews = [...allNews, ...zhihuResults.value];
        }
        
        if (hitokotoResults.status === 'fulfilled' && hitokotoResults.value.length > 0) {
            allNews = [...allNews, ...hitokotoResults.value];
        }
        
        if (weatherResults.status === 'fulfilled' && weatherResults.value.length > 0) {
            allNews = [...allNews, ...weatherResults.value];
        }
        
        // 如果没有获取到任何新闻，显示错误信息
        if (allNews.length === 0) {
            throw new Error('暂时无法获取新闻数据');
        }
        
        // 按发布时间排序（最新的在前）
        allNews.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        
        // 限制显示数量
        return allNews.slice(0, 10);
    } catch (error) {
        console.error('获取新闻失败:', error);
        throw error; // 向上传递错误，由renderNews处理
    }
}

/**
 * 渲染新闻列表
 */
async function renderNews() {
    const newsContainer = document.getElementById('news-list');
    if (!newsContainer) return;
    
    try {
        const newsData = await fetchAllNews();
        
        // 清空容器
        newsContainer.innerHTML = '';
        
        // 渲染每条新闻
        newsData.forEach((item, index) => {
            const newsItem = document.createElement('div');
            newsItem.className = 'news-item';
            
            const formattedDate = formatDate(item.publishedAt);
            const newsIndex = index + 1;
            
            // 根据新闻源添加不同的图标
            let sourceIcon = 'newspaper';
            if (item.source === '知乎热榜') sourceIcon = 'comment-dots';
            else if (item.source === '每日一言') sourceIcon = 'quote-left';
            else if (item.source === '今日天气') sourceIcon = 'cloud-sun';
            
            newsItem.innerHTML = `
                <div class="news-source"><i class="fas fa-${sourceIcon}"></i> ${item.source}</div>
                <a href="${item.url}" target="_blank" class="news-title" data-index="${newsIndex}">${item.title}</a>
                <div class="news-time">${formattedDate}</div>
            `;
            
            newsContainer.appendChild(newsItem);
        });
    } catch (error) {
        console.error('渲染新闻失败:', error);
        // 显示错误信息，并提供备用内容
        newsContainer.innerHTML = `
            <div class="news-error">获取新闻失败，请稍后再试</div>
            <div class="news-item backup-item">
                <div class="news-source"><i class="fas fa-exclamation-circle"></i> 备用内容</div>
                <a href="javascript:void(0)" class="news-title">网络连接问题，无法获取最新新闻</a>
                <div class="news-time">刚刚</div>
            </div>
            <div class="news-item backup-item">
                <div class="news-source"><i class="fas fa-quote-left"></i> 每日一言</div>
                <a href="javascript:void(0)" class="news-title">行动是治愈恐惧的良药，而犹豫、拖延将不断滋养恐惧。</a>
                <div class="news-time">备用内容</div>
            </div>
        `;
    }
}

/**
 * 初始化新闻功能
 */
function initNews() {
    // 初始加载新闻
    renderNews();
    
    // 添加刷新按钮事件
    const refreshBtn = document.getElementById('refresh-news');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            refreshBtn.classList.add('rotating');
            renderNews().finally(() => {
                setTimeout(() => {
                    refreshBtn.classList.remove('rotating');
                }, 1000);
            });
        });
    }
}

// 当DOM加载完成后初始化新闻功能
document.addEventListener('DOMContentLoaded', initNews);