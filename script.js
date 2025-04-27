const add = document.querySelectorAll(".add");

add.forEach((e) => {
  e.addEventListener("click", function () {
    // add class
    const addContainer = document.querySelector(".add-container");
    addContainer.classList.add("active");
    // remove class
    const closeButton = document.querySelector(".close");
    closeButton.addEventListener("click", function () {
      addContainer.classList.remove("active");
    });
  });
});

