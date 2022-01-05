// Reservation page
const vehicles = document.querySelector("#vehicles");
const bav = document.getElementsByName("bav");
const moteur = document.querySelector("#moteur");
const moteurOptions = document.querySelectorAll("#moteur option");
const jours = document.querySelector("#jours");
const rebriquePrix = document.querySelector("#rebriquePrix");
const printButton = document.querySelector("#print");
// formatting price
let intl = new Intl.NumberFormat("fr-FR");
let price = {
  net: 0,
  moteur: 0,
  total: 0,
};

// Get data from file
fetch("./assets/db/vehicles.json")
  .then((res) => res.json())
  .then((data) => renderData(data));

// Render Data
function renderData(data) {
  const vehiclesData = data["vehicles"];
  let vehicleData;
  const moteurTTC = data["moteurTTC"];

  vehicles.addEventListener("change", (event) => {
    // Reset Form
    if (event.target.value == "--") {
      document.querySelector("#reservation-form").reset();
      bav.forEach((b) => {
        b.checked = false;
      });
      moteurOptions[0].selected = true;
      jours.value = 1;
      jours.disabled = true;
      printButton.disabled = true;
    } else {
      // Find selected vehicle data
      vehicleData = vehiclesData.filter((v) => v.type == event.target.value)[0];

      // Check available BAV
      bav.forEach((b) => {
        if (vehicleData.bav == b.value) b.checked = true;
        else b.checked = false;
      });

      // reset moteur options
      moteurOptions[0].selected = true;

      // Disable unavailable Moteurs
      moteurOptions.forEach((o) => {
        console.log(o.disabled);
        if (vehicleData.moteur.includes(o.value) || o.value == "--")
          o.disabled = false;
        else o.disabled = true;
      });

      // Enable jours
      jours.disabled = false;

      // Enable print button
      printButton.disabled = false;

      // Calculate price without moteur
      price.net =
        vehicleData.bav == "auto"
          ? vehicleData.tarif + vehicleData.tarif * 0.19
          : vehicleData.tarif;

      // multiply price by jours
      price.total = price.net * jours.value;

      // Append price to the form
      document.querySelector("#prix").value = intl.format(price.total);
    }
  });

  // Calculate price with moteur
  moteur.addEventListener("change", (event) => {
    if (event.target.value == "--") {
      // Remove previous moteur price
      if (price.moteur != 0) price.total -= price.moteur;
      // reset price to total
      document.querySelector("#prix").value = intl.format(
        price.total * jours.value
      );
    } else {
      // Calculate price with moteur
      if (price.moteur == 0)
        price.moteur = price.net * moteurTTC[event.target.value];
      else {
        price.total -= price.moteur;
        price.moteur = price.net * moteurTTC[event.target.value];
      }
      // Add moteur price to total
      price.total = price.total + price.moteur;

      // Append price to the form
      document.querySelector("#prix").value = intl.format(
        price.total * jours.value
      );
    }
  });

  jours.addEventListener("change", (event) => {
    // Append price to the form
    document.querySelector("#prix").value = intl.format(
      price.total * event.target.value
    );
  });

  printButton.addEventListener("click", () => {
    const rebriquePrix = document.querySelector("#rebriquePrix");

    // Hide non printable elements
    document.querySelectorAll(".nonPrintable").forEach((e) => {
      e.style.display = "none";
    });
    rebriquePrix.value = printableText(vehicleData, price, jours.value);

    // Print page
    window.print();

    // Reset layout
    document.querySelectorAll(".nonPrintable").forEach((e) => {
      e.style.display = "block";
    });
  });
}

function printableText(vehicleData, price, jours) {
  intl = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });
  let text = `Selected Vehicle: ${vehicleData.type}\n+${intl.format(vehicleData.tarif)}\nSelected BAV:\n${vehicleData.bav == "auto" ? "Automatique +19%" : "Manuelle +0%"}\nPrix sans Moteur: ${intl.format(price.net)}\nMoteur: ${price.moteur != 0 ? "+" + intl.format(price.moteur) : ""}\nJours: ${jours}\nPrix Total: ${intl.format(price.total * jours)}`;
  return text;
}
