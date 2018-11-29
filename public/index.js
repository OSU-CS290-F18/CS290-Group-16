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
    var newTaskContext = {
      description: inputTaskLine.value
    }
    var newTaskHTML = Handlebars.templates.task(newTaskContext);
    inputTaskLine.insertAdjacentHTML("beforebegin", newTaskHTML);
  }
});
