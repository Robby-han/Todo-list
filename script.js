const add = document.querySelectorAll(".add");
const addContainer = document.querySelector(".add-container");
const bColor = document.querySelectorAll(".background-color");

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

let selectedColor = "";
bColor.forEach((e) => {
  e.addEventListener("click", function () {
    const colors = [
      "red",
      "yellow",
      "orange",
      "blue",
      "green",
      "magenta",
      "indigo",
      "brown",
    ];

    colors.forEach((color) => addContainer.classList.remove(color));
    colors.forEach((color) => {
      if (e.classList.contains(color)) {
        addContainer.classList.add(color);
        selectedColor = color;
      }
    });
  });
});

const toDo = document.getElementById("toDo");
const check = document.querySelector(".check");
check.addEventListener("click", function () {
  const array = toDo.value.split(/\r?\n/);

  const listItem = array.map((item) => {
    const list = document.createElement("li");
    const textList = document.createTextNode(item);
    list.appendChild(textList);
    return item;
  });

  // get the date input
  const formatDate = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const day = dateObj.getDate().toString().padStart(2, "0");
    return `${day}/${month}/${year}`;
  };

  const calculateDate = (offset) => {
    const dateObj = new Date();
    dateObj.setDate(dateObj.getDate() + offset);
    return formatDate(dateObj);
  };

  const dateInput = document.getElementById("date").value;
  const today = calculateDate(0);
  const yesterday = calculateDate(-1);
  const tomorrow = calculateDate(1);

  let formattedDate = "";
  if (dateInput) {
    const dateParts = dateInput.split("-");
    formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
  }

  let dateResult = "";
  if (formattedDate === today) {
    dateResult = "Today";
  } else if (formattedDate === yesterday) {
    dateResult = "Yesterday";
  } else if (formattedDate === tomorrow) {
    dateResult = "Tomorrow";
  }

  const resultObject = {
    date: formattedDate,
    day: dateResult,
    tasks: listItem,
    color: selectedColor,
  };

  addList(resultObject);

  addContainer.addEventListener("transitionend", function () {
    if (!this.classList.contains("active")) {
      document.getElementById("toDo").value = "";
      document.getElementById("date").value = "";

      // Remove any added color classes
      const colors = [
        "red",
        "yellow",
        "orange",
        "blue",
        "green",
        "magenta",
        "indigo",
        "brown",
      ];
      colors.forEach((color) => addContainer.classList.remove(color));

      selectedColor = "";
    }
  });

  let currentCard = null;
  document.querySelectorAll(".edit-list").forEach((editBtn) => {
    editBtn.addEventListener("click", function () {
      currentCard = this.closest(".card");

      const taskItems = [...currentCard.querySelectorAll("li")].map(
        (li) => li.textContent
      );
      const dateText = currentCard.querySelector(".date").textContent;

      // Set background color
      selectedColor = currentCard.classList[2];
      addContainer.classList.add(selectedColor);

      // Populate input fields
      document.getElementById("toDo").value = taskItems.join("\n");
      document.getElementById("date").value = dateText
        .split("/")
        .reverse()
        .join("-");

      // Show `add-container`
      addContainer.classList.add("active");
    });
  });

  if (currentCard) {
    const taskItems = document.getElementById("toDo").value.split(/\r?\n/);

    currentCard.querySelector(".date").textContent = document
      .getElementById("date")
      .value.split("-")
      .reverse()
      .join("/");
    currentCard.querySelector(".day").textContent = calculateDate(
      document.getElementById("date").value
    );
    currentCard.querySelector("ul").innerHTML = taskItems
      .map((task) => `<li>${task}<input type="checkbox"></li>`)
      .join("");
    currentCard.className = `card ${selectedColor}`;

    currentCard = null;
  }

  addContainer.classList.remove("active");
});

//remove button
const removeMode = document.querySelectorAll(".remove");
const trash = document.querySelectorAll(".del");
let selectionMode = false;

removeMode.forEach((e) => {
  e.addEventListener("click", function () {
    selectionMode = !selectionMode;
    document.querySelectorAll(".card").forEach((card) => {
      card.classList.toggle("selectable", selectionMode);
    });

    trash.forEach((trash) => {
      trash.classList.add("active");
    });
  });
});

document.addEventListener("click", function (event) {
  if (selectionMode && event.target.closest(".card")) {
    event.target.closest(".card").classList.toggle("selected"); // Highlight selection
  }
});

trash.forEach((ev) => {
  ev.addEventListener("click", function () {
    document.querySelectorAll(".card.selected").forEach((card) => {
      card.remove();
    });

    selectionMode = false;
    trash.forEach((e) => {
      e.classList.remove("active");
    });
  });
});

function addList(items) {
  const list = cards(items);
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = list;

  const cardBody = document.querySelectorAll(".box-container");
  cardBody.forEach((e) => {
    while (tempDiv.firstChild) {
      e.appendChild(tempDiv.firstChild);
    }
  });
}

function cards(item) {
  const tasksHTML = item.tasks
    .map((task) => `<li>${task}<input type="checkbox" id="checkbox"></li>`)
    .join("");
  let size = "";
  if (item.tasks.length < 6) {
    size = "card-small";
  } else if (item.tasks.length >= 6 && item.tasks.length <= 8) {
    size = "card-medium";
  } else if (item.tasks.length > 8) {
    size = "card-large";
  }
  return `<div class="card ${size} ${item.color}">
                  <div class="header-1">
                    <h3 class="date">${item.date}</h3>
                    <a class="edit-list" data-id="${item.date}">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="white"><path d="M80 0v-160h800V0H80Zm160-320h56l312-311-29-29-28-28-311 312v56Zm-80 80v-170l448-447q11-11 25.5-17t30.5-6q16 0 31 6t27 18l55 56q12 11 17.5 26t5.5 31q0 15-5.5 29.5T777-687L330-240H160Zm560-504-56-56 56 56ZM608-631l-29-29-28-28 57 57Z"/></svg>
                    </a>
                  </div>
                  <div class="header-2">
                    <h1 class="day">${item.day}</h1>
                  </div>
                  <ul>
                    ${tasksHTML}
                  </ul>
                </div>
              </div>`;
}
