let appliances = JSON.parse(localStorage.getItem("data")) || [];

const rates = {
  ph: 10,
  de: 0.4,
  us: 0.15
};

let chart;

function addAppliance() {
  const name = document.getElementById("name").value;
  const watts = +document.getElementById("watts").value;
  const hours = +document.getElementById("hours").value;

  if (!name || !watts || !hours) {
    alert("Fill all fields");
    return;
  }

  appliances.push({ name, watts, hours });

  save();
  render();
}

function deleteAppliance(index) {
  appliances.splice(index, 1);
  save();
  render();
}

function save() {
  localStorage.setItem("data", JSON.stringify(appliances));
}

function render() {
  const list = document.getElementById("list");
  list.innerHTML = "";

  let total = 0;

  appliances.forEach((a, i) => {
    const kwh = (a.watts * a.hours) / 1000;
    total += kwh;

    const li = document.createElement("li");
    li.innerHTML = `
      ${a.name} - ${kwh.toFixed(2)} kWh
      <span class="delete" onclick="deleteAppliance(${i})">X</span>
    `;
    list.appendChild(li);
  });

  const country = document.getElementById("country").value;
  const rate = rates[country];

  const cost = total * rate;

  document.getElementById("kwh").textContent = total.toFixed(2);
  document.getElementById("cost").textContent = cost.toFixed(2);

  updateChart();
}

function updateChart() {
  const ctx = document.getElementById("chart");

  const labels = appliances.map(a => a.name);
  const data = appliances.map(a => (a.watts * a.hours) / 1000);

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "kWh Usage",
        data
      }]
    }
  });
}

document.getElementById("country").onchange = render;

render();
