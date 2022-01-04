// Reservation page
const reservation = document.querySelector("#reservation-form");
const vehicles = document.querySelector("#vehicles");
const vehicleOptions = document.querySelectorAll("#vehicles option");
const bav = document.getElementsByName("bav");
const moteur = document.querySelector("#moteur");
const moteurOptions = document.querySelectorAll("#moteur option");
const jours = document.querySelector("#jours");
const rebriquePrix = document.querySelector("#rebriquePrix");
const moteurTTC = {
  electrique: 0.05,
  hybride: 0.09,
  essence: 0.14,
  diesel: 0.21,
};
let price = {
  net: 0,
  ttc: 0,
};
let vehicleData = null;

// if checkbox is checked, uncheck the other
// bav.forEach((b) => {
//   b.addEventListener("click", (event) => {
//     if (event.target.checked) {
//       bav.forEach((b) => {
//         if (b.id != event.target.id) b.checked = false;
//       });
//     }
//   });
// });

// Get data from file
fetch("./assets/db/vehicles.json")
  .then((res) => res.json())
  .then((data) => renderVehicle(data));

function renderVehicle(vehiclesData) {
  vehicles.addEventListener("change", (event) => {
    // Reset Form
    if (event.target.value == "--") {
      reservation.reset();
      bav.forEach((b) => {
        b.checked = false;
      });
      moteurOptions[0].selected = true;
      jours.value = 1;
      jours.disabled = true;
    } else {
      // Find selected vehicle data
      vehicleData = vehiclesData.filter((v) => v.type == event.target.value)[0];

      // Check available BAV
      bav.forEach((b) => {
        if (vehicleData.bav == b.value) {
          b.checked = true;
        } else b.checked = false;
      });

      // reset moteur options
      moteurOptions[0].selected = true;

      // Disable unavailable Moteurs
      moteurOptions.forEach((o) => {
        console.log(o.disabled);
        if (!vehicleData.moteur.includes(o.value)) o.disabled = true;
        else o.disabled = false;
      });

      // Enable jours
      jours.disabled = false;

      // Calculate price without moteur
      price.net =
        vehicleData.bav == "auto"
          ? vehicleData.tarif + vehicleData.tarif * 0.19
          : vehicleData.tarif;

      // Append price to the form
      document.querySelector("#prix").value = price.net;
    }
  });
}

moteur.addEventListener("change", (event) => {
  if (!event.target.value == "--") {
    // Reset price to net
    price.ttc = price.net;

    // Append price to the form
    document.querySelector("#prix").value = price.net;
  } else {
    // Calculate price with moteur
    price.ttc = price.net + price.net * moteurTTC[event.target.value];

    // Append price to the form
    document.querySelector("#prix").value = price.ttc;
  }
});

jours.addEventListener("change", (event) => {
  // Calculate price with number of days
  price.ttc = price.ttc * event.target.value;

  // Append price to the form
  document.querySelector("#prix").value = price.ttc;
});
