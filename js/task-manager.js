// 任务管理增强功能

// 任务优先级配置
const priorities = {
    low: {
        name: '低',
        color: '#74b9ff',
        icon: 'fa-arrow-down'
    },
    medium: {
        name: '中',
        color: '#fdcb6e',
        icon: 'fa-minus'
    },
    high: {
        name: '高',
        color: '#e74c3c',
        icon: 'fa-arrow-up'
    }
};

// 任务分类标签
const categories = [
    { id: 'work', name: '工作', color: '#0984e3', icon: 'fa-briefcase' },
    { id: 'personal', name: '个人', color: '#00b894', icon: 'fa-user' },
    { id: 'study', name: '学习', color: '#6c5ce7', icon: 'fa-book' },
    { id: 'health', name: '健康', color: '#e84393', icon: 'fa-heartbeat' },
    { id: 'shopping', name: '购物', color: '#00cec9', icon: 'fa-shopping-cart' },
    { id: 'other', name: '其他', color: '#636e72', icon: 'fa-tag' }
];

// 初始化任务管理增强功能
function initTaskManager() {
    // 创建任务表单增强元素
    createTaskFormEnhancements();
    
    // 添加任务详情展开功能
    addTaskDetailsToggle();
    
    // 添加任务完成动画和音效
    addTaskCompletionEffects();
    
    // 添加数据导出和备份功能
    addDataExportFeature();
}

// 创建任务表单增强元素
function createTaskFormEnhancements() {
    const todoForm = document.getElementById('todo-form');
    const addButton = document.getElementById('add-button');
    
    // 创建任务增强控件容器
    const enhancementsContainer = document.createElement('div');
    enhancementsContainer.className = 'task-enhancements';
    enhancementsContainer.innerHTML = `
        <div class="task-options">
            <div class="task-option priority-option">
                <button type="button" id="priority-toggle" class="option-toggle" title="设置优先级">
                    <i class="fas fa-flag"></i>
                </button>
                <div class="option-dropdown priority-dropdown" id="priority-dropdown">
                    <div class="dropdown-title">优先级</div>
                    <div class="priority-options">
                        <button type="button" class="priority-btn" data-priority="low">
                            <i class="fas fa-arrow-down"></i> 低
                        </button>
                        <button type="button" class="priority-btn" data-priority="medium">
                            <i class="fas fa-minus"></i> 中
                        </button>
                        <button type="button" class="priority-btn" data-priority="high">
                            <i class="fas fa-arrow-up"></i> 高
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="task-option date-option">
                <button type="button" id="date-toggle" class="option-toggle" title="设置截止日期">
                    <i class="far fa-calendar-alt"></i>
                </button>
                <div class="option-dropdown date-dropdown" id="date-dropdown">
                    <div class="dropdown-title">截止日期</div>
                    <input type="date" id="due-date-input" class="due-date-input">
                    <div class="quick-dates">
                        <button type="button" class="quick-date-btn" data-days="0">今天</button>
                        <button type="button" class="quick-date-btn" data-days="1">明天</button>
                        <button type="button" class="quick-date-btn" data-days="7">一周后</button>
                    </div>
                </div>
            </div>
            
            <div class="task-option category-option">
                <button type="button" id="category-toggle" class="option-toggle" title="设置分类">
                    <i class="fas fa-tag"></i>
                </button>
                <div class="option-dropdown category-dropdown" id="category-dropdown">
                    <div class="dropdown-title">分类标签</div>
                    <div class="category-options">
                        ${categories.map(cat => `
                            <button type="button" class="category-btn" data-category="${cat.id}" style="color: ${cat.color}">
                                <i class="fas ${cat.icon}"></i> ${cat.name}
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
        
        <div class="selected-options" id="selected-options">
            <span class="no-options-selected">默认设置</span>
        </div>
    `;
    
    // 插入增强控件到表单中
    todoForm.insertBefore(enhancementsContainer, addButton);
    
    // 添加事件监听器
    setupTaskEnhancementListeners();
}

// 设置任务增强功能的事件监听器
function setupTaskEnhancementListeners() {
    // 优先级选择
    const priorityToggle = document.getElementById('priority-toggle');
    const priorityDropdown = document.getElementById('priority-dropdown');
    const priorityButtons = document.querySelectorAll('.priority-btn');
    
    priorityToggle.addEventListener('click', () => {
        priorityDropdown.classList.toggle('show');
        document.getElementById('date-dropdown').classList.remove('show');
        document.getElementById('category-dropdown').classList.remove('show');
    });
    
    priorityButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const priority = btn.getAttribute('data-priority');
            setSelectedPriority(priority);
            priorityDropdown.classList.remove('show');
        });
    });
    
    // 截止日期选择
    const dateToggle = document.getElementById('date-toggle');
    const dateDropdown = document.getElementById('date-dropdown');
    const dueDateInput = document.getElementById('due-date-input');
    const quickDateButtons = document.querySelectorAll('.quick-date-btn');
    
    dateToggle.addEventListener('click', () => {
        dateDropdown.classList.toggle('show');
        document.getElementById('priority-dropdown').classList.remove('show');
        document.getElementById('category-dropdown').classList.remove('show');
    });
    
    dueDateInput.addEventListener('change', () => {
        setSelectedDueDate(dueDateInput.value);
    });
    
    quickDateButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const daysToAdd = parseInt(btn.getAttribute('data-days'));
            const date = new Date();
            date.setDate(date.getDate() + daysToAdd);
            
            // 格式化日期为YYYY-MM-DD
            const formattedDate = date.toISOString().split('T')[0];
            dueDateInput.value = formattedDate;
            setSelectedDueDate(formattedDate);
            dateDropdown.classList.remove('show');
        });
    });
    
    // 分类标签选择
    const categoryToggle = document.getElementById('category-toggle');
    const categoryDropdown = document.getElementById('category-dropdown');
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    categoryToggle.addEventListener('click', () => {
        categoryDropdown.classList.toggle('show');
        document.getElementById('priority-dropdown').classList.remove('show');
        document.getElementById('date-dropdown').classList.remove('show');
    });
    
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category');
            setSelectedCategory(category);
            categoryDropdown.classList.remove('show');
        });
    });
    
    // 点击其他区域关闭下拉菜单
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.task-option')) {
            document.querySelectorAll('.option-dropdown').forEach(dropdown => {
                dropdown.classList.remove('show');
            });
        }
    });
    
    // 添加移除选项的事件监听
    document.addEventListener('click', (e) => {
        if (e.target.closest('.remove-option')) {
            const removeBtn = e.target.closest('.remove-option');
            const optionType = removeBtn.getAttribute('data-remove');
            removeSelectedOption(optionType);
        }
    });
}

// 设置选中的优先级
function setSelectedPriority(priority) {
    const selectedOptions = document.getElementById('selected-options');
    let priorityElement = selectedOptions.querySelector('.selected-priority');
    
    if (!priorityElement) {
        priorityElement = document.createElement('span');
        priorityElement.className = 'selected-option selected-priority';
        selectedOptions.appendChild(priorityElement);
    }
    
    const priorityInfo = priorities[priority];
    priorityElement.innerHTML = `
        <i class="fas ${priorityInfo.icon}" style="color: ${priorityInfo.color}"></i>
        ${priorityInfo.name}优先级
        <button type="button" class="remove-option" data-remove="priority">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // 保存到临时存储
    window.taskOptions = window.taskOptions || {};
    window.taskOptions.priority = priority;
    
    // 移除"默认设置"文本
    removeDefaultText();
}

// 设置选中的截止日期
function setSelectedDueDate(dateStr) {
    const selectedOptions = document.getElementById('selected-options');
    let dateElement = selectedOptions.querySelector('.selected-date');
    
    if (!dateElement) {
        dateElement = document.createElement('span');
        dateElement.className = 'selected-option selected-date';
        selectedOptions.appendChild(dateElement);
    }
    
    // 格式化日期显示
    const date = new Date(dateStr);
    const formattedDate = date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
    
    dateElement.innerHTML = `
        <i class="far fa-calendar-alt" style="color: #4dabf7"></i>
        ${formattedDate}
        <button type="button" class="remove-option" data-remove="date">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // 保存到临时存储
    window.taskOptions = window.taskOptions || {};
    window.taskOptions.dueDate = dateStr;
    
    // 移除"默认设置"文本
    removeDefaultText();
}

// 设置选中的分类
function setSelectedCategory(categoryId) {
    const selectedOptions = document.getElementById('selected-options');
    let categoryElement = selectedOptions.querySelector('.selected-category');
    
    if (!categoryElement) {
        categoryElement = document.createElement('span');
        categoryElement.className = 'selected-option selected-category';
        selectedOptions.appendChild(categoryElement);
    }
    
    const category = categories.find(cat => cat.id === categoryId);
    categoryElement.innerHTML = `
        <i class="fas ${category.icon}" style="color: ${category.color}"></i>
        ${category.name}
        <button type="button" class="remove-option" data-remove="category">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // 保存到临时存储
    window.taskOptions = window.taskOptions || {};
    window.taskOptions.category = categoryId;
    
    // 移除"默认设置"文本
    removeDefaultText();
}

// 移除选中的选项
function removeSelectedOption(optionType) {
    const selectedOptions = document.getElementById('selected-options');
    const optionElement = selectedOptions.querySelector(`.selected-${optionType}`);
    
    if (optionElement) {
        selectedOptions.removeChild(optionElement);
        
        // 从临时存储中移除
        if (window.taskOptions) {
            delete window.taskOptions[optionType];
        }
        
        // 如果没有选项了，显示默认文本
        if (selectedOptions.children.length === 0) {
            const defaultText = document.createElement('span');
            defaultText.className = 'no-options-selected';
            defaultText.textContent = '默认设置';
            selectedOptions.appendChild(defaultText);
        }
    }
}

// 移除默认文本
function removeDefaultText() {
    const selectedOptions = document.getElementById('selected-options');
    const defaultText = selectedOptions.querySelector('.no-options-selected');
    
    if (defaultText) {
        selectedOptions.removeChild(defaultText);
    }
}

// 添加任务详情展开功能
function addTaskDetailsToggle() {
    // 监听任务列表的点击事件，排除复选框和删除按钮
    document.getElementById('todo-list').addEventListener('click', (e) => {
        // 如果点击的是复选框或删除按钮，不执行展开
        if (e.target.closest('.todo-checkbox') || e.target.closest('.delete-btn')) {
            return;
        }
        
        // 获取被点击的任务项
        const todoItem = e.target.closest('.todo-item');
        if (todoItem) {
            // 切换展开状态
            todoItem.classList.toggle('expanded');
            
            // 如果任务项没有详情区域，则创建
            if (!todoItem.querySelector('.todo-details')) {
                const todoId = parseInt(todoItem.getAttribute('data-id'));
                const todo = todos.find(t => t.id === todoId);
                
                if (todo) {
                    // 创建详情区域
                    const detailsElement = document.createElement('div');
                    detailsElement.className = 'todo-details';
                    
                    // 获取任务的附加信息
                    const priority = todo.priority ? priorities[todo.priority].name : '无';
                    const dueDate = todo.dueDate ? new Date(todo.dueDate).toLocaleDateString('zh-CN') : '无';
                    const category = todo.category ? categories.find(c => c.id === todo.category).name : '无';
                    
                    // 设置详情内容
                    detailsElement.innerHTML = `
                        <div><strong>优先级：</strong> ${priority}</div>
                        <div><strong>截止日期：</strong> ${dueDate}</div>
                        <div><strong>分类：</strong> ${category}</div>
                        <div><strong>创建时间：</strong> ${new Date(todo.id).toLocaleString('zh-CN')}</div>
                    `;
                    
                    todoItem.appendChild(detailsElement);
                }
            }
        }
    });
    
    // 修改添加任务函数，支持任务增强选项
    const originalAddTodo = window.addTodo;
    window.addTodo = function(text) {
        // 获取任务增强选项
        const options = window.taskOptions || {};
        
        const newTodo = {
            id: Date.now(),
            text: text,
            completed: false,
            priority: options.priority,
            dueDate: options.dueDate,
            category: options.category
        };
        
        // 添加到任务列表
        todos.unshift(newTodo);
        saveTodos();
        renderTodos();
        
        // 添加动画效果
        const firstItem = todoList.firstElementChild;
        if (firstItem) {
            firstItem.classList.add('new-item');
            setTimeout(() => {
                firstItem.classList.remove('new-item');
            }, 500);
        }
        
        // 清除临时选项
        window.taskOptions = {};
        document.getElementById('selected-options').innerHTML = '<span class="no-options-selected">默认设置</span>';
    };
    
    // 修改渲染函数，支持任务ID属性
    const originalRenderTodos = window.renderTodos;
    window.renderTodos = function() {
        // 调用原始渲染函数
        originalRenderTodos();
        
        // 为每个任务项添加ID属性
        const todoItems = document.querySelectorAll('.todo-item');
        todoItems.forEach((item, index) => {
            const filteredTodos = todos.filter(todo => {
                if (currentFilter === 'all') return true;
                if (currentFilter === 'active') return !todo.completed;
                if (currentFilter === 'completed') return todo.completed;
                return true;
            });
            
            if (index < filteredTodos.length) {
                item.setAttribute('data-id', filteredTodos[index].id);
            }
        });
    };
}

// 添加任务完成动画和音效
function addTaskCompletionEffects() {
    // 创建音效元素
    const completionSound = document.createElement('audio');
    completionSound.src = 'sounds/complete.mp3';
    completionSound.volume = 0.3;
    document.body.appendChild(completionSound);
    
    // 修改切换任务状态函数
    const originalToggleTodo = window.toggleTodo;
    window.toggleTodo = function(id) {
        // 获取任务的原始状态
        const todo = todos.find(t => t.id === id);
        const wasCompleted = todo ? todo.completed : false;
        
        // 调用原始切换函数
        originalToggleTodo(id);
        
        // 如果任务从未完成变为已完成，播放音效和动画
        if (!wasCompleted && todo && todo.completed) {
            // 播放完成音效
            completionSound.currentTime = 0;
            completionSound.play().catch(err => console.log('音效播放失败:', err));
            
            // 添加完成动画
            const todoItem = document.querySelector(`.todo-item[data-id="${id}"]`);
            if (todoItem) {
                todoItem.classList.add('completion-animation');
                setTimeout(() => {
                    todoItem.classList.remove('completion-animation');
                }, 1000);
            }
        }
    };
    
    // 添加完成动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes completionPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .completion-animation {
            animation: completionPulse 0.5s ease-in-out;
        }
    `;
    document.head.appendChild(style);
}

// 添加数据导出和备份功能
function addDataExportFeature() {
    // 创建导出/导入按钮
    const todoStats = document.querySelector('.todo-stats');
    const exportButton = document.createElement('button');
    exportButton.id = 'export-todos';
    exportButton.innerHTML = '<i class="fas fa-download"></i> 导出数据';
    exportButton.className = 'export-btn';
    exportButton.title = '导出待办事项数据';
    
    const importButton = document.createElement('button');
    importButton.id = 'import-todos';
    importButton.innerHTML = '<i class="fas fa-upload"></i> 导入数据';
    importButton.className = 'import-btn';
    importButton.title = '导入待办事项数据';
    
    // 创建按钮容器
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'data-buttons';
    buttonsContainer.appendChild(exportButton);
    buttonsContainer.appendChild(importButton);
    
    // 添加到DOM
    todoStats.parentNode.insertBefore(buttonsContainer, todoStats.nextSibling);
    
    // 添加导出功能
    exportButton.addEventListener('click', () => {
        // 获取所有待办事项数据
        const data = JSON.stringify(todos, null, 2);
        
        // 创建Blob对象
        const blob = new Blob([data], { type: 'application/json' });
        
        // 创建下载链接
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `todo-list-backup-${new Date().toISOString().slice(0, 10)}.json`;
        
        // 触发下载
        document.body.appendChild(a);
        a.click();
        
        // 清理
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 0);
    });
    
    // 添加导入功能
    importButton.addEventListener('click', () => {
        // 创建文件输入元素
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        
        // 监听文件选择
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    // 解析JSON数据
                    const importedTodos = JSON.parse(event.target.result);
                    
                    // 验证数据格式
                    if (Array.isArray(importedTodos) && importedTodos.every(todo => 
                        typeof todo === 'object' && 'id' in todo && 'text' in todo && 'completed' in todo
                    )) {
                        // 更新待办事项列表
                        todos = importedTodos;
                        saveTodos();
                        renderTodos();
                        
                        alert('数据导入成功！');
                    } else {
                        alert('导入失败：无效的数据格式');
                    }
                } catch (error) {
                    console.error('导入数据解析失败:', error);
                    alert('导入失败：无法解析文件');
                }
            };
            
            reader.readAsText(file);
        });
        
        // 触发文件选择
        fileInput.click();
    });
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .data-buttons {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-top: 20px;
        }
        
        .export-btn, .import-btn {
            background-color: transparent;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 8px 15px;
            cursor: pointer;
            transition: all 0.3s;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .export-btn:hover, .import-btn:hover {
            background-color: #f8f9fa;
            transform: translateY(-2px);
        }
        
        .export-btn i {
            color: #4dabf7;
        }
        
        .import-btn i {
            color: #20c997;
        }
    `;
    document.head.appendChild(style);
}