let appliances = JSON.parse(localStorage.getItem("data")) || [];

const rates = {
  ph: 10,   // pesos per kWh
  de: 0.4,  // euros
  us: 0.15  // dollars
};

const rateText = {
  ph: "Philippines avg: ₱10/kWh",
  de: "Germany avg: €0.40/kWh",
  us: "USA avg: $0.15/kWh"
};

let chart;

function addAppliance() {
  const name = nameInput.value;
  const watts = +wattsInput.value;
  const hours = +hoursInput.value;

  if (!name || !watts || !hours) return alert("Fill all fields");

  appliances.push({ name, watts, hours });

  save();
  render();
}

const nameInput = document.getElementById("name");
const wattsInput = document.getElementById("watts");
const hoursInput = document.getElementById("hours");
const list = document.getElementById("list");

function save() {
  localStorage.setItem("data", JSON.stringify(appliances));
}

function render() {
  list.innerHTML = "";

  let total = 0;

  appliances.forEach(a => {
    const kwh = (a.watts * a.hours) / 1000;
    total += kwh;

    const li = document.createElement("li");
    li.textContent = `${a.name} - ${kwh.toFixed(2)} kWh`;
    list.appendChild(li);
  });

  const country = document.getElementById("country").value;
  const rate = rates[country];

  const cost = total * rate;

  document.getElementById("kwh").textContent = total.toFixed(2);
  document.getElementById("cost").textContent = cost.toFixed(2);
  document.getElementById("rateInfo").textContent = rateText[country];

  generateInsight(total);
  updateChart();
}

function generateInsight(total) {
  const insight = document.getElementById("insight");

  if (total > 20) {
    insight.textContent = "⚠️ High energy usage. Reduce heavy appliances.";
  } else {
    insight.textContent = "✅ Efficient usage.";
  }
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
        label: "kWh",
        data
      }]
    }
  });
}

document.getElementById("country").onchange = render;

document.getElementById("toggleDark").onclick = () => {
  document.body.classList.toggle("dark");
};

render();
