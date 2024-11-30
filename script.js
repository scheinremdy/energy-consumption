document.addEventListener("DOMContentLoaded", () => {
    const navButtons = document.querySelectorAll("nav button");
    const sections = document.querySelectorAll(".section");
    const themeToggle = document.getElementById("theme-toggle");
    const dailyUsageInput = document.getElementById("daily-usage");
    const form = document.getElementById("energy-form");
    const insightsGraph = document.getElementById("insightsGraph").getContext("2d");
    const usageGraph = document.getElementById("usageGraph").getContext("2d");

    let data = [];
    let chart;

    // Update Navigation
    navButtons.forEach((button, index) => {
        button.addEventListener("click", () => {
            sections.forEach((section) => section.classList.add("hidden"));
            sections[index].classList.remove("hidden");
        });
    });

    // Theme Toggle
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
    });

    // Add Energy Usage
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const usage = parseFloat(dailyUsageInput.value);

        if (!isNaN(usage) && usage > 0) {
            data.push(usage);
            updateGraph();
            dailyUsageInput.value = "";
        } else {
            alert("Please enter a valid energy usage.");
        }
    });

    // Update Graph
    const updateGraph = () => {
        if (chart) chart.destroy();

        chart = new Chart(usageGraph, {
            type: "line",
            data: {
                labels: data.map((_, i) => `Day ${i + 1}`),
                datasets: [
                    {
                        label: "Daily Usage (kWh)",
                        data: data,
                        borderColor: "#f39c12",
                        backgroundColor: "rgba(243, 156, 18, 0.2)",
                        borderWidth: 2,
                    },
                ],
            },
        });
    };

    // Create Initial Insights Graph
    new Chart(insightsGraph, {
        type: "bar",
        data: {
            labels: ["Solar", "Wind", "Hydro", "Nuclear"],
            datasets: [
                {
                    label: "Energy Source Distribution",
                    data: [40, 25, 20, 15],
                    backgroundColor: ["#f39c12", "#27ae60", "#2980b9", "#8e44ad"],
                },
            ],
        },
    });
});
