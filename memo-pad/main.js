// 유저가 값을 입력한다.
// + 버튼을 클릭하면, 할 일이 추가된다.
// delete 버튼을 누르면 할 일이 삭제 된다.
// check 버튼을 누르면 할 일이 끝나면서 밑줄이 간다.
// 1. check 버튼을 클릭하는 순간 true false
// 2. true 이면 끝난 걸로 간주하고 밑줄 보여주기
// 3. false 이면 안 끝난 걸로 간주하고 그대로 유지
// 진행중 끝남 탭을 누르면, 언더바가 이동한다.
// 끝남 탭은, 끝난 아이템만, 진행중 탭은 진행중인 아이템만
// 전체탭을 누르면 다시 전체 아이템으로 돌아옴

let taskInput = document.getElementById('task-input');
let addButton = document.getElementById('add-button');

let tabs = document.querySelectorAll('.task-tabs div');
let underLine = document.getElementById('under-line');

let taskList = [];
let filterList = [];
let mode = 'all';

addButton.addEventListener('click', addTask);

for (let i = 1; i < tabs.length; i++) {
  tabs[i].addEventListener('click', (event)=>  filter(event));
}

function addTask() {
  let task = {
    id: randomIDGenerate(),
    taskContent: taskInput.value,
    isCompleted: false,
  };
  taskList.push(task);

  if (mode === 'ongoing') {
    filterList.push(task);
  } 

  console.log(taskList);
  render();
}

function render() {
  let list = [];
  // 1. 내가 선택한 탭에 따라서
  if (mode === 'all') {
    // all taskList
    list = taskList;
  } else if (mode === 'ongoing' || mode === 'done') {
    // ongoing, done filterList
    list = filterList;
  }
  // 2. 리스트를 달리 보여준다.

  let resultHTML = '';
  for (let i = 0; i < list.length; i++) {
    if (list[i].isCompleted) {
      resultHTML += `<div class="task">
              <div class="task-done">${list[i].taskContent}</div>
              <div>
                <button onclick="toggleComplete('${list[i].id}')">Check</button>
                <button onclick="deleteTask('${list[i].id}')">Delete</button>
              </div>
            </div>`;
      continue;
    } else {
      resultHTML += `<div class="task">
              <div>${list[i].taskContent}</div>
              <div>
                <button onclick="toggleComplete('${list[i].id}')">Check</button>
                <button onclick="deleteTask('${list[i].id}')">Delete</button>
              </div>
            </div>`;
    }
  }
  document.getElementById('task-board').innerHTML = resultHTML;
}

function toggleComplete(id) {
  console.log('id:', id);
  // for(let i=0; i<taskList.length; i++) {
  //     if(taskList[i].id === id) {
  //         taskList[i].isCompleted = !task.isCompleted;
  //         break;
  //     }
  // }

  taskList.forEach((task) => {
    if (task.id === id) {
      task.isCompleted = !task.isCompleted;
      return;
    }
  });
  // console.log(taskList)
  render();
}

function randomIDGenerate() {
  // return '_' + Math.random().toString(36).substr(2, 9);
  return '_' + crypto.randomUUID();
}

function deleteTask(id) {
  console.log('delete', id);
  taskList.forEach((task, idx) => {
    if (task.id === id) {
      taskList.splice(idx, 1);
      return;
    }
  });
  filterList.forEach((task, idx) => {
    if (task.id === id) {
      filterList.splice(idx, 1);
      return;
    }
  });
  render();
}

function filter(event) {
  setUnderLine(event);

  mode = event.target.id;
  filterList = [];
  if (mode === 'all') {
    // 전체 리스트를 보여준다
    render();
  } else if (mode === 'ongoing') {
    // 진행중인 아이템을 보여준다.
    // task.isCompleted === false
    filterList = taskList.filter((task) => task.isCompleted === false);
    console.log('진행중', filterList);
    render();
  } else if (mode === 'done') {
    // 완료된 아이템을 보여준다.
    // task.isCompleted === true
    filterList = taskList.filter((task) => task.isCompleted === true);
    console.log('끝남', filterList);
    render();
  }
}

setUnderLine = (event) => {
    underLine.style.left = event.currentTarget.offsetLeft + 'px';
    underLine.style.width = event.currentTarget.offsetWidth + 'px';
    underLine.style.top = event.currentTarget.offsetTop + event.currentTarget.offsetHeight + 'px';
}
