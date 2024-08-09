// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Initialize our date picker
$('#taskDueDate').datepicker({})

// Created a function to generate a unique task id
function generateTaskId() {
    // If no nextId in our local storage, we set the variable to 0
    if (!nextId) {
        nextId = 0
    }

    // NewId will be nextId that create, by adding 1 to our nextId, save it to local storage, and return newId
    const newId = nextId;
    nextId++;
    localStorage.setItem('nextId', JSON.stringify(nextId));
    return newId;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    // If no task list from local storage, abort the function
    if (!taskList) {
        return
    }

    // Correct: Wait for the element to be loaded
    window.addEventListener('load', () => {
      const myElement = document.getElementById('myElement');
      if (myElement) {
        myElement.classList.add('new-class'); // Now it works!
      } else {
        console.error('Element with ID myElement not found');
      }
    });

    // If task list we create the HTML elements for each of the cards using the data that was input in our modal form and give them attributes
    const taskCard = document.createElement('div');
    taskCard.setAttribute('class', 'taskCard');
    let taskId = task.id
    taskCard.setAttribute('id', `taskId-${taskId}`)

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

    // Append each element to our task card
    taskCardHeader.appendChild(taskTitle);
    taskCard.appendChild(cardDeleteButton);
    taskCard.appendChild(taskCardHeader);
    taskCard.appendChild(taskDescription);
    taskCard.appendChild(taskDueDate);

    // Locate the status of the task and append it to the corresponding column
    const taskStatus = task.status
    let taskColumnPick = document.getElementById(`${taskStatus}-cards`)
    taskColumnPick.appendChild(taskCard);

    // Call renderTaskList function to make the cards instantly draggable
    renderTaskList();

    // Corrispond color for importance for cards based on their due date that we gathered from our dayjs widget
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
    // Call the function to update the task card colors
    updateTaskCardColor(task);
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    // Cards need draggable attribute using jQuery UI, make sure that they remain in column dragged and dropped to valid location, place them above the other elements when dragging, and connect to sortable lanes

    $('.taskCard').draggable({
        revert: 'invalid',
        zIndex: 100,
        connectToSortable: '.lane',
    });
    // Make task cards sortable between each other and append them to respective positions in the HTML
    $('#todoCards').sortable({
        appendTo: document.body
    });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
    // Prevents the page from reloading when we click our button
    event.preventDefault();

    // Gathers the inputs from our form and stores them as variables
    const title = $('#taskTitle').val().trim();
    const description = $('#taskDescription').val().trim();
    const dueDateStr = $('#taskDueDate').datepicker('getDate');

    // date is displayed without a time or timezone attached
    const dueDateISO = dueDateStr.toISOString().split('T')[0];

    // Declare our dueDate variable
    const dueDate = dayjs(dueDateISO)

    // Creates a Javascript object with our inputs
    const newTask = {
        id: generateTaskId(),
        title: title,
        description: description,
        dueDate: dueDate.format('YYYY-MM-DD'),
        status: 'to-do'
    };

    // If no task list already, will create an empty object for it
    if (!taskList) {
        taskList = [];
    }

    // Pushes our new task object to our task list
    taskList.push(newTask);

    // Stringifies the object and pushes it to our local storage
    localStorage.setItem('tasks', JSON.stringify(taskList));

    // createTaskCard function to make the task card
    createTaskCard(newTask);

    // The below closes the modal and clears the form
    $('#formModal').modal('hide');
    $('#taskForm').trigger('reset');
}


// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {

    // Declares the button as the event that occurs, grabs the closest task card element to the button that was pressed, and stores the taskId as a number string
    const deleteButton = event.target;
    const taskCard = deleteButton.closest('.taskCard');
    const taskId = taskCard.id.replace('taskId-', '')

    // Parses the number string of the ID to identify the index the task card deleting is at
    const taskIndex = taskList.findIndex(task => task.id === parseInt(taskId));

    // Valid task index number, then splice task from the local storage and save local storage
    if (taskIndex !== -1) {
        taskList.splice(taskIndex, 1);
        localStorage.setItem('tasks', JSON.stringify(taskList));
    }
    // Removes the targeted task card from the DOM
    taskCard.remove();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

    // Stops any propagation through the HTML elements after dropping
    event.stopPropagation();

    // Identifies the ID of the task that is dragged and replaces the status of the task to match that of the lane it's dropped into
    const taskId = ui.draggable.attr('id').replace('taskId-', '');
    const newStatus = $(this).attr('id');

    // Finds the task and identifies its taskId. If no task found it returns a -1, so then search taskList for the status at that task's index and update it with the id of the lane Finally, updated in local storage
    const taskIndex = taskList.findIndex((task) => task.id === parseInt(taskId));
    if (taskIndex !== -1) {
        taskList[taskIndex].status = newStatus;
        localStorage.setItem('tasks', JSON.stringify(taskList));
    };
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    function createTaskCard(task) {
        const taskCard = document.createElement('div');
        taskCard.className = 'task-card';
        taskCard.id = task.id;

        const taskTitle = document.createElement('h3');
        taskTitle.textContent = task.title;
        taskCard.appendChild(taskTitle);

        const taskDescription = document.createElement('p');
        taskDescription.textContent = task.description;
        taskCard.appendChild(taskDescription);

        const taskDueDate = document.createElement('p');
        taskDueDate.textContent = `Due: ${task.dueDate}`;
        taskCard.appendChild(taskDueDate);

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete';
        deleteButton.textContent = 'Delete';
        deleteButton.dataset.taskId = task.id;
        taskCard.appendChild(deleteButton);

        const targetColumn = document.getElementById(task.status + 'Cards');
        if (targetColumn) {
            targetColumn.appendChild(taskCard);
        } else {
            console.error(`Column with ID ${task.status}Cards not found`);
        }
    }
    // Call function
    renderTasksFromLocalStorage()

    // Call renderTaskList function to make the cards draggable, droppable, and sortable
    renderTaskList();

    // Elements within our lanes sortable
    $('.lane').sortable({
        connectWith: '.lane',
        tolerance: 'pointer',
        handle: '.taskCardHeader',
        cursor: 'move',
        placeholder: 'taskCard-placeholder'
    })
    // We make our lanes droppable for the cards
    $('.lane').droppable({
        accept: '.taskCard',
        drop: handleDrop,
    });
    // We show our modal form when we click on the "Add Task" button
    $('#addTaskButton').click(function () {
        $('#formModal').modal('show');
    });
    // We call our handleAddTask function when we click the "Create Task" button
    $('#taskForm').submit(handleAddTask);
});
