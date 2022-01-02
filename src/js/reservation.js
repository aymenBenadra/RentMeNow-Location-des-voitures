// Reservation page
const reservation = document.querySelector("#reservation-form");
const vehicles = document.querySelector("#vehicles");
const vehicleOptions = document.querySelectorAll("#vehicles option");
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

// disable unavailable options
fetch("./assets/db/vehicles.json")
  .then((res) => res.json())
  .then((data) => renderVehicle(data));

function renderVehicle(vehiclesData) {
  vehicles.addEventListener("change", (event) => {
    bav.forEach((b) => (b.checked = false));
    if (event.target.value == "--") {
      reservation.reset();
    } else {
      // Find selected vehicle data
      console.log(event.target.value);
      const vehicle = vehiclesData.filter(
        (v) => v.type == event.target.value
      )[0];
      console.log(vehicle);

      // Disable unavailable Checkboxes
      bav.forEach((b) => {
        if (!vehicle.bav.includes(b.value)) b.disabled = true;
        else b.disabled = false;
      });

      // // Disable unavailable Moteurs
      // vehicleOptions.forEach((o) => {
      //   if (vehicle.options.includes(o.value)) o.disabled = false;
      //   else o.disabled = true;
      // });
    }
  });
}
