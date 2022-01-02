// Gallery generation
const gallery = document.querySelector("#gallery .cars");

fetch("./assets/db/cars.json")
  .then((res) => res.json())
  .then((data) => populateGallery(data));

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
