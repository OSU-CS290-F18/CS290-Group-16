var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1;
var yyyy = today.getFullYear();

if(dd<10) {
    dd = '0'+dd
}

if(mm<10) {
    mm = '0'+mm
}

today = 'Today: ' + mm + ' / ' + dd + ' / ' + yyyy;
document.getElementById('date').innerHTML = today;

//Add task button
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

//Accordion to show hide 
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



// Add new task after hitting enter on input task line
var inputTaskLine = document.querySelector("#task-input");
inputTaskLine.addEventListener("keyup", function(event) {
  event.preventDefault();
  if (event.keyCode === 13) {
    var postRequest = new XMLHttpRequest();
    var requestURL = '/insertTask';
    postRequest.open('POST', requestURL);

    var requestBody = JSON.stringify({
      description: inputTaskLine.value
    });

    postRequest.addEventListener('load', function (event) {
      if (event.target.status === 200) {
        var newTaskContext = {
          description: inputTaskLine.value
        }
        var newTaskHTML = Handlebars.templates.task(newTaskContext);
        inputTaskLine.insertAdjacentHTML("beforebegin", newTaskHTML);
        inputTaskLine.value = "";
      }
      else {
        alert("Error storing task: " + event.target.response);
      }
    });

    postRequest.setRequestHeader('Content-Type', 'application/json');
    postRequest.send(requestBody);

    location.reload();
  }
});

//Add task button action
var inputTaskButton = document.querySelector("#addTask");
inputTaskButton.addEventListener("click", function(event) {
  var postRequest = new XMLHttpRequest();
  var requestURL = '/insertTask';
  postRequest.open('POST', requestURL);

  var requestBody = JSON.stringify({
    description: inputTaskLine.value
  });

  postRequest.addEventListener('load', function (event) {
    if (event.target.status === 200) {
      var newTaskContext = {
        description: inputTaskLine.value
      }
      var newTaskHTML = Handlebars.templates.task(newTaskContext);
      inputTaskLine.insertAdjacentHTML("beforebegin", newTaskHTML);
      inputTaskLine.value = "";
    }
    else {
      alert("Error storing task: " + event.target.response);
    }
  });

  postRequest.setRequestHeader('Content-Type', 'application/json');
  postRequest.send(requestBody);

  location.reload();
});

//Remove task from the dom button
var removeButtons = document.querySelectorAll('.remove-button');
removeButtons.forEach(function(elem) {
  elem.addEventListener('click', function(event) {

    var postRequest = new XMLHttpRequest();
    var requestURL = '/removeTask';
    postRequest.open('POST', requestURL);

    var collection = elem.parentNode.parentNode.id;
    if (collection == 'incomplete-tasks-list') {
      collection = 'incomplete';
    }
    else if (collection == 'completed-tasks-list') {
      collection = 'complete';
    }

    var requestBody = JSON.stringify({
      collection: collection,
      description: elem.parentNode.childNodes[0].textContent
    });

    postRequest.addEventListener('load', function (event) {
      if (event.target.status === 200) {
        elem.parentNode.remove();
      }
      else {
        alert("Error removing task: " + event.target.response);
      }
    });

    postRequest.setRequestHeader('Content-Type', 'application/json');
    postRequest.send(requestBody);

    location.reload();
  });
});

var taskText = document.querySelectorAll('#incomplete-tasks-panel span');
taskText.forEach(function(elem) {
  elem.addEventListener('click', function(event) {

    var description = elem.textContent;

    var source = 'incomplete';
    var destination = 'complete';

    var postRequest = new XMLHttpRequest();
    var requestURL = '/moveTask';
    postRequest.open('POST', requestURL);

    var requestBody = JSON.stringify({
      source: source,
      destination: destination,
      description: description
    });

    postRequest.addEventListener('load', function (event) {
      if (event.target.status === 200) {
        elem.parentNode.remove();
        var newTaskContext = {
          description: description
        }
        var completedList = document.querySelector('#completed-tasks-list');
        var newTaskHTML = Handlebars.templates.task(newTaskContext);
        completedList.insertAdjacentHTML("beforeend", newTaskHTML);
      }
      else {
        alert("Error moving task: " + event.target.response);
      }
    });

    postRequest.setRequestHeader('Content-Type', 'application/json');
    postRequest.send(requestBody);

    location.reload();
  });
});
