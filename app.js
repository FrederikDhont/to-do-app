// Task Management App

// DOM Elements
const taskForm = document.getElementById('task-form');
const taskTitle = document.getElementById('task-title');
const taskPriority = document.getElementById('task-priority');
const taskCategory = document.getElementById('task-category');
const taskNotes = document.getElementById('task-notes');
const allTasksList = document.getElementById('all-tasks');
const todaysTasksList = document.getElementById('todays-tasks');
const completedTasksList = document.getElementById('completed-tasks');
const clearCompletedBtn = document.getElementById('clear-completed');

// Task arrays
let allTasks = [];
let todaysTasks = [];
let completedTasks = [];

// Load tasks from localStorage
function loadTasks() {
    const savedAllTasks = localStorage.getItem('allTasks');
    const savedTodaysTasks = localStorage.getItem('todaysTasks');
    const savedCompletedTasks = localStorage.getItem('completedTasks');

    if (savedAllTasks) allTasks = JSON.parse(savedAllTasks);
    if (savedTodaysTasks) todaysTasks = JSON.parse(savedTodaysTasks);
    if (savedCompletedTasks) completedTasks = JSON.parse(savedCompletedTasks);

    renderTasks();
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('allTasks', JSON.stringify(allTasks));
    localStorage.setItem('todaysTasks', JSON.stringify(todaysTasks));
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
}

// Render tasks in the respective lists
function renderTasks() {
    renderAllTasks();
    renderTodaysTasks();
    renderCompletedTasks();
}

// Render all tasks
function renderAllTasks() {
    allTasksList.innerHTML = '';
    allTasks.forEach((task, index) => {
        const li = createTaskElement(task, index, 'all');
        allTasksList.appendChild(li);
    });
}

// Render today's tasks
function renderTodaysTasks() {
    todaysTasksList.innerHTML = '';
    todaysTasks.forEach((task, index) => {
        const li = createTaskElement(task, index, 'today');
        todaysTasksList.appendChild(li);
    });
}

// Render completed tasks
function renderCompletedTasks() {
    completedTasksList.innerHTML = '';
    completedTasks.forEach((task, index) => {
        const li = createTaskElement(task, index, 'completed');
        completedTasksList.appendChild(li);
    });
}

// Create a task element
function createTaskElement(task, index, listType) {
    const li = document.createElement('li');
    li.innerHTML = `
        <span>${task.title} (${task.priority} - ${task.category})</span>
        <div class="task-actions">
            ${listType === 'all' ? `<button onclick="addToToday(${index})">Add to Today</button>` : ''}
            ${listType === 'today' ? `
                <button onclick="moveUp(${index})">↑</button>
                <button onclick="moveDown(${index})">↓</button>
                <button onclick="completeTask(${index})">Complete</button>
            ` : ''}
            ${listType === 'completed' ? `<button onclick="removeCompleted(${index})">Remove</button>` : ''}
            <button onclick="editTask(${index}, '${listType}')">Edit</button>
            ${listType === 'all' ? `<button onclick="deleteTask(${index})">Delete</button>` : ''}
        </div>
    `;
    li.draggable = true;
    li.addEventListener('dragstart', dragStart);
    li.addEventListener('dragover', dragOver);
    li.addEventListener('drop', drop);
    return li;
}

// Add a new task
function addTask(event) {
    event.preventDefault();
    if (!taskTitle.value || !taskPriority.value || !taskCategory.value) {
        alert('Please fill in all required fields.');
        return;
    }
    const newTask = {
        title: taskTitle.value,
        priority: taskPriority.value,
        category: taskCategory.value,
        notes: taskNotes.value
    };
    allTasks.push(newTask);
    saveTasks();
    renderTasks();
    taskForm.reset();
}

// Add task to today's list
function addToToday(index) {
    const task = allTasks[index];
    if (!todaysTasks.some(t => t.title === task.title)) {
        todaysTasks.push(task);
        saveTasks();
        renderTasks();
    } else {
        alert('This task is already in Today\'s To-Do\'s.');
    }
}

// Move task up in today's list
function moveUp(index) {
    if (index > 0) {
        [todaysTasks[index], todaysTasks[index - 1]] = [todaysTasks[index - 1], todaysTasks[index]];
        saveTasks();
        renderTodaysTasks();
    }
}

// Move task down in today's list
function moveDown(index) {
    if (index < todaysTasks.length - 1) {
        [todaysTasks[index], todaysTasks[index + 1]] = [todaysTasks[index + 1], todaysTasks[index]];
        saveTasks();
        renderTodaysTasks();
    }
}

// Complete a task
function completeTask(index) {
    const task = todaysTasks.splice(index, 1)[0];
    completedTasks.push(task);
    saveTasks();
    renderTasks();
}

// Remove a completed task
function removeCompleted(index) {
    completedTasks.splice(index, 1);
    saveTasks();
    renderCompletedTasks();
}

// Clear all completed tasks
function clearAllCompleted() {
    completedTasks = [];
    saveTasks();
    renderCompletedTasks();
}

// Edit a task
function editTask(index, listType) {
    let task;
    if (listType === 'all') {
        task = allTasks[index];
    } else if (listType === 'today') {
        task = todaysTasks[index];
    } else {
        task = completedTasks[index];
    }

    taskTitle.value = task.title;
    taskPriority.value = task.priority;
    taskCategory.value = task.category;
    taskNotes.value = task.notes;

    const updateButton = document.createElement('button');
    updateButton.textContent = 'Update Task';
    updateButton.onclick = function() {
        task.title = taskTitle.value;
        task.priority = taskPriority.value;
        task.category = taskCategory.value;
        task.notes = taskNotes.value;

        saveTasks();
        renderTasks();
        taskForm.removeChild(updateButton);
        taskForm.reset();
    };

    taskForm.appendChild(updateButton);
}

// Delete a task
function deleteTask(index) {
    allTasks.splice(index, 1);
    saveTasks();
    renderAllTasks();
}

// Drag and drop functionality
function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.innerHTML);
    e.dataTransfer.effectAllowed = 'move';
}

function dragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function drop(e) {
    e.preventDefault();
    const data = e.dataTransfer.getData('text');
    const draggedElement = document.querySelector(`li:contains('${data}')`);
    const dropTarget = e.target.closest('li');

    if (draggedElement && dropTarget && draggedElement !== dropTarget) {
        const list = dropTarget.parentNode;
        const fromIndex = Array.from(list.children).indexOf(draggedElement);
        const toIndex = Array.from(list.children).indexOf(dropTarget);

        if (list.id === 'todays-tasks') {
            [todaysTasks[fromIndex], todaysTasks[toIndex]] = [todaysTasks[toIndex], todaysTasks[fromIndex]];
            saveTasks();
            renderTodaysTasks();
        }
    }
}

// Event listeners
taskForm.addEventListener('submit', addTask);
clearCompletedBtn.addEventListener('click', clearAllCompleted);

// Initial load
loadTasks();
