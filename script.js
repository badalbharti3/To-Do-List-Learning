document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById("_input");
    const addTaskButton = document.getElementById("taskBtn");
    const todoList = document.getElementById("todo-list");
    
    // Add these elements to your HTML
    const container = document.querySelector('.container');
    
    // Create UI elements for additional features
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'actions';
    actionsDiv.innerHTML = `
        <div class="task-count">0 tasks</div>
        <div class="filters">
            <button class="filter-btn active" data-filter="all">All</button>
            <button class="filter-btn" data-filter="active">Active</button>
            <button class="filter-btn" data-filter="completed">Completed</button>
        </div>
        <button id="clear-completed">Clear Completed</button>
        <button id="theme-toggle">🌙</button>
    `;
    
    // Insert after the todo-list
    todoList.insertAdjacentElement('afterend', actionsDiv);
    
    // Add search input
    const searchDiv = document.createElement('div');
    searchDiv.className = 'search-container';
    searchDiv.innerHTML = `<input type="text" id="search-input" placeholder="Search tasks...">`;
    todoInput.parentElement.insertAdjacentElement('afterend', searchDiv);

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';
    
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.toggle('dark-theme', savedTheme === 'dark');
    themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    
    themeToggle.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-theme');
        themeToggle.textContent = isDark ? '☀️' : '🌙';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
    
    // Render existing tasks
    renderAllTasks();
    updateTaskCount();

    // Add new task
    addTaskButton.addEventListener("click", addNewTask);
    todoInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") addNewTask();
    });

    function addNewTask() {
        const taskText = todoInput.value.trim();
        if (taskText === "") {
            alert("Please add a task first.");
            return;
        }
        const newTask = {
            id: Date.now(),
            task: taskText,
            completed: false,
            date: new Date().toLocaleString(),
            priority: 'normal' // default priority
        };
        tasks.push(newTask);
        renderTask(newTask);
        saveTask();
        todoInput.value = "";
        updateTaskCount();
    }

    // Task interactions (delete, complete, edit)
    todoList.addEventListener('click', (e) => {
        const li = e.target.closest('li');
        if (!li) return;
        
        const taskId = parseInt(li.getAttribute('data-id'));
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        
        if (e.target.classList.contains('delete-btn')) {
            tasks.splice(taskIndex, 1);
            li.remove();
            saveTask();
            updateTaskCount();
        } 
        else if (e.target.classList.contains('complete-btn')) {
            tasks[taskIndex].completed = !tasks[taskIndex].completed;
            li.classList.toggle('completed', tasks[taskIndex].completed);
            e.target.textContent = tasks[taskIndex].completed ? '✓' : '○';
            saveTask();
            applyFilter(currentFilter);
            updateTaskCount();
        } 
        else if (e.target.classList.contains('edit-btn')) {
            const span = li.querySelector('.task-text');
            const currentText = span.textContent;
            const input = document.createElement('input');
            input.type = 'text';
            input.value = currentText;
            input.className = 'edit-input';
            
            span.replaceWith(input);
            input.focus();
            
            input.addEventListener('blur', function() {
                finishEditing(input, taskIndex);
            });
            
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    finishEditing(input, taskIndex);
                }
            });
        }
        else if (e.target.classList.contains('priority-btn')) {
            const priorities = ['low', 'normal', 'high'];
            const currentPriority = tasks[taskIndex].priority;
            const currentIndex = priorities.indexOf(currentPriority);
            const newIndex = (currentIndex + 1) % priorities.length;
            tasks[taskIndex].priority = priorities[newIndex];
            
            // Update priority button display
            e.target.className = `priority-btn ${priorities[newIndex]}`;
            e.target.setAttribute('title', `Priority: ${priorities[newIndex]}`);
            
            saveTask();
        }
    });
    
    function finishEditing(input, taskIndex) {
        const newText = input.value.trim();
        const span = document.createElement('span');
        span.className = 'task-text';
        
        if (newText !== '') {
            span.textContent = newText;
            tasks[taskIndex].task = newText;
            saveTask();
        } else {
            span.textContent = tasks[taskIndex].task;
        }
        
        input.replaceWith(span);
    }

    // Filter tasks
    document.querySelector('.filters').addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            e.target.classList.add('active');
            currentFilter = e.target.getAttribute('data-filter');
            applyFilter(currentFilter);
        }
    });
    
    // Clear completed
    document.getElementById('clear-completed').addEventListener('click', () => {
        tasks = tasks.filter(task => !task.completed);
        saveTask();
        renderAllTasks();
        updateTaskCount();
    });
    
    // Search functionality
    document.getElementById('search-input').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const items = todoList.querySelectorAll('li');
        
        items.forEach(item => {
            const taskText = item.querySelector('.task-text').textContent.toLowerCase();
            if (taskText.includes(searchTerm)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    });

    function renderTask(task) {
        const li = document.createElement("li");
        li.setAttribute('data-id', task.id);
        li.className = task.completed ? 'completed' : '';
        
        // Determine priority class
        const priorityClass = task.priority || 'normal';
        
        li.innerHTML = `
            <button class="complete-btn">${task.completed ? '✓' : '○'}</button>
            <div class="task-content">
                <span class="task-text">${task.task}</span>
                <span class="task-date">${task.date}</span>
            </div>
            <button class="priority-btn ${priorityClass}" title="Priority: ${priorityClass}"></button>
            <button class="edit-btn">✎</button>
            <button class="delete-btn">×</button>
        `;
        todoList.appendChild(li);
    }
    
    function renderAllTasks() {
        todoList.innerHTML = '';
        applyFilter(currentFilter);
    }
    
    function applyFilter(filter) {
        todoList.innerHTML = '';
        let filteredTasks;
        
        switch(filter) {
            case 'active':
                filteredTasks = tasks.filter(task => !task.completed);
                break;
            case 'completed':
                filteredTasks = tasks.filter(task => task.completed);
                break;
            default:
                filteredTasks = tasks;
        }
        
        filteredTasks.forEach(task => renderTask(task));
    }
    
    function updateTaskCount() {
        const activeCount = tasks.filter(task => !task.completed).length;
        document.querySelector('.task-count').textContent = `${activeCount} task${activeCount !== 1 ? 's' : ''} remaining`;
    }

    function saveTask() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
});


