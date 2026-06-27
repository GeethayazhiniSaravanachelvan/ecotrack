const themeBtn = document.getElementById("themeToggle");

themeBtn.onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
};

window.onload = () => {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }

  const saved = JSON.parse(localStorage.getItem("ecoData"));
  if (saved) {
    Object.keys(saved).forEach(k => {
      if (document.getElementById(k)) {
        document.getElementById(k).value = saved[k];
      }
    });
  }
};

function calculate() {
  let electricity = +document.getElementById("electricity").value || 0;
  let travel = +document.getElementById("travel").value || 0;
  let water = +document.getElementById("water").value || 0;
  let plastic = document.getElementById("plastic").value;
  let flights = +document.getElementById("flights").value || 0;

  let elecCO2 = electricity * 0.82;
  let transCO2 = travel * 0.12 * 4;
  let waterCO2 = water * 0.001;
  let plasticCO2 = plastic === "high" ? 50 : plastic === "medium" ? 30 : 10;
  let flightCO2 = flights * 250;

  let total = elecCO2 + transCO2 + waterCO2 + plasticCO2 + flightCO2;
  let score = Math.max(0, 100 - total / 10);

  let rating =
    score > 80 ? "Excellent" :
    score > 60 ? "Good" :
    score > 40 ? "Average" : "High Impact";

  document.getElementById("total").innerText = total.toFixed(2);
  document.getElementById("score").innerText = score.toFixed(0);
  document.getElementById("rating").innerText = rating;

  document.getElementById("elec").innerText = elecCO2.toFixed(2);
  document.getElementById("trans").innerText = transCO2.toFixed(2);
  document.getElementById("waterOut").innerText = waterCO2.toFixed(2);
  document.getElementById("plasticOut").innerText = plasticCO2;
  document.getElementById("flightOut").innerText = flightCO2;

  let suggestions = [];

  if (electricity > 200) suggestions.push("Switch to LED lighting");
  if (travel > 100) suggestions.push("Use public transport more often");
  if (plastic !== "low") suggestions.push("Reduce single-use plastics");
  if (water > 5000) suggestions.push("Fix water leaks");
  if (flights > 2) suggestions.push("Reduce unnecessary flights");

  let list = document.getElementById("suggestions");
  list.innerHTML = "";
  suggestions.forEach(s => {
    let li = document.createElement("li");
    li.innerText = s;
    list.appendChild(li);
  });

  localStorage.setItem("ecoData", JSON.stringify({
    electricity, travel, water, plastic, flights
  }));

  animateValue("total", total.toFixed(2));
  animateValue("score", score.toFixed(0));
}

function animateValue(id, value) {
  let el = document.getElementById(id);
  let start = 0;
  let end = parseFloat(value);
  let duration = 600;
  let step = end / (duration / 16);

  let counter = setInterval(() => {
    start += step;
    if (start >= end) {
      start = end;
      clearInterval(counter);
    }
    el.innerText = start.toFixed(0);
  }, 16);
}

function resetForm() {
  document.querySelectorAll("input").forEach(i => i.value = "");
  document.getElementById("plastic").value = "low";
  document.getElementById("recycling").value = "always";
  document.getElementById("suggestions").innerHTML = "";
}
