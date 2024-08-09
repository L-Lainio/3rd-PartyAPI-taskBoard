// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Initialize our date picker
$('#taskDueDate').datepicker({})

// Todo: create a function to generate a unique task id
function generateTaskId() {
    // If we don't find a nextId in our local storage, we set the variable to 0
    if (!nextId) {
        nextId = 0
    }
    // Our newId will be the nextId that we found or created, we add 1 to our nextId,
    // save it to local storage, and return our newId
    const newId = nextId;
    nextId++;
    localStorage.setItem('nextId', JSON.stringify(nextId));
    return newId;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    // If we don't have a task list from local storage, then we abort the function
    if (!taskList) {
        return
    }
    // If we do, though, we create the HTML elements for each of the cards using the
    // data that was input in our modal form and give them attributes
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
    // We append each element to our task card
    taskCardHeader.appendChild(taskTitle);
    taskCard.appendChild(cardDeleteButton);
    taskCard.appendChild(taskCardHeader);
    taskCard.appendChild(taskDescription);
    taskCard.appendChild(taskDueDate);
    // We locate the status of the task and append it to the corresponding column
    const taskStatus = task.status
    let taskColumnPick = document.getElementById(`${taskStatus}-cards`)
    taskColumnPick.appendChild(taskCard);
    // We call our renderTaskList function to make the cards instantly draggable
    renderTaskList();
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

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    // We give the cards the draggable attribute using our jQuery UI, make sure that
    // they return to where they were dragged from if they're dropped to an invalid
    // location, place them above the other elements when dragging, and we connect them
    // to our sortable lanes
    $('.taskCard').draggable({
        revert: 'invalid',
        zIndex: 100,
        connectToSortable: '.lane',
    });
    // We make our task cards sortable between each other and append them to their
    // respective positions in the HTML
    $('#to-do-cards').sortable({
        appendTo: document.body
    });

}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
    // The below prevents the page from reloading when we click our button
    event.preventDefault();

    // The below gathers the inputs from our form and stores them as variables
    const title = $('#taskTitle').val().trim();
    const description = $('#taskDescription').val().trim();
    const dueDateStr = $('#taskDueDate').datepicker('getDate');
    // The below makes sure our date is displayed without a time or timezone attached
    const dueDateISO = dueDateStr.toISOString().split('T')[0];
    // We declare our dueDate variable
    const dueDate = dayjs(dueDateISO)
    // The below creates a Javascript object with our inputs
    const newTask = {
        id: generateTaskId(),
        title: title,
        description: description,
        dueDate: dueDate.format('YYYY-MM-DD'),
        status: 'to-do'
    };

    // The below states that if we don't have a task list already, we'll create an empty object for it
    if (!taskList) {
        taskList = [];
    }
    // The below pushes our new task object to our task list
    taskList.push(newTask);
    // The below stringifies the object and pushes it to our local storage
    localStorage.setItem('tasks', JSON.stringify(taskList));
    // We call the createTaskCard function to make the task card
    createTaskCard(newTask);

    // The below closes the modal and clears the form
    $('#formModal').modal('hide');
    $('#taskForm').trigger('reset');
}


// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
    // The below declares the button as the event that occurs, grabs the closest task card element to the button
    // that was pressed, and stores the taskId as a number string
    const deleteButton = event.target;
    const taskCard = deleteButton.closest('.taskCard');
    const taskId = taskCard.id.replace('taskId-', '')
    // The below parses the number string of the ID to identify the index the task card we're deleting is at
    const taskIndex = taskList.findIndex(task => task.id === parseInt(taskId));
    // If we have a valid task index number, then we splice that task from the local storage and save local storage
    if (taskIndex !== -1) {
        taskList.splice(taskIndex, 1);
        localStorage.setItem('tasks', JSON.stringify(taskList));
    }
    // The below removes the targeted task card from the DOM
    taskCard.remove();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    // The below stops any propagation through the HTML elements after dropping
    event.stopPropagation();
    // The below identifies the ID of the task that we drag and then replaces the status of the task to match that of
    // the lane it's dropped into
    const taskId = ui.draggable.attr('id').replace('taskId-', '');
    const newStatus = $(this).attr('id');

    // The below finds the task and identifies its taskId. If it doesn't find a task, it returns a -1, so we say if we do
    // find a task, then we search our taskList for the status at that task's index and update it with the id of the lane
    // we found above. Finally, we update it in local storage
    const taskIndex = taskList.findIndex((task) => task.id === parseInt(taskId));
    if (taskIndex !== -1) {
        taskList[taskIndex].status = newStatus;
        localStorage.setItem('tasks', JSON.stringify(taskList));
    };
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    // We render our tasks from our local storage
    function renderTasksFromLocalStorage() {
        // We check if there's data stored in our local storage and create a task card for each task if there is
        if (taskList) {
            taskList.forEach((task, index) => {
                createTaskCard(taskList[index]);
            });
        }
    }
    // We call our function
    renderTasksFromLocalStorage()
    // We call our renderTaskList function to make the cards draggable, droppable, and sortable
    renderTaskList();
    // We the elements within our lanes sortable
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
