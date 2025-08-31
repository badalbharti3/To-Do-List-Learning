// Theme Changing
document.getElementById("themeBtn").addEventListener('click', function() {
    let p = document.getElementById('_div');
    if(p.classList.contains('dark')) {
        p.classList.remove('dark');
    } else {
        p.classList.add('dark');
    }  
});

// Adding New Tasks
const taskArray = []; // Move array outside event listener to persist tasks

document.getElementById("tasks").addEventListener("submit", function(e) {
    e.preventDefault();
    let p = document.getElementById("inp");
    
    if(p.value.trim() === "") {
        alert('Enter any task.');
        return;
    }

    if(!taskArray.includes(p.value)) {
        taskArray.push(p.value);
        let newTask = document.createElement('li');
        newTask.textContent = `Task: ${p.value}`;
        document.getElementById("taskList").appendChild(newTask);
        p.value = ""; // Clear input after adding task
    } else {
        alert(`The task: ${p.value} is already there!`);
    }
});