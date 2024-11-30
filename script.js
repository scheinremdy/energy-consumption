document.addEventListener("DOMContentLoaded", function () {
  const energyForm = document.getElementById("energy-form");
  const helpBtn = document.getElementById("help-btn");
  const themeBtn = document.getElementById("theme-btn");
  const resultsContainer = document.getElementById("results");
  const dailyUsageInput = document.getElementById("daily-usage");
  const helpSection = document.getElementById("help-section");
  const totalUsageEl = document.getElementById("total-usage");
  const averageUsageEl = document.getElementById("average-usage");

  let dailyUsages = [];

  // Handle form submission for energy usage input
  energyForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const dailyUsage = parseFloat(dailyUsageInput.value);
    if (isNaN(dailyUsage) || dailyUsage <= 0) {
      alert("Please enter a valid usage.");
      return;
    }

    dailyUsages.push(dailyUsage);
    updateDashboard();
  });

  // Toggle Help Section Visibility
  helpBtn.addEventListener("click", function () {
    helpSection.classList.toggle("hidden");
  });

  // Toggle Theme between Light and Dark Mode
  themeBtn.addEventListener("click", function () {
    document.body.classList.toggle("dark-theme");
  });

  // Update the Dashboard and Graph
  function updateDashboard() {
    const totalUsage = dailyUsages.reduce((acc, curr) => acc + curr, 0);
    const averageUsage = totalUsage / dailyUsages.length;

    // Update total and average usage
    totalUsageEl.innerText = `Total Usage: ${totalUsage.toFixed(2)} kWh`;
    averageUsageEl.innerText = `Average Usage: ${averageUsage.toFixed(2)} kWh`;

    // Show results
    resultsContainer.classList.remove("hidden");

    // Update the graph
    updateGraph();
  }

  // Update the Graph
  function updateGraph() {
    const ctx = document.getElementById('usageGraph').getContext('2d');

    // Clear previous chart
    if (window.usageChart) {
      window.usageChart.destroy();
    }

    const chartData = {
      labels: Array.from({ length: dailyUsages.length }, (_, i) => `Day ${i + 1}`),
      datasets: [{
        label: 'Daily Usage (kWh)',
        data: dailyUsages,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
        fill: true,
        tension: 0.3
      }]
    };

    window.usageChart = new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            enabled: true
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
});
