// Task Management Application

// State Management
let tasks = [];
let editingTaskId = null;

// DOM Elements
const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const todayTaskList = document.getElementById('today-task-list');
const completedTaskList = document.getElementById('completed-task-list');
const createTaskBtn = document.getElementById('create-task-btn');
const updateTaskBtn = document.getElementById('update-task-btn');
const clearCompletedBtn = document.getElementById('clear-completed-btn');

// Event Listeners
document.addEventListener('DOMContentLoaded', initializeApp);
taskForm.addEventListener('submit', handleTaskCreation);
updateTaskBtn.addEventListener('click', updateTask);
clearCompletedBtn.addEventListener('click', clearAllCompletedTasks);

// Initialize Application
function initializeApp() {
    const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    tasks = storedTasks;
    renderAllTasks();
}

// Task Creation
function handleTaskCreation(event) {
    event.preventDefault();
    
    const title = document.getElementById('task-title').value;
    const priority = document.getElementById('task-priority').value;
    const category = document.getElementById('task-category').value;
    const notes = document.getElementById('task-notes').value;

    if (!title || !priority || !category) {
        alert('Please fill in all required fields');
        return;
    }

    const newTask = {
        id: Date.now(),
        title,
        priority,
        category,
        notes,
        isInToday: false,
        isCompleted: false
    };

    tasks.push(newTask);
    saveTasks();
    renderAllTasks();
    taskForm.reset();
}

// Task Rendering
function renderAllTasks() {
    taskList.innerHTML = '';
    todayTaskList.innerHTML = '';
    completedTaskList.innerHTML = '';

    tasks.forEach(task => {
        if (task.isCompleted) {
            renderCompletedTask(task);
        } else if (task.isInToday) {
            renderTodayTask(task);
        } else {
            renderTask(task);
        }
    });

    saveTasks();
}

function renderTask(task) {
    const taskElement = document.createElement('div');
    taskElement.className = 'task-item';
    taskElement.draggable = true;
    taskElement.dataset.taskId = task.id;

    taskElement.innerHTML = `
        <span>${task.title} (${task.priority} - ${task.category})</span>
        <div class="task-actions">
            <button onclick="editTask(${task.id})">Edit</button>
            <button onclick="deleteTask(${task.id})">Delete</button>
            <button onclick="addToToday(${task.id})">Add to Today</button>
        </div>
    `;

    taskElement.addEventListener('dragstart', drag);
    taskList.appendChild(taskElement);
}

function renderTodayTask(task) {
    const taskElement = document.createElement('div');
    taskElement.className = 'task-item';
    taskElement.draggable = true;
    taskElement.dataset.taskId = task.id;

    taskElement.innerHTML = `
        <span>${task.title} (${task.priority} - ${task.category})</span>
        <div class="task-actions">
            <button onclick="moveTaskUp(${task.id})">↑</button>
            <button onclick="moveTaskDown(${task.id})">↓</button>
            <button onclick="completeTask(${task.id})">Complete</button>
        </div>
    `;

    taskElement.addEventListener('dragstart', drag);
    todayTaskList.appendChild(taskElement);
}

function renderCompletedTask(task) {
    const taskElement = document.createElement('div');
    taskElement.className = 'task-item completed';
    taskElement.dataset.taskId = task.id;

    taskElement.innerHTML = `
        <span>${task.title} (${task.priority} - ${task.category})</span>
        <button onclick="removeCompletedTask(${task.id})">Remove</button>
    `;

    completedTaskList.appendChild(taskElement);
}

// Task Management Functions
function addToToday(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task && !task.isInToday) {
        task.isInToday = true;
        renderAllTasks();
    }
}

function completeTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.isCompleted = true;
        task.isInToday = false;
        renderAllTasks();
    }
}

function removeCompletedTask(taskId) {
    tasks = tasks.filter(t => t.id !== taskId);
    renderAllTasks();
}

function clearAllCompletedTasks() {
    tasks = tasks.filter(t => !t.isCompleted);
    renderAllTasks();
}

function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        document.getElementById('task-title').value = task.title;
        document.getElementById('task-priority').value = task.priority;
        document.getElementById('task-category').value = task.category;
        document.getElementById('task-notes').value = task.notes;

        createTaskBtn.style.display = 'none';
        updateTaskBtn.style.display = 'block';
        editingTaskId = taskId;
    }
}

function updateTask() {
    const task = tasks.find(t => t.id === editingTaskId);
    if (task) {
        task.title = document.getElementById('task-title').value;
        task.priority = document.getElementById('task-priority').value;
        task.category = document.getElementById('task-category').value;
        task.notes = document.getElementById('task-notes').value;

        createTaskBtn.style.display = 'block';
        updateTaskBtn.style.display = 'none';
        renderAllTasks();
        taskForm.reset();
        editingTaskId = null;
    }
}

function deleteTask(taskId) {
    tasks = tasks.filter(t => t.id !== taskId);
    renderAllTasks();
}

// Drag and Drop Functionality
function drag(event) {
    event.dataTransfer.setData('text/plain', event.target.dataset.taskId);
}

function allowDrop(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const taskId = parseInt(event.dataTransfer.getData('text/plain'));
    const task = tasks.find(t => t.id === taskId);

    if (event.target.closest('#today-task-list') && task && !task.isInToday) {
        task.isInToday = true;
        renderAllTasks();
    }
}

// Task Reordering
function moveTaskUp(taskId) {
    const todayTasks = tasks.filter(t => t.isInToday && !t.isCompleted);
    const index = todayTasks.findIndex(t => t.id === taskId);
    
    if (index > 0) {
        [todayTasks[index], todayTasks[index - 1]] = [todayTasks[index - 1], todayTasks[index]];
        renderAllTasks();
    }
}

function moveTaskDown(taskId) {
    const todayTasks = tasks.filter(t => t.isInToday && !t.isCompleted);
    const index = todayTasks.findIndex(t => t.id === taskId);
    
    if (index < todayTasks.length - 1) {
        [todayTasks[index], todayTasks[index + 1]] = [todayTasks[index + 1], todayTasks[index]];
        renderAllTasks();
    }
}

// Persistence
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
