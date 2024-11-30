document.addEventListener("DOMContentLoaded", () => {
    const energyForm = document.getElementById("energy-form");
    const helpBtn = document.getElementById("help-btn");
    const themeBtn = document.getElementById("theme-btn");
    const resultsContainer = document.getElementById("results");
    const dailyUsageInput = document.getElementById("daily-usage");
    const helpSection = document.getElementById("help-section");

    let dailyUsages = [];

    // Handle form submission for energy usage input
    energyForm.addEventListener("submit", (event) => {
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
    helpBtn.addEventListener("click", () => {
        helpSection.classList.toggle("hidden");
    });

    // Toggle Theme between Light and Dark Mode
    themeBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-theme");
    });

    function updateDashboard() {
        const totalUsage = dailyUsages.reduce((acc, curr) => acc + curr, 0);
        const averageUsage = totalUsage / dailyUsages.length;

        // Update total and average usage
        document.getElementById("total-usage").innerText = `Total Usage: ${totalUsage.toFixed(2)} kWh`;
        document.getElementById("average-usage").innerText = `Average Usage: ${averageUsage.toFixed(2)} kWh`;

        // Show results
        resultsContainer.classList.remove("hidden");

        // Update the graph
        updateGraph();
    }

    function updateGraph() {
        const ctx = document.getElementById('usageGraph').getContext('2d');

        // Clear previous chart if exists
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
            });
        });
    }
});
