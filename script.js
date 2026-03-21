let appliances = JSON.parse(localStorage.getItem("data")) || [];

const rates = { ph:10, de:0.4, us:0.15 };
const co2Factor = 0.85;

const presets = {
  tv: { name: "TV", watts: 100 },
  fridge: { name: "Refrigerator", watts: 150 },
  ac: { name: "Air Conditioner", watts: 1000 },
  heater: { name: "Heater", watts: 1500 },
  laptop: { name: "Laptop", watts: 60 },
  washing: { name: "Washing Machine", watts: 500 },
  fan: { name: "Electric Fan", watts: 75 }
};

const smartData = {
  tv: { hours: 4, tip: "Reduce screen time to save energy." },
  fridge: { hours: 24, tip: "Keep fridge door closed properly." },
  ac: { hours: 8, tip: "Set AC to 24°C for efficiency." },
  heater: { hours: 3, tip: "Avoid long heater usage." },
  laptop: { hours: 6, tip: "Use power-saving mode." },
  washing: { hours: 1, tip: "Use full load to save energy." },
  fan: { hours: 8, tip: "Use instead of AC when possible." }
};

let chart;

function selectPreset() {
  const selected = document.getElementById("preset").value;
  if (!selected) return;

  const item = presets[selected];

  document.getElementById("name").value = item.name;
  document.getElementById("watts").value = item.watts;

  if (smartData[selected]) {
    document.getElementById("hours").value = smartData[selected].hours;
  }
}

function addAppliance() {
  const name = document.getElementById("name").value;
  const watts = +document.getElementById("watts").value;
  const hours = +document.getElementById("hours").value;

  if (!name || !watts || !hours) {
    alert("Fill all fields");
    return;
  }

  appliances.push({ name, watts, hours });
  save(); render();
}

function deleteAppliance(i){
  appliances.splice(i,1);
  save(); render();
}

function editAppliance(i){
  const a = appliances[i];
  const name = prompt("Edit name", a.name);
  if(!name) return;

  appliances[i].name = name;
  save(); render();
}

function save(){
  localStorage.setItem("data", JSON.stringify(appliances));
}

function render(){
  const list = document.getElementById("list");
  list.innerHTML="";

  let total=0;

  appliances.forEach((a,i)=>{
    const kwh = (a.watts*a.hours)/1000;
    total+=kwh;

    const li=document.createElement("li");
    li.innerHTML=`
      ${a.name} - ${kwh.toFixed(2)} kWh
      <div>
        <span class="edit" onclick="editAppliance(${i})">✏️</span>
        <span class="delete" onclick="deleteAppliance(${i})">❌</span>
      </div>`;
    list.appendChild(li);
  });

  const country=document.getElementById("country").value;
  const rate=rates[country];

  const cost=total*rate;
  const monthly=cost*30;
  const co2=total*0.85;

  document.getElementById("kwh").textContent=total.toFixed(2);
  document.getElementById("cost").textContent=cost.toFixed(2);
  document.getElementById("monthly").textContent=monthly.toFixed(2);
  document.getElementById("co2").textContent=co2.toFixed(2);

  generateInsight(total);

  // top device
  if(appliances.length>0){
    let sorted=[...appliances].sort((a,b)=>(b.watts*b.hours)-(a.watts*a.hours));
    document.getElementById("topDevice").textContent =
      `🔥 Highest consumption: ${sorted[0].name}`;
  }

  updateChart();
}

function generateInsight(total){
  const el=document.getElementById("insight");

  if(appliances.length===0){
    el.textContent="Add appliances to see smart insights.";
    return;
  }

  let max=0, worst=null;

  appliances.forEach(a=>{
    const kwh=(a.watts*a.hours)/1000;
    if(kwh>max){
      max=kwh;
      worst=a;
    }
  });

  let message = total>30
    ? "⚠️ High energy usage. "
    : "✅ Efficient usage. ";

  if(worst){
    message += `Biggest usage: ${worst.name}. `;
  }

  const key = Object.keys(presets).find(k => presets[k].name === worst?.name);

  if(key && smartData[key]){
    message += smartData[key].tip;
  }

  el.textContent = message;
}

function updateChart(){
  const ctx=document.getElementById("chart");

  const labels=appliances.map(a=>a.name);
  const data=appliances.map(a=>(a.watts*a.hours)/1000);

  if(chart) chart.destroy();

  chart=new Chart(ctx,{
    type:"bar",
    data:{
      labels,
      datasets:[{
        label:"kWh Usage",
        data
      }]
    }
  });
}

document.getElementById("toggleDark").onclick=()=>{
  document.body.classList.toggle("dark");
};

document.getElementById("country").onchange=render;

render();
