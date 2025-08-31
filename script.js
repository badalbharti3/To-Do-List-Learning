let c = 1;
let taskArray = [];
document.getElementById("add-btn").addEventListener("click", function () {
  let p = document.getElementById("todo-input");
  if (p.value === "") {
    alert("Enter any task.");
    return;
  }
  
  if(!taskArray.includes(p.value)){
    taskArray.push(p.value);
    let newTask = document.createElement("li");
    let newbtn = document.createElement("button");
    newbtn.textContent = "Delete";
    
    newTask.textContent = `Task ${c++}: ${p.value} `;
    document.getElementById("todolist").appendChild(newTask);
    document.getElementById("todolist").lastChild.appendChild(newbtn);

    p.value = "";
  }
  else alert('Task already on the list!!!')
  
});
