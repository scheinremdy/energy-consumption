document.addEventListener("DOMContentLoaded", () => {
    const energyForm = document.getElementById("energy-form");
    const dailyUsageInput = document.getElementById("daily-usage");
    const resultsSection = document.getElementById("results");
    const averageUsage = document.getElementById("average-usage");
    const totalUsage = document.getElementById("total-usage");
    const estimatedCost = document.getElementById("estimated-cost");
    const usageGraph = document.getElementById("usageGraph").getContext("2d");
    const energyTips = document.getElementById("energy-tips");
    const helpBtn = document.getElementById("help-btn");
    const themeBtn = document.getElementById("theme-btn");
    const helpSection = document.getElementById("help-section");

    let usageData = [];
    const pricePerKWh = 10; // PHP per kWh

    const updateDashboard = () => {
        const total = usageData.reduce((sum, value) => sum + value, 0);
        const average = (total / usageData.length).toFixed(2);
        const estimatedMonthlyCost = (total * pricePerKWh).toFixed(2);

        averageUsage.textContent = `Average Usage: ${average} kWh/day`;
        totalUsage.textContent = `Total Usage: ${total.toFixed(2)} kWh`;
        estimatedCost.textContent = `Estimated Cost: ₱${estimatedMonthlyCost}`;

        new Chart(usageGraph, {
            type: "bar",
            data: {
                labels: usageData.map((_, index) => `Day ${index + 1}`),
                datasets: [
                    {
                        label: "Energy Usage (kWh)",
                        data: usageData,
                        backgroundColor: "rgba(0, 86, 179, 0.7)",
                        borderColor: "#0056b3",
                        borderWidth: 1,
                    },
                ],
            },
        });
    };

    energyForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const usage = parseFloat(dailyUsageInput.value);
        if (!isNaN(usage)) {
            usageData.push(usage);
            updateDashboard();
            resultsSection.classList.remove("hidden");
            energyTips.textContent =
                usage > 10
                    ? "⚠️ High usage detected. Consider conserving energy."
                    : "✅ Your usage is within a reasonable range.";
            dailyUsageInput.value = "";
        }
    });

    helpBtn.addEventListener("click", () => {
        helpSection.classList.toggle("hidden");
    });

    themeBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-theme");
    });
});
