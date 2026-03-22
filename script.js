let appliances = [];

const rate = 10;

let usageChart, costChart, intensityChart;

function addAppliance() {
  const name = document.getElementById("name").value;
  const watts = +document.getElementById("watts").value;
  const hours = +document.getElementById("hours").value;

  if (!name || !watts || !hours) {
    alert("Fill all fields");
    return;
  }

  appliances.push({ name, watts, hours });

  render();
}

function resetData(){
  appliances = [];
  render();
}

function render() {
  let total = 0;

  const list = document.getElementById("list");
  list.innerHTML = "";

  appliances.forEach((a,i) => {
    const kwh = (a.watts * a.hours) / 1000;
    total += kwh;

    const li = document.createElement("li");
    li.innerHTML = `${a.name} - ${kwh.toFixed(2)} kWh 
    <span onclick="deleteItem(${i})" style="color:red;cursor:pointer;">X</span>`;
    list.appendChild(li);
  });

  const cost = total * rate;
  const prediction = cost * 30;

  document.getElementById("kwh").textContent = total.toFixed(2);
  document.getElementById("cost").textContent = cost.toFixed(2);
  document.getElementById("prediction").textContent = prediction.toFixed(2);
  document.getElementById("devices").textContent = appliances.length;

  generateInsight(total);
  updateCharts();
}

function deleteItem(i){
  appliances.splice(i,1);
  render();
}

function generateInsight(total) {
  const el = document.getElementById("insight");

  if (appliances.length === 0) {
    el.textContent = "Add appliances to start analysis.";
    return;
  }

  let worst = appliances.reduce((a,b)=>
    (a.watts*a.hours > b.watts*b.hours ? a : b)
  );

  if (total > 20) {
    el.textContent = `⚠️ High usage. Biggest: ${worst.name}`;
  } else {
    el.textContent = `✅ Efficient usage.`;
  }
}

function updateCharts() {

  const labels = appliances.map(a => a.name);
  const usage = appliances.map(a => (a.watts * a.hours) / 1000);
  const costData = usage.map(kwh => kwh * rate);

  if (usageChart) usageChart.destroy();
  if (costChart) costChart.destroy();
  if (intensityChart) intensityChart.destroy();

  usageChart = new Chart(document.getElementById("usageChart"), {
    type: "bar",
    data: {
      labels,
      datasets: [{ label: "kWh", data: usage }]
    }
  });

  costChart = new Chart(document.getElementById("costChart"), {
    type: "line",
    data: {
      labels,
      datasets: [{ label: "Cost", data: costData }]
    }
  });

  intensityChart = new Chart(document.getElementById("intensityChart"), {
    type: "doughnut",
    data: {
      labels,
      datasets: [{ data: usage }]
    }
  });
}

render();
