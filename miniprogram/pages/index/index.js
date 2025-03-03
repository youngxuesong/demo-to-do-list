// index.js
const app = getApp();

Page({
  data: {
    currentTime: '--:--:--',
    quoteText: '加载中...',
    todos: [],
    filteredTodos: [],
    currentFilter: 'all',
    activeCount: 0,
    theme: 'light',
    exchangeRates: [],
    lastUpdatedTime: '--:--:--',
    exchangeRatesNote: '数据更新中...',
  },

  onLoad: function() {
    // 从本地存储加载任务数据
    const todos = wx.getStorageSync('todos') || [];
    this.setData({
      todos,
      filteredTodos: this.filterTodos(todos, 'all'),
      activeCount: todos.filter(todo => !todo.completed).length,
      theme: app.globalData.currentTheme
    });

    // 注册主题变更回调
    app.themeChangeCallback = theme => {
      this.setData({ theme });
    };

    // 启动定时器更新时间
    this.updateTime();
    // 获取一言
    this.fetchQuote();
    // 获取汇率数据
    this.fetchExchangeRates();
  },

  updateTime: function() {
    this.setData({
      currentTime: app.globalData.currentTime
    });
    setTimeout(() => {
      this.updateTime();
    }, 1000);
  },

  // 获取一言
  fetchQuote: async function() {
    try {
      const response = await wx.request({
        url: 'https://v1.hitokoto.cn',
        method: 'GET'
      });
      
      if (response.statusCode === 200) {
        this.setData({
          quoteText: response.data.hitokoto
        });
      } else {
        throw new Error('请求失败');
      }
    } catch (error) {
      console.error('获取一言失败:', error);
      // 使用备用名言
      const fallbackQuotes = app.globalData.fallbackQuotes;
      const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
      this.setData({
        quoteText: randomQuote
      });
    }
  },

  // 刷新一言
  refreshQuote: function() {
    this.fetchQuote();
  },

  // 添加任务
  addTodo: function(e) {
    const text = e.detail.value.todo.trim();
    if (!text) return;

    const todos = [...this.data.todos];
    const newTodo = {
      id: Date.now().toString(),
      text,
      completed: false,
      createTime: new Date().toISOString()
    };

    todos.unshift(newTodo);
    this.updateTodos(todos);
    
    // 清空输入框
    e.detail.value.todo = '';
  },

  // 切换任务状态
  toggleTodo: function(e) {
    const id = e.currentTarget.dataset.id;
    const todos = this.data.todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    this.updateTodos(todos);
  },

  // 删除任务
  deleteTodo: function(e) {
    const id = e.currentTarget.dataset.id;
    const todos = this.data.todos.filter(todo => todo.id !== id);
    this.updateTodos(todos);
  },

  // 清除已完成的任务
  clearCompleted: function() {
    const todos = this.data.todos.filter(todo => !todo.completed);
    this.updateTodos(todos);
  },

  // 筛选任务
  filterTodos: function(todos, filter) {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  },

  // 更新筛选器
  updateFilter: function(e) {
    const filter = e.currentTarget.dataset.filter;
    this.setData({
      currentFilter: filter,
      filteredTodos: this.filterTodos(this.data.todos, filter)
    });
  },

  // 更新任务列表
  updateTodos: function(todos) {
    const activeCount = todos.filter(todo => !todo.completed).length;
    this.setData({
      todos,
      filteredTodos: this.filterTodos(todos, this.data.currentFilter),
      activeCount
    });
    wx.setStorageSync('todos', todos);
  },

  // 获取汇率数据
  fetchExchangeRates: async function() {
    try {
      const response = await wx.request({
        url: 'https://open.er-api.com/v6/latest/CNY',
        method: 'GET'
      });

      if (response.statusCode === 200) {
        const rates = response.data.rates;
        const exchangeRates = app.globalData.currencyPairs.map(pair => ({
          name: pair.name,
          value: (1 / rates[pair.base]).toFixed(4)
        }));

        const now = new Date();
        this.setData({
          exchangeRates,
          lastUpdatedTime: now.toLocaleTimeString('zh-CN'),
          exchangeRatesNote: '数据来源: ExchangeRate-API'
        });
      } else {
        throw new Error('请求失败');
      }
    } catch (error) {
      console.error('获取汇率数据失败:', error);
      // 使用备用数据
      const fallbackRates = app.globalData.fallbackRates;
      const exchangeRates = Object.entries(fallbackRates).map(([pair, value]) => ({
        name: pair.replace('/', ' / '),
        value: value.toFixed(4)
      }));

      this.setData({
        exchangeRates,
        lastUpdatedTime: new Date().toLocaleTimeString('zh-CN'),
        exchangeRatesNote: '当前显示为离线备用数据'
      });
    }
  },

  // 刷新汇率
  refreshRates: function() {
    this.fetchExchangeRates();
  }
}));