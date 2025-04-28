const add = document.querySelectorAll(".add");
const addContainer = document.querySelector(".add-container");

add.forEach((e) => {
  e.addEventListener("click", function () {
    // add class
    addContainer.classList.add("active");
    // remove class
    const closeButton = document.querySelector(".close");
    closeButton.addEventListener("click", function () {
      addContainer.classList.remove("active");
    });
  });
});

const toDo = document.getElementById("toDo");
const check = document.querySelector(".check");

check.addEventListener("click", function () {
  const ul = document.querySelectorAll(".ul");
  const array = toDo.value.split(/\r?\n/);

  ul.forEach((e) => {
    array.map((item) => {
      const list = document.createElement("li");
      const textList = document.createTextNode(item);
      list.appendChild(textList);
      e.appendChild(list);
    });
  });

  // get the date input
  const formatDate = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const day = dateObj.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const calculateDate = (offset) => {
    const dateObj = new Date();
    dateObj.setDate(dateObj.getDate() + offset);
    return formatDate(dateObj);
  };

  const date = document.getElementById("date").value;
  const today = calculateDate(0);
  const yesterday = calculateDate(-1);
  const tomorrow = calculateDate(1);

  if (date === today) {
    console.log("Today");
  } else if (date === yesterday) {
    console.log("Yesterday");
  } else if (date === tomorrow) {
    console.log("Tomorrow");
  }
  
  addContainer.classList.remove("active");
});

function card(m) {
  return `<div class="card card-small">
                <div class="header-1">
                  <h3 class="date">04/04/2025</h3>
                  <a class="edit-list">ini edit</a>
                </div>
                <div class="header-2">
                  <h1 class="day">Today</h1>
                </div>
                <ul>
                  <li>
                    Lorem ipsum dolor sit amet.
                    <input type="checkbox" id="checkbox">
                  </li>
                  <li>
                    Lorem ipsum dolor sit amet.
                    <input type="checkbox" id="checkbox">
                  </li>
                  <li>
                    Lorem ipsum dolor sit amet.
                    <input type="checkbox" id="checkbox">
                  </li>
                  <li>
                    Lorem ipsum dolor sit amet.
                    <input type="checkbox" id="checkbox">
                  </li>
                </ul>
              </div>
            </div>`;
}
