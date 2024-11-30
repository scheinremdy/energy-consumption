document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("energy-form");
    const dailyUsageInput = document.getElementById("daily-usage");
    const resultsDiv = document.getElementById("results");
    const averageUsage = document.getElementById("average-usage");
    const totalUsage = document.getElementById("total-usage");
    const consumptionSummary = document.getElementById("consumption-summary");
    const ctx = document.getElementById("usageGraph").getContext("2d");
    const helpBtn = document.getElementById("help-btn");
    const helpSection = document.getElementById("help-section");
    const themeBtn = document.getElementById("theme-btn");
    const energyTips = document.getElementById("energy-tips");
    const analyticsSection = document.getElementById("analytics-section");
    const peakUsage = document.getElementById("peak-usage");
    const avgMonthlyUsage = document.getElementById("avg-monthly-usage");

    const data = [];
    let chart;

    const tips = [
        "💡 Use energy-efficient appliances to save more energy.",
        "🌱 Turn off lights when not in use.",
        "📉 Try using natural light during the day.",
        "🌞 Install solar panels for a sustainable power source.",
        "💸 Monitor your consumption regularly to avoid high bills."
    ];

    const updateResults = () => {
        if (data.length === 0) return;
        const total = data.reduce((sum, val) => sum + val, 0);
        const average = (total / data.length).toFixed(2);

        // Calculate peak usage
        const peak = Math.max(...data).toFixed(2);

        // Calculate average monthly usage
        const avgMonthly = (total / data.length * 30).toFixed(2); // assuming 30 days in a month

        averageUsage.textContent = `📈 Average daily usage: ${average} kWh`;
        totalUsage.textContent = `⚡ Total energy used: ${total} kWh`;
        consumptionSummary.textContent = `⚡ You have used a total of ${total.toFixed(2)} kWh so far.`;

        peakUsage.textContent = `🚨 Peak daily usage: ${peak} kWh`;
        avgMonthlyUsage.textContent = `📅 Estimated monthly usage: ${avgMonthly} kWh`;

        resultsDiv.classList.remove("hidden");
        analyticsSection.classList.remove("hidden");
        energyTips.textContent = tips[Math.floor(Math.random() * tips.length)];
    };

    const updateGraph = () => {
        if (chart) chart.destroy();

        chart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: data.map((_, i) => `Day ${i + 1}`),
                datasets: [
                    {
                        label: "Daily Usage (kWh)",
                        data: data,
                        backgroundColor: data.map(() => {
                            const colors = ["#f39c12", "#e74c3c", "#2ecc71", "#9b59b6"];
                            return colors[Math.floor(Math.random() * colors.length)];
                        }),
                        borderColor: "#ffffff",
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true },
                },
            },
        });
    };

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const dailyUsage = parseFloat(dailyUsageInput.value);

        if (!isNaN(dailyUsage) && dailyUsage > 0) {
            data.push(dailyUsage);
            updateResults();
            updateGraph();
            dailyUsageInput.value = "";
        } else {
            alert("⚠️ Please enter a valid number greater than 0.");
        }
    });

    helpBtn.addEventListener("click", () => {
        helpSection.classList.toggle("hidden");
    });

    themeBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-theme");
    });
});
