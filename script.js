const form = document.getElementById('energy-form');
const dailyUsageInput = document.getElementById('daily-usage');
const resultsDiv = document.getElementById('results');
const averageUsage = document.getElementById('average-usage');
const totalUsage = document.getElementById('total-usage');
const helpSection = document.getElementById('help-section');
const helpBtn = document.getElementById('help-btn');
const themeBtn = document.getElementById('theme-btn');
const usageGraphCanvas = document.getElementById('usageGraph').getContext('2d');
const energyTips = document.getElementById('energy-tips');

let usageData = [];
let theme = 'light';

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const dailyUsage = parseFloat(dailyUsageInput.value);
    if (!isNaN(dailyUsage) && dailyUsage > 0) {
        usageData.push(dailyUsage);
        updateDashboard();
    }
    dailyUsageInput.value = '';
});

helpBtn.addEventListener('click', () => {
    helpSection.classList.toggle('hidden');
});

themeBtn.addEventListener('click', () => {
    theme = theme === 'light' ? 'dark' : 'light';
    document.body.className = theme;
    themeBtn.textContent = theme === 'light' ? '🔲 Toggle Theme' : '🔆 Toggle Theme';
});

function updateDashboard() {
    const total = usageData.reduce((acc, curr) => acc + curr, 0);
    const average = total / usageData.length;
    averageUsage.textContent = `Average Daily Usage: ${average.toFixed(2)} kWh`;
    totalUsage.textContent = `Total Usage: ${total.toFixed(2)} kWh`;

    updateGraph();
    updateEnergyTips();
}

function updateGraph() {
    new Chart(usageGraphCanvas, {
        type: 'line',
        data: {
            labels: Array.from({ length: usageData.length }, (_, i) => i + 1),
            datasets: [{
                label: 'Daily Energy Usage (kWh)',
                data: usageData,
                borderColor: theme === 'light' ? '#4e73df' : '#1cc88a',
                backgroundColor: theme === 'light' ? 'rgba(78, 115, 223, 0.2)' : 'rgba(28, 200, 138, 0.2)',
                fill: true,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    beginAtZero: true
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function updateEnergyTips() {
    const lastUsage = usageData[usageData.length - 1];
    if (lastUsage < 1) {
        energyTips.textContent = "Tip: Try to reduce your energy usage to save money and the environment!";
    } else if (lastUsage > 5) {
        energyTips.textContent = "Tip: Consider using energy-efficient appliances to reduce usage!";
    } else {
        energyTips.textContent = "Good job! Keep managing your energy consumption!";
    }
}
