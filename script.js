// Ensure proper DOM access
document.addEventListener("DOMContentLoaded", () => {
    const energyForm = document.getElementById("energy-form");
    const dailyUsageInput = document.getElementById("daily-usage");
    const resultsSection = document.getElementById("results");
    const averageUsage = document.getElementById("average-usage");
    const totalUsage = document.getElementById("total-usage");
    const usageGraph = document.getElementById("usageGraph").getContext("2d");
    const helpBtn = document.getElementById("help-btn");
    const helpSection = document.getElementById("help-section");
    const themeBtn = document.getElementById("theme-btn");

    let dailyData = [];
    let chart;

    // Update Dashboard
    function updateDashboard() {
        const total = dailyData.reduce((sum, value) => sum + value, 0);
        const avg = total / dailyData.length || 0;

        averageUsage.textContent = `Average Daily Usage: ${avg.toFixed(2)} kWh`;
        totalUsage.textContent = `Total Usage: ${total.toFixed(2)} kWh`;

        if (chart) chart.destroy(); // Clear existing chart
        chart = new Chart(usageGraph, {
            type: "line",
            data: {
                labels: dailyData.map((_, index) => `Day ${index + 1}`),
                datasets: [{
                    label: "Daily Usage (kWh)",
                    data: dailyData,
                    borderColor: "blue",
                    backgroundColor: "rgba(0, 0, 255, 0.2)",
                    fill: true,
                }],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                    },
                },
            },
        });
    }

    // Form Submission
    energyForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const usage = parseFloat(dailyUsageInput.value);
        if (!isNaN(usage) && usage > 0) {
            dailyData.push(usage);
            dailyUsageInput.value = "";
            resultsSection.classList.remove("hidden");
            updateDashboard();
        } else {
            alert("Please enter a valid daily usage value.");
        }
    });

    // Toggle Help Section
    helpBtn.addEventListener("click", () => {
        helpSection.classList.toggle("hidden");
    });

    // Toggle Theme
    themeBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-theme");
    });
});
