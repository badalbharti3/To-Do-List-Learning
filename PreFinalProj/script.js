let taskArray = [];
document.getElementById("add-btn").addEventListener("click", function () {
  let p = document.getElementById("todo-input");
  if (p.value === "") {
    alert("Enter any task.");
    return;
  }

  if (!taskArray.includes(p.value)) {
    
    let newTask = document.createElement("li");
    const btnId = `delete-btn-${Date.now()}`; 
    newTask.innerHTML = `Task: ${p.value} 
    <button class="newBtn" id="${btnId}">Delete</button             
    `;
    document.getElementById("todolist").appendChild(newTask);
    
    p.value = "";

    // Add event listener to the new delete button
    document.getElementById(btnId).addEventListener("click", function () {
      let d = document.getElementById("todolist").lastElementChild;
      alert('You are removing a task.')
      d.remove();
      
    });
  
  } else alert("Task already on the list!!!");
});
