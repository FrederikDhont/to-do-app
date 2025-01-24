<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Task Management App</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="app-container">
        <div class="left-panel">
            <div class="section-header">
                <h2>Today's To-Do's</h2>
                <button id="sort-tasks">Sort</button>
            </div>
            <ul id="todays-tasks" class="task-list"></ul>
            <h2>Completed Tasks</h2>
            <ul id="completed-tasks" class="task-list"></ul>
            <button id="clear-completed">Clear All Completed</button>
            <h2>Unscheduled Tasks</h2>
            <ul id="unscheduled-tasks" class="task-list"></ul>
        </div>
        <div class="right-panel">
            <h2 id="task-form-title">Create New Task</h2>
            <form id="task-form">
                <input type="text" id="task-title" placeholder="Task Title" required>
                <select id="task-priority" required>
                    <option value="">Select Priority</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
                <select id="task-category" required>
                </select>
                <div id="task-form-buttons">
                    <button type="submit" id="create-task-btn">Create Task</button>
                    <button type="button" id="update-task-btn" style="display: none;">Update Task</button>
                    <button type="button" id="delete-task-btn" style="display: none;">Delete Task</button>
                    <button type="button" id="cancel-edit-btn" style="display: none;">Cancel</button>
                </div>
            </form>
            <div class="collapsible">
                <button type="button" class="collapse-btn">Manage Categories</button>
                <div class="collapse-content">
                    <form id="category-form">
                        <input type="text" id="new-category" placeholder="New Category Name" required>
                        <button type="submit">Add Category</button>
                    </form>
                    <ul id="category-list"></ul>
                </div>
            </div>
        </div>
    </div>
    <script src="app.js"></script>
</body>
</html>

