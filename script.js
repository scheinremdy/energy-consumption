document.addEventListener("DOMContentLoaded", function () {
    const energyForm = document.getElementById("energy-form");
    const helpBtn = document.getElementById("help-btn");
    const themeBtn = document.getElementById("theme-btn");
    const resultsContainer = document.getElementById("results");
    const dailyUsageInput = document.getElementById("daily-usage");
    const helpSection = document.getElementById("help-section");

    let dailyUsages = [];
    const electricityRate = 9.53; // PHP per kWh

    // Form submission
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

    // Toggle Help Section
    helpBtn.addEventListener("click", () => helpSection.classList.toggle("hidden"));

    // Toggle Theme
    themeBtn.addEventListener("click", () => document.body.classList.toggle("dark-theme"));

    function updateDashboard() {
        const totalUsage = dailyUsages.reduce((acc, curr) => acc + curr, 0);
        const averageUsage = totalUsage / dailyUsages.length;
        const totalCost = totalUsage * electricityRate;
        const averageCost = averageUsage * electricityRate;

        document.getElementById("total-usage").textContent = `Total Usage: ${totalUsage.toFixed(2)} kWh`;
        document.getElementById("average-usage").textContent = `Average Usage: ${averageUsage.toFixed(2)} kWh`;
        document.getElementById("cost-estimate").textContent = `Estimated Cost: ₱${totalCost.toFixed(2)} (Avg: ₱${averageCost.toFixed(2)})`;
        resultsContainer.classList.remove("hidden");

        updateGraph();
    }

    function updateGraph() {
        const ctx = document.getElementById("usageGraph").getContext("2d");

        if (window.usageChart) window.usageChart.destroy();

        window.usageChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: dailyUsages.map((_, i) => `Day ${i + 1}`),
                datasets: [
                    {
                        label: "Daily Usage (kWh)",
                        data: dailyUsages,
                        borderColor: "#2563eb",
                        backgroundColor: "rgba(37, 99, 235, 0.2)",
                    },
                ],
            },
            options: { responsive: true, scales: { y: { beginAtZero: true } } },
        });
    }
});
