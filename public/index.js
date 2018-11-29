$(document).ready(function() {
    $(":text").keyup(function(e) {
        if($(this).val() != '') {
            $(":text").not(this).attr('disabled','disabled');
            $(this).next("input").show();
        } else {
            $(":text").removeAttr('disabled');
            $(this).next("input").hide();
        }
    });
});

var acc = document.getElementsByClassName("accordion");
var panel = document.getElementsByClassName('panel');
var lines = document.getElementById("lines")

for (var i = 0; i < acc.length; i++) {
    acc[i].onclick = function() {
    	var setClasses = !this.classList.contains('active');
        setClass(acc, 'active', 'remove');
        setClass(panel, 'show', 'remove');
        
       	if (setClasses) {
            this.classList.toggle("active");
            this.nextElementSibling.classList.toggle("show");
        }
    }
}

function setClass(els, className, fnName) {
    for (var i = 0; i < els.length; i++) {
        els[i].classList[fnName](className);
    }
}

//panel.style.maxHeight = panel.scrollHeight + "px";
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var textBox = document.getElementById("task-input");
textBox.addEventListener("click", displayAdd);

function displayAdd() {

    var addTButton = document.getElementById("addTask");
    addTButton.style.display === "block";
};

function myFunction() {
    alert ("Hello World!");
}

var allTasks = [];

function insertNewTask(task) {

    var insertTaskContext = {
      
      task: task
      };
      
      var taskHTML = Handlebars.templates.insertTask(insertTaskContext); 
      
    var insertTaskContainer = document.getElementById("list");
    insertTaskContainer.insertAdjacentHTML("beforeend", taskHTML);

};

function HandleAddTask() {

    var task = document.getElementById('task-input').value.trim();
  
    if (!task) {
      alert("You must enter a task");
    } else {
  
      allTasks.push({
        task: task
      });
  
      clearTaskField();
    }
  }

  function clearTaskField() {

    document.getElementById('task-input').value = "";
  }

  var taskEnter = document.getElementById('addTask');
  if (taskEnter) {
    taskEnter.addEventListener('click', taskEnter);
  };