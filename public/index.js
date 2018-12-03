var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight){
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });
}

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

  }
});

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

  });
});
