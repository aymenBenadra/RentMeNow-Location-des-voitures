// Contact form Submission
const form = document.querySelector("#contact-form");

if (form != undefined) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = {
      name: document.querySelector("#name").value,
      email: document.querySelector("#email").value,
      message: document.querySelector("#message").value,
    };

    Swal.fire(
      "Message Sent Successfully!",
      "Your message is as follows:<br />Name: " +
        data.name +
        "<br />Email: " +
        data.email +
        (data.message ? "<br />Message: " + data.message : ""),
      "success"
    ).then(() => {
      form.submit();
    });
  });
}

// Gallery generation
const gallery = document.querySelector("#gallery .cars");

if (gallery != undefined) {
  fetch("./assets/db/cars.json")
    .then((res) => res.json())
    .then((data) => populateGallery(data));
}

function populateGallery(cars) {
  if (cars != null) {
    if (gallery.id != "home-gallery-cars")
      for (let car of cars) {
        gallery.appendChild(createCar(car));
      }
    else
      for (let i = 0; i < 3; i++) {
        gallery.appendChild(createCar(cars[i]));
      }
  }
}

function createCar(car) {
  const carImg = document.createElement("img");
  carImg.src = car.image;
  carImg.alt = car.caption;

  const carCaption = document.createElement("figcaption");
  carCaption.innerText = car.caption;

  const carCard = document.createElement("figure");
  carCard.appendChild(carImg);
  carCard.appendChild(carCaption);

  const carDiv = document.createElement("div");
  carDiv.classList.add("car");
  carDiv.appendChild(carCard);

  return carDiv;
}

// Reservation page
const reservation = document.querySelector("#reservation");
const bav = document.getElementsByName("bav");

// if checkbox is checked, uncheck the other
bav.forEach((b) => {
  b.addEventListener("click", (event) => {
    if (event.target.checked) {
      bav.forEach((b) => {
        if (b.id != event.target.id) b.checked = false;
      });
    }
  });
});

//
