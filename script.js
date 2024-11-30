document.addEventListener("DOMContentLoaded", function() {
    const energyForm = document.getElementById("energy-form");
    const resultsContainer = document.getElementById("results");
    const dailyUsageInput = document.getElementById("daily-usage");

    let dailyUsages = [];

    energyForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const dailyUsage = parseFloat(dailyUsageInput.value);

        if (isNaN(dailyUsage) || dailyUsage <= 0) {
            alert("Please enter a valid usage.");
            return;
        }

        dailyUsages.push(dailyUsage);
        updateDashboard();
    });

    function updateDashboard() {
        const totalUsage = dailyUsages.reduce((acc, curr) => acc + curr, 0);
        const averageUsage = totalUsage / dailyUsages.length;

        // Display results
        document.getElementById("total-usage").innerText = `Total Usage: ${totalUsage.toFixed(2)} kWh`;
        document.getElementById("average-usage").innerText = `Average Usage: ${averageUsage.toFixed(2)} kWh`;

        // Show results section
        resultsContainer.classList.remove("hidden");

        // Update chart
        updateGraph();
    }

    function updateGraph() {
        const ctx = document.getElementById('usageGraph').getContext('2d');

        // Make sure the graph is cleared before redrawing
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
