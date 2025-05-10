// fade animation
const backgroundImage = document.querySelector(".background-images");
const title = document.querySelector(".title");
backgroundImage.classList.add("fade-in");
title.classList.add("fade-in-y");
title.nextElementSibling.classList.add("fade-in-x");
title.nextElementSibling.nextElementSibling.classList.add("fade-in-min-x");
setInterval(() => {
  backgroundImage.classList.remove("fade-in");
  title.classList.remove("fade-in-y");
  title.nextElementSibling.classList.remove("fade-in-x");
  title.nextElementSibling.nextElementSibling.classList.remove("fade-in-min-x");
}, 2000);

document.addEventListener("DOMContentLoaded", function () {
  const add = document.querySelectorAll(".add");
  const addContainer = document.querySelector(".add-container");
  const note = document.querySelector(".note-head");
  const bColor = document.querySelectorAll(".background-color");
  // Choose which container to append to
  const cardListBody = document.querySelector(".List");
  const cardNoteBody = document.querySelector(".Note");
  const historyContainer = document.querySelector(".hist");

  // smoth scroll
  $(document).ready(function () {
    $("a").on("click", function (event) {
      if (this.hash !== "") {
        event.preventDefault();
        const hash = this.hash;

        $("html, body").animate(
          {
            scrollTop: $(hash).offset().top,
          },
          800,
          function () {
            window.location.hash = hash;
          }
        );
      }
    });
  });

  // web reset
  let storedCards = JSON.parse(localStorage.getItem("cards")) || [];
  let historyCards = JSON.parse(localStorage.getItem("history")) || [];

  // history card
  historyCards.forEach((card) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = cards(card);
    historyContainer.appendChild(tempDiv.firstChild);
  });

  storedCards.forEach((card) => addList(card));
  checkEmptyContainers();

  // save to local storage
  function saveToLocalStorage(items) {
    let storedCards = JSON.parse(localStorage.getItem("cards")) || [];
    // Check if a card with the same date already exists
    const exists = storedCards.some((card) => card.id === items.id);
    if (!exists) {
      storedCards.push(items);
      localStorage.setItem("cards", JSON.stringify(storedCards));
    }
  }

  // add card
  add.forEach((e) => {
    e.addEventListener("click", function () {
      // add class
      addContainer.classList.add("active");
      if (e.classList.contains("notes")) {
        note.classList.add("display");
      }
      // remove class
      const closeButton = document.querySelector(".close");
      closeButton.addEventListener("click", function () {
        if (e.classList.contains("notes")) {
          note.classList.remove("display");
        }
        addContainer.classList.remove("active");
      });
    });
  });

  // select card color
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
  // event when user click ok on add list
  check.addEventListener("click", function () {
    // notes title
    const head = document.querySelector(".note-head");

    // splitting list when user click enter
    const array = toDo.value.split(/\r?\n/);
    const listItem = array.map((item) => {
      const list = document.createElement("li");
      const textList = document.createTextNode(item);
      list.appendChild(textList);
      return item;
    });

    // random id
    function generateRandomId() {
      return Math.random().toString(36).substr(2, 9); // Creates a random string
    }

    // get the date input
    const formatDate = (dateObj) => {
      const year = dateObj.getFullYear();
      const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
      const day = dateObj.getDate().toString().padStart(2, "0");
      return `${day}/${month}/${year}`;
    };

    // calculates for get day name( today, tomorrow and yesterday )
    const calculateDate = (offset) => {
      const dateObj = new Date();
      dateObj.setDate(dateObj.getDate() + offset);
      return formatDate(dateObj);
    };

    const dateInput = document.getElementById("date").value;
    const today = calculateDate(0);
    const yesterday = calculateDate(-1);
    const tomorrow = calculateDate(1);

    // change foormate dates (yyyy-mm-dd) to (dd-mm-yyyy)
    let formattedDate = "";
    if (dateInput) {
      const dateParts = dateInput.split("-");
      formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
    }

    // day name
    let dateResult = "";
    if (formattedDate === today) {
      dateResult = "Today";
    } else if (formattedDate === yesterday) {
      dateResult = "Yesterday";
    } else if (formattedDate === tomorrow) {
      dateResult = "Tomorrow";
    }

    // obj for saves list
    const resultObject = {
      id: generateRandomId(),
      date: formattedDate,
      day: dateResult,
      title: head.value,
      tasks: listItem,
      color: selectedColor,
    };

    addList(resultObject);

    // reset addContainer value
    addContainer.addEventListener("transitionend", function () {
      if (!this.classList.contains("active")) {
        document.getElementById("toDo").value = "";
        document.getElementById("date").value = "";
        document.getElementById("note").value = "";

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

    addContainer.classList.remove("active");
    note.classList.remove("display");
  });

  // edit button
  let currentCard = null;
  document.addEventListener("click", function (ev) {
    if (ev.target.classList.contains("edit-list")) {
      currentCard = ev.target.closest(".card");

      const taskItems = [...currentCard.querySelectorAll("li")].map(
        (li) => li.textContent
      );
      const dateText = currentCard.querySelector(".date").textContent;
      const titleElement = currentCard.querySelector(".note-header");
      const titleText = titleElement ? titleElement.textContent : "";

      // Set background color
      selectedColor = currentCard.classList[2];
      addContainer.classList.add(selectedColor);

      // Populate input fields
      document.getElementById("toDo").value = taskItems.join("\n");
      document.getElementById("date").value = dateText
        .split("/")
        .reverse()
        .join("-");
      if (titleText) {
        document.getElementById("note").value = titleText || "";
        note.classList.add("display");
      }
      // Show `add-container`
      addContainer.classList.add("active");

      const closeButton = document.querySelector(".close");
      closeButton.addEventListener("click", function () {
        add.forEach((e) => {
          if (e.classList.contains("notes")) {
            note.classList.remove("display");
          }
          addContainer.classList.remove("active");
        });
      });
    }
  });
  // });
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

  // remove button
  const removeMode = document.querySelectorAll(".remove");
  const trash = document.querySelectorAll(".del");
  const history = document.querySelectorAll(".save-history");

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
      history.forEach((h) => {
        h.classList.add("active");
      });
    });
  });

  // selection mode
  document.addEventListener("click", function (event) {
    if (selectionMode && event.target.closest(".card")) {
      event.target.closest(".card").classList.toggle("selected");
    }
  });

  // save to history
  history.forEach((btn) => {
    btn.addEventListener("click", function () {
      let storedCards = JSON.parse(localStorage.getItem("cards")) || [];
      let historyCards = JSON.parse(localStorage.getItem("history")) || [];

      document.querySelectorAll(".card.selected").forEach((card) => {
        const cardID = card.querySelector(".edit-list").getAttribute("data-id");
        const cardObject = storedCards.find((c) => c.id === cardID);

        if (cardObject) {
          historyCards.push(cardObject);
          storedCards = storedCards.filter((c) => c.id !== cardID);

          // Move card to history container
          document.querySelector(".hist").appendChild(card);
          card.classList.remove("selected");
        }
      });

      localStorage.setItem("history", JSON.stringify(historyCards));
      localStorage.setItem("cards", JSON.stringify(storedCards));

      checkEmptyContainers();
      selectionMode = false;
      document
        .querySelectorAll(".card")
        .forEach((card) => card.classList.remove("selectable"));
      document
        .querySelectorAll(".save-history, .del")
        .forEach((btn) => btn.classList.remove("active"));
    });
  });

  // delete button
  trash.forEach((ev) => {
    ev.addEventListener("click", function () {
      selectionMode = !selectionMode;
      let storedCards = JSON.parse(localStorage.getItem("cards")) || [];
      let historyCards = JSON.parse(localStorage.getItem("history")) || [];

      const selectedCards = document.querySelectorAll(".card.selected");

      selectedCards.forEach((card) => {
        const cardID = card.querySelector(".edit-list").getAttribute("data-id");

        if (card.closest(".hist")) {
          historyCards = historyCards.filter((c) => c.id !== cardID);
          localStorage.setItem("history", JSON.stringify(historyCards));
        } else {
          storedCards = storedCards.filter((c) => c.id !== cardID);
          localStorage.setItem("cards", JSON.stringify(storedCards));
        }
        card.remove();
      });
      checkEmptyContainers();
      selectionMode = false;
      document.querySelectorAll(".save-history, .del").forEach((e) => {
        document
          .querySelectorAll(".card")
          .forEach((card) => card.classList.remove("selectable"));
        e.classList.remove("active");
      });
    });
  });

  // add card to container
  function addList(items) {
    const list = cards(items);
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = list;

    // const cardNoteBody = document.querySelector(".box-container.Note");
    if (items.title === "") {
      while (tempDiv.firstChild) {
        cardListBody.appendChild(tempDiv.firstChild);
      }
    } else {
      while (tempDiv.firstChild) {
        cardNoteBody.appendChild(tempDiv.firstChild);
      }
    }
    // save card to local storage
    saveToLocalStorage(items);
    checkEmptyContainers();
  }

  // category select
  const AllCategory = document.querySelector(".ALL");
  const noteCategory = document.querySelector(".NOTE");
  const listCategory = document.querySelector(".TODO");

  noteCategory.addEventListener("click", function () {
    document
      .querySelectorAll(".LIST")
      .forEach((e) => (e.style.display = "none"));
    document
      .querySelectorAll(".NOTES")
      .forEach((e) => (e.style.display = "block"));
  });
  listCategory.addEventListener("click", function () {
    document
      .querySelectorAll(".NOTES")
      .forEach((e) => (e.style.display = "none"));
    document
      .querySelectorAll(".LIST")
      .forEach((e) => (e.style.display = "block"));
  });
  AllCategory.addEventListener("click", function () {
    document
      .querySelectorAll(".card")
      .forEach((e) => (e.style.display = "block"));
  });

  // message appear
  function checkEmptyContainers() {
    if (cardListBody.children.length === 1) {
      cardListBody.firstElementChild.classList.add("display-flex");
    } else {
      cardListBody.firstElementChild.classList.remove("display-flex");
    }

    if (cardNoteBody.children.length === 1) {
      cardNoteBody.firstElementChild.classList.add("display-flex");
    } else {
      cardNoteBody.firstElementChild.classList.remove("display-flex");
    }

    if (historyContainer.children.length === 1) {
      historyContainer.firstElementChild.classList.add("display-flex");
    } else {
      historyContainer.firstElementChild.classList.remove("display-flex");
    }
  }

  // card items
  function cards(item) {
    const tasksHTML = item.tasks
      .map(
        (task) => `<li><p>${task}</p><input type="checkbox" id="checkbox"></li>`
      )
      .join("");
    let size = "";
    if (item.tasks.length < 6) {
      size = "card-small";
    } else if (item.tasks.length >= 6 && item.tasks.length <= 8) {
      size = "card-medium";
    } else if (item.tasks.length > 8) {
      size = "card-large";
    }

    if (item.title == "") {
      return `<div class="card ${size} ${item.color} LIST">
                      <div class="header-1">
                        <h3 class="date">${item.date}</h3>
                        <a class="edit-list" data-id="${item.id}">
                        <img class="edit-list" src="./img/border_color_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.png">
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
    } else {
      return `<div class="card ${size} ${item.color} NOTES">
                        <div class="header-1">
                          <h3 class="date">${item.date}</h3>
                          <a class="edit-list" data-id="${item.id}">
                          <img class="edit-list" src="./img/border_color_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.png">
                          </a>
                        </div>
                        <div class="header-2">
                          <h1 class="note-header">${item.title}</h1>
                        </div>
                        <ul>
                          ${tasksHTML}
                        </ul>
                      </div>
                    </div>`;
    }
  }
});
