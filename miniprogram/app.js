// app.js - 小程序全局逻辑
App({
  globalData: {
    // 全局数据
    userInfo: null,
    themes: {
      light: {
        bodyBackground: '#f5f7fa',
        containerBackground: '#fff',
        textColor: '#333',
        headerColor: '#2c3e50',
        quoteBackground: '#f8f9fa',
        todoItemBackground: '#f8f9fa',
        todoItemBorderColor: '#4dabf7',
        completedBackground: '#e8f5e9',
        completedBorderColor: '#66bb6a'
      },
      dark: {
        bodyBackground: '#2c3e50',
        containerBackground: '#2c2c2c',
        textColor: '#fff',
        headerColor: '#fff',
        quoteBackground: '#3a3a3a',
        todoItemBackground: '#3a3a3a',
        todoItemBorderColor: '#4dabf7',
        completedBackground: '#2c4a2e',
        completedBorderColor: '#66bb6a'
      }
    },
    currentTheme: 'light',
    // 备用心灵鸡汤数组（仅在API请求失败时使用）
    fallbackQuotes: [
      "种一棵树最好的时间是十年前，现在是现在。",
      "不要等待机会，而要创造机会。",
      "成功不是将来才有的，而是从决定去做的那一刻起，持续累积而成。",
      "每一个优秀的人，都有一段沉默的时光。那一段时光，是付出了很多努力，忍受孤独和寂寞，不抱怨不诉苦，日后说起时，连自己都能被感动的日子。",
      "生活不是等待风暴过去，而是学会在雨中翩翩起舞。"
    ],
    // 主要货币对列表
    currencyPairs: [
      { base: 'USD', target: 'CNY', name: '美元/人民币' },
      { base: 'EUR', target: 'CNY', name: '欧元/人民币' },
      { base: 'GBP', target: 'CNY', name: '英镑/人民币' },
      { base: 'JPY', target: 'CNY', name: '日元/人民币', scale: 100 },
      { base: 'HKD', target: 'CNY', name: '港币/人民币' }
    ],
    // 备用汇率数据（当API请求失败时使用）
    fallbackRates: {
      'USD/CNY': 7.15,
      'EUR/CNY': 7.75,
      'GBP/CNY': 9.10,
      'JPY/CNY': 4.75, // 100日元兑人民币
      'HKD/CNY': 0.92
    },
    // 任务优先级配置
    priorities: {
      low: {
        name: '低',
        color: '#74b9ff',
        icon: 'arrow-down'
      },
      medium: {
        name: '中',
        color: '#fdcb6e',
        icon: 'minus'
      },
      high: {
        name: '高',
        color: '#e74c3c',
        icon: 'arrow-up'
      }
    },
    // 任务分类标签
    categories: [
      { id: 'work', name: '工作', color: '#0984e3', icon: 'briefcase' },
      { id: 'personal', name: '个人', color: '#00b894', icon: 'user' },
      { id: 'study', name: '学习', color: '#6c5ce7', icon: 'book' },
      { id: 'health', name: '健康', color: '#e84393', icon: 'heartbeat' },
      { id: 'shopping', name: '购物', color: '#00cec9', icon: 'shopping-cart' },
      { id: 'other', name: '其他', color: '#636e72', icon: 'tag' }
    ]
  },
  
  onLaunch: function() {
    // 小程序启动时执行
    
    // 从本地存储获取主题设置
    const theme = wx.getStorageSync('theme') || 'light';
    this.globalData.currentTheme = theme;
    
    // 从本地存储获取任务数据
    const tasks = wx.getStorageSync('tasks') || [];
    
    // 初始化时间显示
    this.updateTime();
  },
  
  // 更新时间的方法
  updateTime: function() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    
    // 在小程序中，我们不能直接更新DOM
    // 而是通过页面实例的setData方法更新数据
    // 这里我们可以设置一个全局变量，让页面定时获取
    this.globalData.currentTime = timeString;
    
    // 每秒更新一次时间
    setTimeout(() => {
      this.updateTime();
    }, 1000);
  },
  
  // 切换主题
  toggleTheme: function() {
    const newTheme = this.globalData.currentTheme === 'light' ? 'dark' : 'light';
    this.globalData.currentTheme = newTheme;
    wx.setStorageSync('theme', newTheme);
    
    // 通知页面主题已更改
    if (this.themeChangeCallback) {
      this.themeChangeCallback(newTheme);
    }
  }
});