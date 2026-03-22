let appliances = JSON.parse(localStorage.getItem("data")) || [];

const rates = {
  ph: { rate: 10, symbol: "₱" },
  de: { rate: 0.4, symbol: "€" },
  us: { rate: 0.15, symbol: "$" }
};

let usageChart, costChart, intensityChart;
let lastCost = 0;

function save() {
  localStorage.setItem("data", JSON.stringify(appliances));
}

function addAppliance() {
  const name = document.getElementById("name").value;
  const watts = +document.getElementById("watts").value;
  const hours = +document.getElementById("hours").value;

  if (!name || !watts || !hours) return alert("Fill all fields");

  appliances.push({ name, watts, hours });

  document.getElementById("name").value = "";
  document.getElementById("watts").value = "";
  document.getElementById("hours").value = "";

  save();
  render();
}

function deleteItem(i){
  appliances.splice(i,1);
  save();
  render();
}

function resetData(){
  appliances = [];
  save();
  render();
}

function render() {

  const list = document.getElementById("list");
  list.innerHTML = "";

  let total = 0;

  appliances.forEach((a,i) => {
    const kwh = (a.watts * a.hours) / 1000;
    total += kwh;

    const li = document.createElement("li");
    li.innerHTML = `${a.name} - ${kwh.toFixed(2)} kWh 
    <span onclick="deleteItem(${i})" style="color:red;cursor:pointer;">X</span>`;
    list.appendChild(li);
  });

  const country = document.getElementById("country").value;
  const rate = rates[country].rate;
  const symbol = rates[country].symbol;

  const cost = total * rate;
  const prediction = cost * 30;

  let change = cost - lastCost;
  lastCost = cost;

  let changeEl = document.getElementById("costChange");

  if (change > 0) {
    changeEl.style.color = "red";
    changeEl.textContent = `↑ +${change.toFixed(2)}`;
  } else if (change < 0) {
    changeEl.style.color = "green";
    changeEl.textContent = `↓ ${change.toFixed(2)}`;
  } else {
    changeEl.textContent = "No change";
  }

  document.getElementById("kwh").textContent = total.toFixed(2);
  document.getElementById("cost").textContent = symbol + cost.toFixed(2);
  document.getElementById("prediction").textContent = symbol + prediction.toFixed(2);
  document.getElementById("devices").textContent = appliances.length;

  let score = Math.max(0, 100 - total * 2);
  document.getElementById("efficiency").textContent = score.toFixed(0) + "%";

  generateInsight(total);
  updateTopUsers(total);
  updateCharts(total, rate);
}

function generateInsight(total) {
  const el = document.getElementById("insight");

  if (appliances.length === 0) {
    el.innerHTML = `
    👋 Welcome to EnergyAI<br><br>
    Start adding appliances to analyze your energy usage.<br>
    You'll get smart insights and cost predictions.
    `;
    return;
  }

  let sorted = [...appliances].sort((a,b)=>
    (b.watts*b.hours)-(a.watts*a.hours)
  );

  let top = sorted[0];

  let msg = `⚡ ${top.name} contributes the most to your energy usage. 
  Reducing its usage can lower your monthly cost.`;

  if (total > 25) msg += " ⚠️ Overall usage is high.";

  el.textContent = msg;
}

function updateTopUsers(total){
  if (appliances.length === 0) return;

  let sorted = [...appliances].sort((a,b)=>
    (b.watts*b.hours)-(a.watts*a.hours)
  );

  let text = "🔥 Top Consumers:<br>";

  sorted.slice(0,3).forEach((a,i)=>{
    let percent = ((a.watts*a.hours)/(total*1000)*100).toFixed(1);
    text += `${i+1}. ${a.name} — ${percent}%<br>`;
  });

  document.getElementById("topUsers").innerHTML = text;
}

function updateCharts(total, rate){

  const labels = appliances.map(a=>a.name);
  const usage = appliances.map(a=>(a.watts*a.hours)/1000);
  const costData = usage.map(kwh=>kwh*rate);

  const weekLabels = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const weekly = weekLabels.map((_,i)=> total*(0.8 + i*0.05));

  if (usageChart) usageChart.destroy();
  if (costChart) costChart.destroy();
  if (intensityChart) intensityChart.destroy();

  usageChart = new Chart(document.getElementById("usageChart"), {
    type:"line",
    data:{ labels:weekLabels, datasets:[{ label:"kWh", data:weekly }] }
  });

  costChart = new Chart(document.getElementById("costChart"), {
    type:"bar",
    data:{ labels, datasets:[{ label:"Cost", data:costData }] }
  });

  intensityChart = new Chart(document.getElementById("intensityChart"), {
    type:"doughnut",
    data:{ labels, datasets:[{ data:usage }] }
  });
}

document.getElementById("country").onchange = render;

render();
