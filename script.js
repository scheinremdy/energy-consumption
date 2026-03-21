let appliances = JSON.parse(localStorage.getItem("data")) || [];

const list = document.getElementById("list");
const totalKwhEl = document.getElementById("totalKwh");
const totalCostEl = document.getElementById("totalCost");
const insightEl = document.getElementById("insight");

let chart;

function addAppliance() {
  const name = document.getElementById("name").value;
  const watts = parseFloat(document.getElementById("watts").value);
  const hours = parseFloat(document.getElementById("hours").value);

  if (!name || !watts || !hours) return alert("Fill all fields!");

  appliances.push({ name, watts, hours });

  saveData();
  render();
}

function calculateKwh(watts, hours) {
  return (watts * hours) / 1000;
}

function calculateCost(kwh) {
  if (kwh <= 100) return kwh * 5;
  if (kwh <= 200) return kwh * 7;
  return kwh * 10;
}

function saveData() {
  localStorage.setItem("data", JSON.stringify(appliances));
}

function render() {
  list.innerHTML = "";

  let totalKwh = 0;

  appliances.forEach((a, index) => {
    const kwh = calculateKwh(a.watts, a.hours);
    totalKwh += kwh;

    const li = document.createElement("li");
    li.textContent = `${a.name} - ${kwh.toFixed(2)} kWh`;
    list.appendChild(li);
  });

  const totalCost = calculateCost(totalKwh);

  totalKwhEl.textContent = totalKwh.toFixed(2);
  totalCostEl.textContent = totalCost.toFixed(2);

  generateInsight(totalKwh);
  updateChart();
}

function generateInsight(totalKwh) {
  if (totalKwh > 50) {
    insightEl.textContent = "⚠️ High usage! Try reducing appliance time.";
  } else {
    insightEl.textContent = "✅ Good energy usage!";
  }
}

function updateChart() {
  const labels = appliances.map(a => a.name);
  const data = appliances.map(a => calculateKwh(a.watts, a.hours));

  const ctx = document.getElementById("chart");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'kWh Usage',
        data: data
      }]
    }
  });
}

document.getElementById("toggleDark").onclick = () => {
  document.body.classList.toggle("dark");
};

render();
