// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Init date picker
$('#taskDueDate').datepicker({})

// Todo: create a function to generate a unique task id
function generateTaskId() {
    // If nextId is null, set it to 0
    if (!nextId) {
        nextId = 0;
    }

    // newId created +1 to nextId
    const newId = nextId;
    nextId++;
    localStorage.setItem("nextId", JSON.stringify(nextId));
    return newId;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    //abort function if task is null
    if (!task) {
        return;
        // Create a new card element
        const taskCard = document.createElement("div");
        taskCard.setAttribute('class', 'taskCard');
        let taskId = task.id
        taskCard.setAttribute('id', `taskId-${taskId}`)

        // Create a new card header element
        const taskCardHeader = document.createElement('div')
        taskCardHeader.setAttribute('class', 'taskCardHeader')
        const cardDeleteButton = document.createElement('button')
        cardDeleteButton.textContent = 'x'
        cardDeleteButton.setAttribute('class', 'cardDeleteButton')
        cardDeleteButton.addEventListener('click', handleDeleteTask);

        const taskTitle = document.createElement('h4');
        taskTitle.textContent = task.title;
        taskTitle.setAttribute('id', 'taskTitle');

        const taskDescription = document.createElement('p');
        taskDescription.textContent = task.description;
        taskDescription.setAttribute('id', 'taskDescription');

        const taskDueDate = document.createElement('p');
        taskDueDate.textContent = task.dueDate;
        taskDueDate.setAttribute('id', 'taskDueDate');

        taskCard.setAttribute('id', `taskId-${taskId}`)
        // We append each element to our task card
        taskCardHeader.appendChild(taskTitle);
        taskCard.appendChild(cardDeleteButton);
        taskCard.appendChild(taskCardHeader);
        taskCard.appendChild(taskDescription);
        taskCard.appendChild(taskDueDate);
    }

    // Todo: create a function to render the task list and make cards draggable
    function renderTaskList() {

    }

    // Todo: create a function to handle adding a new task
    function handleAddTask(event) {

    }

    // Todo: create a function to handle deleting a task
    function handleDeleteTask(event) {

    }

    // Todo: create a function to handle dropping a task into a new status lane
    function handleDrop(event, ui) {

    }

    // We color the cards based on their due date that we gathered from our dayjs widget
    function updateTaskCardColor(task) {
        const taskCard = document.getElementById(`taskId-${task.id}`);
        if (taskCard) {
            const dueDate = dayjs(task.dueDate);
            const currentDate = dayjs();

            const dayDifference = dueDate.diff(currentDate, 'day');

            if (dayDifference <= 0) {
                taskCard.classList.add('past-due');
            } else if (dayDifference <= 2) {
                taskCard.classList.add('due-soon');
            } else { taskCard.classList.add('due-later') }
        };
    };
    // We call the function to update the task card colors
    updateTaskCardColor(task);

}
// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

});
