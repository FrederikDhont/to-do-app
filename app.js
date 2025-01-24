// Task Management App

// Sort tasks by priority
function sortTasks() {
  const priorityOrder = { High: 3, Medium: 2, Low: 1 }
  todaysTasks.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])
  saveData()
  renderTodaysTasks()
}

// Unschedule a task
function unscheduleTask(index) {
  const task = todaysTasks.splice(index, 1)[0]
  unscheduledTasks.push(task)
  saveData()
  renderTasks()
}

// Toggle category management section
function toggleCategoryManagement() {
  const content = document.querySelector(".collapse-content")
  if (content.style.maxHeight) {
    content.style.maxHeight = null
  } else {
    content.style.maxHeight = content.scrollHeight + "px"
  }
}

// Rename category
function renameCategory(index) {
  const newName = prompt("Enter new category name:")
  if (newName && newName.trim() !== "" && !categories.includes(newName)) {
    const oldName = categories[index]
    categories[index] = newName

    // Update category for all tasks
    ;[unscheduledTasks, todaysTasks, completedTasks].forEach((taskList) => {
      taskList.forEach((task) => {
        if (task.category === oldName) {
          task.category = newName
        }
      })
    })

    saveData()
    renderCategories()
    renderTasks()
  } else if (categories.includes(newName)) {
    alert("Category name already exists.")
  }
}

// DOM Elements
const taskForm = document.getElementById("task-form")
const taskTitle = document.getElementById("task-title")
const taskPriority = document.getElementById("task-priority")
const taskCategory = document.getElementById("task-category")
const unscheduledTasksList = document.getElementById("unscheduled-tasks")
const todaysTasksList = document.getElementById("todays-tasks")
const completedTasksList = document.getElementById("completed-tasks")
const clearCompletedBtn = document.getElementById("clear-completed")
const categoryForm = document.getElementById("category-form")
const newCategoryInput = document.getElementById("new-category")
const categoryList = document.getElementById("category-list")

// Task arrays
let unscheduledTasks = []
let todaysTasks = []
let completedTasks = []
let categories = ["Work", "Chore", "Band", "School", "Family", "Other"]

// Load tasks and categories from localStorage
function loadData() {
  const savedUnscheduledTasks = localStorage.getItem("unscheduledTasks")
  const savedTodaysTasks = localStorage.getItem("todaysTasks")
  const savedCompletedTasks = localStorage.getItem("completedTasks")
  const savedCategories = localStorage.getItem("categories")

  if (savedUnscheduledTasks) unscheduledTasks = JSON.parse(savedUnscheduledTasks)
  if (savedTodaysTasks) todaysTasks = JSON.parse(savedTodaysTasks)
  if (savedCompletedTasks) completedTasks = JSON.parse(savedCompletedTasks)
  if (savedCategories) categories = JSON.parse(savedCategories)

  renderTasks()
  renderCategories()
  resetTaskForm()
}

// Save tasks and categories to localStorage
function saveData() {
  localStorage.setItem("unscheduledTasks", JSON.stringify(unscheduledTasks))
  localStorage.setItem("todaysTasks", JSON.stringify(todaysTasks))
  localStorage.setItem("completedTasks", JSON.stringify(completedTasks))
  localStorage.setItem("categories", JSON.stringify(categories))
}

// Render tasks in the respective lists
function renderTasks() {
  renderUnscheduledTasks()
  renderTodaysTasks()
  renderCompletedTasks()
}

// Render unscheduled tasks
function renderUnscheduledTasks() {
  unscheduledTasksList.innerHTML = ""
  unscheduledTasks.forEach((task, index) => {
    const li = createTaskElement(task, index, "unscheduled")
    unscheduledTasksList.appendChild(li)
  })
}

// Render today's tasks
function renderTodaysTasks() {
  todaysTasksList.innerHTML = ""
  todaysTasks.forEach((task, index) => {
    const li = createTaskElement(task, index, "today")
    todaysTasksList.appendChild(li)
  })
}

// Render completed tasks
function renderCompletedTasks() {
  completedTasksList.innerHTML = ""
  completedTasks.forEach((task, index) => {
    const li = createTaskElement(task, index, "completed")
    completedTasksList.appendChild(li)
  })
}

// Create a task element
function createTaskElement(task, index, listType) {
  const li = document.createElement("li")
  const priorityEmoji = task.priority === "High" ? "🔴" : task.priority === "Medium" ? "🟡" : "🟢"
  li.innerHTML = `
        <div class="task-main">
            <span>${listType === "today" ? priorityEmoji : ""} ${task.title}</span>
            <div class="task-actions">
                ${listType === "unscheduled" ? `<button onclick="addToToday(${index})">Add to Today</button>` : ""}
                ${
                  listType === "today"
                    ? `
                    <button onclick="moveUp(${index})">↑</button>
                    <button onclick="moveDown(${index})">↓</button>
                    <button onclick="completeTask(${index})">Complete</button>
                    <button onclick="unscheduleTask(${index})">Unschedule</button>
                `
                    : ""
                }
                ${listType === "completed" ? `<button onclick="removeCompleted(${index})">Remove</button>` : ""}
                <button onclick="editTask(${index}, '${listType}')">Edit</button>
                ${listType === "unscheduled" ? `<button onclick="deleteTask(${index})">Delete</button>` : ""}
            </div>
        </div>
        <div class="task-meta">
            Priority: ${task.priority} | Category: ${task.category}
        </div>
    `
  li.draggable = true
  li.addEventListener("dragstart", dragStart)
  li.addEventListener("dragover", dragOver)
  li.addEventListener("drop", drop)
  return li
}

// Add a new task
function addTask(event) {
  event.preventDefault()
  if (!taskTitle.value || !taskPriority.value || !taskCategory.value) {
    alert("Please fill in all required fields.")
    return
  }
  const newTask = {
    title: taskTitle.value,
    priority: taskPriority.value,
    category: taskCategory.value,
  }
  unscheduledTasks.push(newTask)
  saveData()
  renderTasks()
  taskForm.reset()
}

// Add task to today's list
function addToToday(index) {
  const task = unscheduledTasks[index]
  if (!todaysTasks.some((t) => t.title === task.title)) {
    todaysTasks.push(task)
    unscheduledTasks.splice(index, 1)
    saveData()
    renderTasks()
  } else {
    alert("This task is already in Today's To-Do's.")
  }
}

// Move task up in today's list
function moveUp(index) {
  if (index > 0) {
    ;[todaysTasks[index], todaysTasks[index - 1]] = [todaysTasks[index - 1], todaysTasks[index]]
    saveData()
    renderTodaysTasks()
  }
}

// Move task down in today's list
function moveDown(index) {
  if (index < todaysTasks.length - 1) {
    ;[todaysTasks[index], todaysTasks[index + 1]] = [todaysTasks[index + 1], todaysTasks[index]]
    saveData()
    renderTodaysTasks()
  }
}

// Complete a task
function completeTask(index) {
  const task = todaysTasks.splice(index, 1)[0]
  completedTasks.push(task)
  saveData()
  renderTasks()
}

// Remove a completed task
function removeCompleted(index) {
  completedTasks.splice(index, 1)
  saveData()
  renderCompletedTasks()
}

// Clear all completed tasks
function clearAllCompleted() {
  completedTasks = []
  saveData()
  renderCompletedTasks()
}

// Edit a task
function editTask(index, listType) {
  let task
  if (listType === "unscheduled") {
    task = unscheduledTasks[index]
  } else if (listType === "today") {
    task = todaysTasks[index]
  } else {
    task = completedTasks[index]
  }

  taskTitle.value = task.title
  taskPriority.value = task.priority
  taskCategory.value = task.category

  document.getElementById("task-form-title").textContent = "Edit Task"
  document.getElementById("create-task-btn").style.display = "none"
  document.getElementById("update-task-btn").style.display = "inline-block"
  document.getElementById("delete-task-btn").style.display = "inline-block"
  document.getElementById("cancel-edit-btn").style.display = "inline-block"

  document.getElementById("update-task-btn").onclick = (e) => {
    e.preventDefault()
    task.title = taskTitle.value
    task.priority = taskPriority.value
    task.category = taskCategory.value

    saveData()
    renderTasks()
    resetTaskForm()
  }

  document.getElementById("delete-task-btn").onclick = (e) => {
    e.preventDefault()
    if (listType === "unscheduled") {
      deleteTask(index)
    } else if (listType === "today") {
      todaysTasks.splice(index, 1)
    } else {
      completedTasks.splice(index, 1)
    }
    saveData()
    renderTasks()
    resetTaskForm()
  }

  document.getElementById("cancel-edit-btn").onclick = resetTaskForm
}

// Delete a task
function deleteTask(index) {
  unscheduledTasks.splice(index, 1)
  saveData()
  renderUnscheduledTasks()
}

// Drag and drop functionality
function dragStart(e) {
  e.dataTransfer.setData("text/plain", e.target.innerHTML)
  e.dataTransfer.effectAllowed = "move"
}

function dragOver(e) {
  e.preventDefault()
  e.dataTransfer.dropEffect = "move"
}

function drop(e) {
  e.preventDefault()
  const data = e.dataTransfer.getData("text")
  const draggedElement = document.querySelector(`li:contains('${data}')`)
  const dropTarget = e.target.closest("li")

  if (draggedElement && dropTarget && draggedElement !== dropTarget) {
    const list = dropTarget.parentNode
    const fromIndex = Array.from(list.children).indexOf(draggedElement)
    const toIndex = Array.from(list.children).indexOf(dropTarget)

    if (list.id === "todays-tasks") {
      ;[todaysTasks[fromIndex], todaysTasks[toIndex]] = [todaysTasks[toIndex], todaysTasks[fromIndex]]
      saveData()
      renderTodaysTasks()
    }
  }
}

// Render categories
function renderCategories() {
  taskCategory.innerHTML = ""
  categoryList.innerHTML = ""
  categories.forEach((category, index) => {
    const option = document.createElement("option")
    option.value = category
    option.textContent = category
    taskCategory.appendChild(option)

    const li = document.createElement("li")
    li.innerHTML = `
            ${category}
            <div>
                <button onclick="moveCategoryUp(${index})">↑</button>
                <button onclick="moveCategoryDown(${index})">↓</button>
                <button onclick="renameCategory(${index})">Rename</button>
                <button onclick="deleteCategory(${index})">Delete</button>
            </div>
        `
    categoryList.appendChild(li)
  })
}

// Add new category
function addCategory(event) {
  event.preventDefault()
  const newCategory = newCategoryInput.value.trim()
  if (newCategory && !categories.includes(newCategory)) {
    categories.push(newCategory)
    saveData()
    renderCategories()
    newCategoryInput.value = ""
  } else {
    alert("Please enter a unique category name.")
  }
}

// Move category up
function moveCategoryUp(index) {
  if (index > 0) {
    ;[categories[index], categories[index - 1]] = [categories[index - 1], categories[index]]
    saveData()
    renderCategories()
  }
}

// Move category down
function moveCategoryDown(index) {
  if (index < categories.length - 1) {
    ;[categories[index], categories[index + 1]] = [categories[index + 1], categories[index]]
    saveData()
    renderCategories()
  }
}

// Delete category
function deleteCategory(index) {
  const category = categories[index]
  const tasksWithCategory = [...unscheduledTasks, ...todaysTasks, ...completedTasks].filter(
    (task) => task.category === category,
  )

  if (tasksWithCategory.length > 0) {
    alert(`Cannot delete category "${category}" as it is being used by existing tasks.`)
    return
  }

  categories.splice(index, 1)
  saveData()
  renderCategories()
}

// Event listeners
taskForm.addEventListener("submit", addTask)
clearCompletedBtn.addEventListener("click", clearAllCompleted)
categoryForm.addEventListener("submit", addCategory)

// Initial load
loadData()

// Set default category to "Work"
taskCategory.value = "Work"

function resetTaskForm() {
  taskForm.reset()
  document.getElementById("task-form-title").textContent = "Create New Task"
  document.getElementById("create-task-btn").style.display = "inline-block"
  document.getElementById("update-task-btn").style.display = "none"
  document.getElementById("delete-task-btn").style.display = "none"
  document.getElementById("cancel-edit-btn").style.display = "none"
}

document.getElementById("sort-tasks").addEventListener("click", sortTasks)
document.querySelector(".collapse-btn").addEventListener("click", toggleCategoryManagement)

