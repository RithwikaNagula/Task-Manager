class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.currentFilter = 'all';
        this.currentSort = 'priority';
        this.isDarkMode = localStorage.getItem('darkMode') === 'true';
        this.init();
    }

    init() {
        // Initialize event listeners
        document.getElementById('taskForm').addEventListener('submit', (e) => this.addTask(e));
        document.getElementById('toggleTheme').addEventListener('click', () => this.toggleTheme());
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.filterTasks(e));
        });
        document.getElementById('sortTasks').addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.renderTasks();
        });

        // Initialize dark mode
        if (this.isDarkMode) {
            document.body.setAttribute('data-theme', 'dark');
        }

        this.renderTasks();
    }

    addTask(e) {
        e.preventDefault();
        const title = document.getElementById('taskTitle').value;
        const description = document.getElementById('taskDescription').value;
        const dueDate = document.getElementById('taskDueDate').value;
        const priority = document.getElementById('taskPriority').value;

        const task = {
            id: Date.now(),
            title,
            description,
            dueDate,
            priority,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.push(task);
        this.saveTasks();
        this.renderTasks();
        e.target.reset();
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
        this.renderTasks();
    }

    toggleTaskStatus(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
        }
    }

    editTask(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            const newTitle = prompt('Edit task title:', task.title);
            const newDescription = prompt('Edit task description:', task.description);
            if (newTitle !== null && newDescription !== null) {
                task.title = newTitle;
                task.description = newDescription;
                this.saveTasks();
                this.renderTasks();
            }
        }
    }

    filterTasks(e) {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        this.currentFilter = e.target.dataset.filter;
        this.renderTasks();
    }

    sortTasks(tasks) {
        return tasks.sort((a, b) => {
            if (this.currentSort === 'priority') {
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            } else {
                return new Date(a.dueDate) - new Date(b.dueDate);
            }
        });
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        document.body.setAttribute('data-theme', this.isDarkMode ? 'dark' : 'light');
        localStorage.setItem('darkMode', this.isDarkMode);
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    renderTasks() {
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '';

        let filteredTasks = this.tasks;
        if (this.currentFilter === 'completed') {
            filteredTasks = this.tasks.filter(task => task.completed);
        } else if (this.currentFilter === 'pending') {
            filteredTasks = this.tasks.filter(task => !task.completed);
        }

        const sortedTasks = this.sortTasks(filteredTasks);

        sortedTasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
            taskElement.innerHTML = `
                <div class="task-header">
                    <h3 class="task-title">${task.title}</h3>
                    <div class="task-actions">
                        <button onclick="taskManager.toggleTaskStatus(${task.id})">
                            <i class="fas ${task.completed ? 'fa-undo' : 'fa-check'}"></i>
                        </button>
                        <button onclick="taskManager.editTask(${task.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="taskManager.deleteTask(${task.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <p>${task.description}</p>
                <div class="task-footer">
                    <span class="priority-badge priority-${task.priority}">${task.priority}</span>
                    ${task.dueDate ? `<span class="due-date">Due: ${new Date(task.dueDate).toLocaleDateString()}</span>` : ''}
                </div>
            `;
            taskList.appendChild(taskElement);
        });
    }
}

// Initialize the Task Manager
const taskManager = new TaskManager(); 