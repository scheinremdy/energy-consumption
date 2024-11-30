document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("energy-form");
    const dailyUsageInput = document.getElementById("daily-usage");
    const dashboard = document.getElementById("dashboard");
    const averageUsage = document.getElementById("average-usage");
    const totalUsage = document.getElementById("total-usage");
    const ctx = document.getElementById("usageGraph").getContext("2d");
    const helpBtn = document.getElementById("help-btn");
    const helpSection = document.getElementById("help-section");
    const themeBtn = document.getElementById("theme-btn");
    const energyTips = document.getElementById("energy-tips");

    const data = [];
    let chart;

    const tips = [
        "💡 Use energy-efficient appliances to save more energy.",
        "🌱 Turn off lights when not in use.",
        "📉 Try using natural light during the day.",
        "🌞 Install solar panels for a sustainable power source.",
        "💸 Monitor your consumption regularly to avoid high bills."
    ];

    const updateDashboard = () => {
        if (data.length === 0) return;
        const total = data.reduce((sum, val) => sum + val, 0);
        const average = (total / data.length).toFixed(2);

        averageUsage.textContent = `📈 Average daily usage: ${average} kWh`;
        totalUsage.textContent = `⚡ Total energy used: ${total} kWh`;

        dashboard.classList.remove("hidden");
        energyTips.textContent = tips[Math.floor(Math.random() * tips.length)];
    };

    const updateGraph = () => {
        if (chart) chart.destroy();

        chart = new Chart(ctx, {
            type: "line",
            data: {
                labels: data.map((_, i) => `Day ${i + 1}`),
                datasets: [
                    {
                        label: "Daily Usage (kWh)",
                        data: data,
                        backgroundColor: "rgba(75, 192, 192, 0.2)",
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 2,
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
            updateDashboard();
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
