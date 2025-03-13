import './to_do.css';
import editBtnImg from '../images/edit-icon.png';
import dltBtnImg from '../images/dlt-icon.png';

class ToDoApp {
  constructor() {
    this.userSelectedProject = null;
    // this.projectNames = ['Default project'];
    // this.toDoData = { 'Default project': [['hello', '2025-01-02', 'High', 'what is up'], ['Fiddle with buttons', '2025-01-02', 'Medium', 'what is up'], ['Hi', '2025-01-02', 'Low', 'what is up']] };
    this.projectNames = []
    this.toDoData = {}
    this.editedToDoIndex = null;

    this.initializeElement();/* querying all the element */

    // this.updateSessionStorage()
    this.loadFromStorage();
    this.setupEventListener();
  }

  initializeElement() {
    this.addPrjBtn = document.querySelector('#prj-plus');
    this.prjInput = document.querySelector('.prj-input');
    this.prjContainer = document.querySelector('.prj-list');
    this.toDoContainer = document.querySelector('.to-do-list');
    this.dialog = document.querySelector('dialog');
    this.saveToDo = document.querySelector('#save');
    this.exitToDo = document.querySelector('#exit');
    this.addToDoBtn = document.querySelector('#to-do-plus');
    this.date = document.querySelector('#date');
    this.title = document.querySelector('#title');
    this.option = document.querySelector('#priority-options');
    this.textArea = document.querySelector('textarea');
    this.priorityLabel = document.querySelector('.priority-label');
  }
  // Add event listeners
  setupEventListener() {
    this.addPrjBtn.addEventListener('click', () => this.showProjectInput());
    this.prjInput.addEventListener('keyup', (e) => this.createProject(e));
    this.prjContainer.addEventListener('click', (e) => this.selectProject(e));
    this.addToDoBtn.addEventListener('click', () => this.openDialog());
    this.saveToDo.addEventListener('click', () => this.addToDo());
    this.exitToDo.addEventListener('click', () => this.closeDialog());
    this.toDoContainer.addEventListener('click', (e) => this.handleToDoActions(e));
    this.priorityLabel.addEventListener('click', (e) => this.sortTodos(e));
  }

  // Load toDoData from localStorage
  // loadFromStorage() {
  //   const storedData = JSON.parse(localStorage.getItem('toDoData'));
  //   if (storedData) {
  //     this.toDoData = storedData;
  //     Object.keys(storedData).forEach((project) => {
  //       this.projectNames.push(project);
  //       this.createProjectDOM(project);
  //     });
  //   }
  // }
  // Load toDoData from localStorage
  // Load toDoData from localStorage
  loadFromStorage() {
    const storedData = JSON.parse(localStorage.getItem('toDoData'));

    if (storedData) {
      this.toDoData = storedData;
      this.projectNames = Object.keys(storedData);
    }
    // Ensure "Default project" exists
    if (!this.projectNames.includes("Default project")) {
      this.projectNames.unshift("Default project");
      this.toDoData["Default project"] = [['hello', '2025-01-02', 'High', 'what is up'], ['Fiddle with buttons', '2025-01-02', 'Medium', 'what is up'], ['Hi', '2025-01-02', 'Low', 'what is up']];
    }

    // Set "Default project" as the selected project
    this.userSelectedProject = "Default project";
    this.renderTodos();
    this.updateSessionStorage();

    // Render all projects in the DOM
    this.projectNames.forEach((project) => this.createProjectDOM(project));
  }






  // Update localStorage
  updateSessionStorage() {
    localStorage.setItem('toDoData', JSON.stringify(this.toDoData));
  }

  // Show project input
  showProjectInput() {
    this.prjInput.style.visibility = 'visible';
    this.prjInput.focus();
  }

  // Create a new project
  createProject(e) {
    const pName = this.prjInput.value.trim();
    if (e.key === 'Enter' && pName.length > 1 && !this.projectNames.includes(pName)) {
      this.projectNames.push(pName);
      this.toDoData[pName] = [];
      this.createProjectDOM(pName);
      this.updateSessionStorage();
      this.prjInput.value = '';
      this.prjInput.blur();
    }
  }

  // Add project to DOM
  createProjectDOM(prjName) {
    const p = document.createElement('p');
    p.classList.add('prj-name');
    p.textContent = prjName;
    this.prjContainer.appendChild(p);
  }

  // Select a project
  selectProject(e) {
    if (this.projectNames.includes(e.target.textContent)) {
      this.userSelectedProject = e.target.textContent;
      this.toDoContainer.textContent = '';
      this.renderTodos();
      document.querySelectorAll('.prj-name').forEach((p) => p.classList.remove('active'));
      e.target.classList.add('active');
    }
  }

  // Open the dialog for adding/editing todos
  openDialog() {
    if (this.userSelectedProject) {
      this.dialog.style.display = 'flex';
      this.dialog.showModal();
    } else {
      console.log('Select a project first.');
    }
  }

  // Close the dialog
  closeDialog() {
    this.dialog.style.display = 'none';
    this.dialog.close();
    this.clearDialogFields();
  }

  // Clear dialog fields
  clearDialogFields() {
    this.date.value = '';
    this.title.value = '';
    this.option.value = '';
    this.textArea.value = '';
  }

  // Add or edit a todo
  addToDo() {
    if (this.date.value && this.title.value && this.option.value) {
      const notes = this.textArea.value || 'put something here...';
      const todo = [this.title.value, this.date.value, this.option.value, notes, false]; // Include checkbox state

      if (this.editedToDoIndex !== null) {
        this.toDoData[this.userSelectedProject][this.editedToDoIndex] = todo;
        this.editedToDoIndex = null;
      } else {
        this.toDoData[this.userSelectedProject].push(todo);
      }

      this.updateSessionStorage();
      this.renderTodos();
      this.closeDialog();
    } else {
      console.log('Fill in all fields.');
    }
  }

  // Render todos for the selected project
  renderTodos() {
    this.toDoContainer.textContent = '';
    this.toDoData[this.userSelectedProject].forEach(([title, date, priority, notes, isCompleted], index) => {
      this.createToDoDOM(title, date, priority, notes, isCompleted, index);
    });
  }

  // Create a todo item in the DOM
  createToDoDOM(title, date, priority, notes, isCompleted, index) {
    const div = document.createElement('div');
    div.classList.add('to-dos');
    if (isCompleted) div.classList.add('completed'); // Mark completed tasks visually

    const label = document.createElement('label');
    const inputCheckbox = document.createElement('input');
    inputCheckbox.type = 'checkbox';
    inputCheckbox.checked = isCompleted;
    inputCheckbox.addEventListener('change', (e) => {
      this.toggleComplete(index, e.target.checked);
    });
    label.appendChild(inputCheckbox);
    label.appendChild(document.createTextNode(title));

    const p = document.createElement('p');
    p.textContent = notes;

    const span = document.createElement('span');
    span.textContent = priority;
    this.setPriorityClass(priority, span);

    const editImg = document.createElement('img');
    editImg.src = editBtnImg;
    editImg.classList.add('edit-icon');

    const dltImg = document.createElement('img');
    dltImg.src = dltBtnImg;
    dltImg.classList.add('dlt-icon');

    const h4 = document.createElement('h4');
    h4.textContent = date;

    div.append(label, p, span, editImg, dltImg, h4);
    this.toDoContainer.appendChild(div);
  }

  // Toggle the completion status of a todo
  toggleComplete(index, isChecked) {
    this.toDoData[this.userSelectedProject][index][4] = isChecked;
    this.updateSessionStorage();
    this.renderTodos();
  }

  // Set the CSS class for priority
  setPriorityClass(priority, element) {
    element.className = ''; // Clear existing classes
    if (priority === 'Low') element.classList.add('p-l');
    else if (priority === 'Medium') element.classList.add('p-m');
    else if (priority === 'High') element.classList.add('p-h');
  }


  handleToDoActions(e) {
    if (e.target.classList.contains('dlt-icon')) {
      this.deleteToDo(e.target.closest('.to-dos').querySelector('label').textContent);
    } else if (e.target.classList.contains('edit-icon')) {
      this.editToDo(e.target.closest('.to-dos').querySelector('label').textContent);
    }
  }

  // Delete a todo
  deleteToDo(title) {
    const todos = this.toDoData[this.userSelectedProject];
    this.toDoData[this.userSelectedProject] = todos.filter((todo) => todo[0] !== title);
    this.updateSessionStorage();
    this.renderTodos();
  }

  // Edit a todo
  editToDo(title) {
    const todos = this.toDoData[this.userSelectedProject];
    const index = todos.findIndex((todo) => todo[0] === title);
    const [todoTitle, todoDate, todoPriority, todoNotes] = todos[index];

    this.title.value = todoTitle;
    this.date.value = todoDate;
    this.option.value = todoPriority;
    this.textArea.value = todoNotes;

    this.editedToDoIndex = index;
    this.openDialog();
  }

  // Sort todos based on priority
  sortTodos(e) {
    const orders = {
      Low: ['Low', 'Medium', 'High'],
      Medium: ['Medium', 'High', 'Low'],
      High: ['High', 'Medium', 'Low'],
    };
    const priorityOrder = orders[e.target.textContent];
    if (priorityOrder && this.userSelectedProject) {
      this.toDoData[this.userSelectedProject].sort(
        (a, b) => priorityOrder.indexOf(a[2]) - priorityOrder.indexOf(b[2])
      );
      this.updateSessionStorage();
      this.renderTodos();
    }
  }
}

// Initialize the app
new ToDoApp();
// app = new ToDoApp();
// app.updateSessionStorage()