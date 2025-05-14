const objectName = document.getElementById("objectName");
const description = document.getElementById("description");
const leftSideBar = document.getElementById("leftSideBar");
const allBtn = document.getElementById("allBtn");
const doneBtn = document.getElementById("doneBtn");
const undoneBtn = document.getElementById("undoneBtn");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const searchSubmit = document.getElementById("searchSubmit");
const addToList = document.querySelector(".addToList");
const createList = document.querySelector(".createList");
const rightSideBar = document.getElementById("rightSideBar");
const datePicker = document.getElementById("datePicker");

//Date format
const date = new Date();
const formattedDate = `${date.getDate()}-${
  date.getMonth() + 1
}-${date.getFullYear()}`;

let taskObjects = [];
let currentFilter = "all";

function createObjectDOM(task, index) {
  let newDiv = document.createElement("div");
  newDiv.setAttribute("class", "newObject draggables");
  newDiv.setAttribute("id", `task-${index}`);
  newDiv.setAttribute("draggable", "true");



  // Object Title  <--- in createObjectDom function
  let objectTitleDiv = document.createElement("div");
  objectTitleDiv.setAttribute("class", "objectTitle");
  objectTitleDiv.textContent = task.title;
  newDiv.appendChild(objectTitleDiv);



  // Close Button  <--- in createObjectDom function
  let closeButton = document.createElement("button");
  closeButton.setAttribute("class", "closeObject");
  closeButton.addEventListener("click", function () {
    handleCloseButtonClick(task);
  });
  newDiv.appendChild(closeButton);



  // Object Description  <--- in createObjectDom function
  let objectDescriptionDiv = document.createElement("div");
  objectDescriptionDiv.setAttribute("class", "objectDescription");
  objectDescriptionDiv.textContent = task.description;
  newDiv.appendChild(objectDescriptionDiv);

          // Edit Button
  let editBtn = document.createElement("button");
  editBtn.setAttribute("class", "editBtn");
  editBtn.innerText = "Edit";
  editBtn.addEventListener("click", function () {
    handleEditButtonClick(objectTitleDiv, objectDescriptionDiv);
  });
  newDiv.appendChild(editBtn);


  // Task Completed Button   <--- in createObjectDom function
  let nailedIt = document.createElement("button");
  nailedIt.setAttribute("class", "nailedIt");
  if (task.finished) {
    nailedIt.innerText = "Re-Open";
    nailedIt.addEventListener("click", function () {
      handleReopenButtonClick(task);
    });
    closeButton.style.visibility = "hidden";
    editBtn.style.visibility = "hidden";
  } else {
    nailedIt.innerText = "Complete";
    nailedIt.addEventListener("click", function () {
      handleCompleteButtonClick(task);
    });
  }
  newDiv.appendChild(nailedIt);

  // Date  <--- in createObjectDom function
  let dateDiv = document.createElement("div");
  dateDiv.setAttribute("class", "dateDiv");
  dateDiv.innerText = task.dateValue;
  newDiv.appendChild(dateDiv);

  // Drag and Drop events  <--- in createObjectDom function
  newDiv.addEventListener("dragstart", handleDragStart);
  newDiv.addEventListener("drag", handleDrag);
  newDiv.addEventListener("dragend", handleDragEnd);
  newDiv.addEventListener("dragover", handleDragOver);
  newDiv.addEventListener("dragenter", handleDragEnter);
  newDiv.addEventListener("dragleave", handleDragLeave);
  newDiv.addEventListener("drop", handleDrop);

  objectTitleDiv.addEventListener("blur", function () {
    handleTitleBlur(objectTitleDiv, task);
  });
  objectDescriptionDiv.addEventListener("blur", function () {
    handleDescriptionBlur(objectDescriptionDiv, task);
  });

  return newDiv;
}

function handleCloseButtonClick(task) {
  const taskId = taskObjects.indexOf(task);
  taskObjects.splice(taskId, 1);
  applyFilter();
}

function handleEditButtonClick(objectTitleDiv, objectDescriptionDiv) {
  objectTitleDiv.classList.add("editIt");
  objectDescriptionDiv.classList.add("editIt");
  objectTitleDiv.setAttribute("contenteditable", true);
  objectDescriptionDiv.setAttribute("contenteditable", true);
}

function handleReopenButtonClick(task) {
  task.finished = false;
  applyFilter();
}

function handleCompleteButtonClick(task) {
  task.finished = true;
  applyFilter();
}

function handleDragStart(e) {
  draggedElement = this;
  this.classList.add("dragging");
}

function handleDrag() {
  this.classList.remove("dragging");
}

function handleDragEnd() {
  this.classList.remove("dragging");
}

function handleDragOver(e) {
  e.preventDefault();
  this.classList.add("over");
}

function handleDragEnter(e) {
  e.preventDefault();
  this.classList.add("over");
}

function handleDragLeave() {
  this.classList.remove("over");
}

function handleDrop(e) {
  e.preventDefault();
  this.classList.remove("over");
  const rect = this.getBoundingClientRect();
  const draggedRect = draggedElement.getBoundingClientRect();
  if (rect.top < draggedRect.top) {
    this.parentNode.insertBefore(draggedElement, this);
  } else {
    this.parentNode.insertBefore(draggedElement, this.nextSibling);
  }
}

function handleTitleBlur(objectTitleDiv, task) {
  objectTitleDiv.removeAttribute("contenteditable");
  objectTitleDiv.classList.remove("editIt");
  task.title = objectTitleDiv.textContent;
}

function handleDescriptionBlur(objectDescriptionDiv, task) {
  objectDescriptionDiv.removeAttribute("contenteditable");
  objectDescriptionDiv.classList.remove("editIt");
  task.description = objectDescriptionDiv.textContent;
}

searchSubmit.addEventListener("click", function () {
  removeNewObjects();
  const searchQuery = searchInput.value.toLowerCase();
  let filteredTasks;

  if (currentFilter === "all") {
    filteredTasks = taskObjects.filter(function (task) {
      return (
        task.title.toLowerCase().includes(searchQuery) ||
        task.description.toLowerCase().includes(searchQuery)
      );
    });
    searchInput.placeholder = "Search  [All]";
  } else if (currentFilter === "done") {
    filteredTasks = taskObjects.filter(function (task) {
      return (
        (task.title.toLowerCase().includes(searchQuery) ||
          task.description.toLowerCase().includes(searchQuery)) &&
        task.finished
      );
    });
    searchInput.placeholder = "Search [Completed]";
  } else if (currentFilter === "undone") {
    filteredTasks = taskObjects.filter(function (task) {
      return (
        (task.title.toLowerCase().includes(searchQuery) ||
          task.description.toLowerCase().includes(searchQuery)) &&
        !task.finished
      );
    });
    searchInput.placeholder = "Search [In Progress]";
  }

  filteredTasks.forEach(function (task, index) {
    let newDiv = createObjectDOM(task, index);
    if (task.finished) {
      newDiv.classList.add("faded");
    }
    rightSideBar.appendChild(newDiv);
  });
  searchInput.value = "";
});

searchInput.addEventListener("focus", function () {
  if (
    (searchInput.placeholder =
      "Search  [All]" || "Search [Completed]" || "Search [In Progress]")
  ) {
    searchInput.placeholder = "";
  }
});

searchInput.addEventListener("blur", function () {
  if (searchInput.value === "") {
    if (currentFilter === "all") {
      searchInput.placeholder = "Search [All]";
    } else if (currentFilter === "done") {
      searchInput.placeholder = "Search [Completed]";
    } else if (currentFilter === "undone") {
      searchInput.placeholder = "Search [In Progress]";
    }
  }
});

function removeNewObjects() {
  const newObjects = document.querySelectorAll(".newObject");
  newObjects.forEach(function (newObject) {
    newObject.remove();
  });
}

objectName.addEventListener("blur", function () {
  if (objectName.value === "") {
    objectName.placeholder = "";
  }
});

objectName.addEventListener("focus", function () {
  if (objectName.placeholder === "*Invalid Input") {
    objectName.placeholder = "";
  }
});

description.addEventListener("blur", function () {
  if (description.value === "") {
    description.placeholder = "";
  }
});

description.addEventListener("focus", function () {
  if (description.placeholder === "*Invalid Input") {
    description.placeholder = "";
  }
});

function addNewObject() {
  const dateValue = document.getElementById("datePicker").value;
  if (objectName.value === "" || description.value === "") {
    objectName.placeholder = "*Invalid Input";
    description.placeholder = "*Invalid Input";
    objectName.classList.add("reqRed");
    description.classList.add("reqRed");
  } else {
    objectName.classList.remove("reqRed");
    description.classList.remove("reqRed");
    objectName.placeholder = "";
    description.placeholder = "";

    let task = {
      title: objectName.value,
      description: description.value,
      dateValue: dateValue,
      finished: false,
    };
    taskObjects.unshift(task);
    applyFilter();
    objectName.value = "";
    description.value = "";
    datePicker.value = "";
  }
}

function applyFilter() {
  removeNewObjects();
  let filteredTasks;

  if (currentFilter === "all") {
    filteredTasks = taskObjects;
  } else if (currentFilter === "done") {
    filteredTasks = taskObjects.filter(function (task) {
      return task.finished;
    });
  } else if (currentFilter === "undone") {
    filteredTasks = taskObjects.filter(function (task) {
      return !task.finished;
    });
  }

  filteredTasks.forEach(function (task, index) {
    let newDiv = createObjectDOM(task, index);
    if (task.finished) {
      newDiv.classList.add("faded");
    }
    rightSideBar.appendChild(newDiv);
  });
}

allBtn.addEventListener("click", function () {
  currentFilter = "all";
  applyFilter();
  allBtn.classList.add("selectedAll");
  doneBtn.classList.remove("selectedDone");
  undoneBtn.classList.remove("selectedUndone");
  searchInput.placeholder = "Search [All]";
});

doneBtn.addEventListener("click", function () {
  currentFilter = "done";
  applyFilter();
  allBtn.classList.remove("selectedAll");
  doneBtn.classList.add("selectedDone");
  undoneBtn.classList.remove("selectedUndone");
  searchInput.placeholder = "Search [Completed]";
});

undoneBtn.addEventListener("click", function () {
  currentFilter = "undone";
  applyFilter();
  allBtn.classList.remove("selectedAll");
  doneBtn.classList.remove("selectedDone");
  undoneBtn.classList.add("selectedUndone");
  searchInput.placeholder = "Search [In Progress]";
});
