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
  const moteurTTC = data["moteurTTC"];
  let vehicleData;

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
      rebriquePrix.value = "";
      price.net = 0;
      price.moteur = 0;
      price.total = 0;
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
      // if (vehicleData.moteur.length > 1) {
      moteurOptions.forEach((o) => {
        console.log(o.disabled);
        if (vehicleData.moteur.includes(o.value) || o.value == "--")
          o.disabled = false;
        else o.disabled = true;
      });
      // } else {
      //   moteurOptions.forEach((o) => {
      //     console.log(o.disabled);
      //     if (vehicleData.moteur.includes(o.value)) {
      //       o.disabled = false;
      //       // o.selected = true;
      //     } else o.disabled = true;
      //   });
      // }

      // Enable jours
      jours.disabled = false;

      // Calculate price without moteur
      price.net =
        vehicleData.bav == "auto"
          ? vehicleData.tarif + vehicleData.tarif * 0.19
          : vehicleData.tarif;

      // Calculate price with moteur
      // if (price.moteur != 0) {
      //   price.total -= price.moteur;
      //   price.moteur = 0;
      // }
      // price.moteur = price.net * moteurTTC[moteur.value];
      // Add moteur price to total
      price.total = price.total + price.moteur;

      // multiply price by jours
      price.total = price.net * jours.value;

      // Append price to the form
      document.querySelector("#prix").value = intl.format(price.total);

      // update rebrique de prix
      rebriquePrix.value = printableText(vehicleData);
    }
  });

  // Calculate price with moteur
  moteur.addEventListener("change", (event) => {
    if (event.target.value == "--") {
      // Remove previous moteur price
      if (price.moteur != 0) {
        price.total -= price.moteur;
        price.moteur = 0;
      }

      // Enable print button
      printButton.disabled = true;

      // Enable send button
      document.querySelector("#send").disabled = true;

      // reset price to total
      document.querySelector("#prix").value = intl.format(
        price.total * jours.value
      );
    } else {
      // Calculate price with moteur
      if (price.moteur != 0) {
        price.total -= price.moteur;
        price.moteur = 0;
      }
      price.moteur = price.net * moteurTTC[event.target.value];
      // Add moteur price to total
      price.total = price.total + price.moteur;

      // Enable print button
      printButton.disabled = false;

      // Enable send button
      document.querySelector("#send").disabled = false;

      // Append price to the form
      document.querySelector("#prix").value = intl.format(
        price.total * jours.value
      );
    }
    // update rebrique de prix
    rebriquePrix.value = printableText(vehicleData);
  });

  jours.addEventListener("change", (event) => {
    // Append price to the form
    document.querySelector("#prix").value = intl.format(
      price.total * event.target.value
    );

    // update rebrique de prix
    rebriquePrix.value = printableText(vehicleData);
  });

  printButton.addEventListener("click", () => {
    // Hide non printable elements
    document.querySelectorAll(".nonPrintable").forEach((e) => {
      e.style.visibility = "hidden";
    });

    // Print page
    window.print();

    // Reset layout
    document.querySelectorAll(".nonPrintable").forEach((e) => {
      e.style.visibility = "visible";
    });
  });
}

function printableText(vehicleData) {
  intl = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });
  let text = `Selected Vehicle: ${vehicleData.type}\n+${intl.format(
    vehicleData.tarif
  )}\nSelected BAV: ${
    vehicleData.bav == "auto" ? "+19%" : "+0%"
  }\nPrix sans Moteur: ${intl.format(price.net)}\n${
    price.moteur != 0 ? "Moteur: +" + intl.format(price.moteur) + "\n" : ""
  }${
    price.moteur != 0
      ? "Prix avec Moteur: " + intl.format(price.net + price.moteur) + "\n"
      : ""
  }Jours: ${jours.value}\nPrix Total: ${intl.format(
    price.total * jours.value
  )}`;
  return text;
}
