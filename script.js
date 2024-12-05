document.addEventListener("DOMContentLoaded", function () {
    const energyForm = document.getElementById("energy-form");
    const helpBtn = document.getElementById("help-btn");
    const themeBtn = document.getElementById("theme-btn");
    const resultsContainer = document.getElementById("results");
    const dailyUsageInput = document.getElementById("daily-usage");
    const helpSection = document.getElementById("help-section");
    const languageSelect = document.getElementById("language-select");
    const countrySelect = document.getElementById("country-select");

    let dailyUsages = [];
    const electricityRates = {
        germany: 0.40, // EUR per kWh
        france: 0.23,
        spain: 0.25,
    };
    const defaultCurrency = "€";

    // Form submission
    energyForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const dailyUsage = parseFloat(dailyUsageInput.value);
        if (isNaN(dailyUsage) || dailyUsage <= 0) {
            alert(getTranslation("alertInvalidUsage"));
            return;
        }
        dailyUsages.push(dailyUsage);
        updateDashboard();
    });

    // Toggle Help Section
    helpBtn.addEventListener("click", () => helpSection.classList.toggle("hidden"));

    // Toggle Theme
    themeBtn.addEventListener("click", () => document.body.classList.toggle("dark-theme"));

    // Language Selection
    languageSelect.addEventListener("change", function () {
        const selectedLanguage = languageSelect.value;
        updateLanguage(selectedLanguage);
    });

    function updateDashboard() {
        const totalUsage = dailyUsages.reduce((acc, curr) => acc + curr, 0);
        const averageUsage = totalUsage / dailyUsages.length;

        const selectedCountry = countrySelect.value;
        const rate = electricityRates[selectedCountry] || electricityRates["germany"];
        const totalCost = totalUsage * rate;
        const averageCost = averageUsage * rate;

        const currencySymbol = defaultCurrency;

        document.getElementById("total-usage").textContent = `${getTranslation("totalUsage")}: ${totalUsage.toFixed(2)} kWh`;
        document.getElementById("average-usage").textContent = `${getTranslation("averageUsage")}: ${averageUsage.toFixed(2)} kWh`;
        document.getElementById("cost-estimate").textContent = `${getTranslation("costEstimate")}: ${currencySymbol}${totalCost.toFixed(2)} (${getTranslation("average")}: ${currencySymbol}${averageCost.toFixed(2)})`;

        resultsContainer.classList.remove("hidden");
        updateGraph();
    }

    function updateGraph() {
        const ctx = document.getElementById("usageGraph").getContext("2d");

        if (window.usageChart) window.usageChart.destroy();

        window.usageChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: dailyUsages.map((_, i) => `${getTranslation("day")} ${i + 1}`),
                datasets: [
                    {
                        label: getTranslation("dailyUsageGraph"),
                        data: dailyUsages,
                        borderColor: "#2563eb",
                        backgroundColor: "rgba(37, 99, 235, 0.2)",
                    },
                ],
            },
            options: { responsive: true, scales: { y: { beginAtZero: true } } },
        });
    }

    function updateLanguage(language) {
        const translations = getTranslations(language);

        document.getElementById("title").textContent = translations.title;
        document.getElementById("subtitle").textContent = translations.subtitle;
        document.getElementById("usage-label").textContent = translations.usageLabel;
        document.getElementById("country-label").textContent = translations.countryLabel;
        document.getElementById("add-usage-btn").textContent = translations.addUsageBtn;
        document.getElementById("summary-title").textContent = translations.summaryTitle;
        document.getElementById("help-title").textContent = translations.helpTitle;
        document.getElementById("help-tip1").textContent = translations.helpTip1;
        document.getElementById("help-tip2").textContent = translations.helpTip2;
    }

    function getTranslations(language) {
        const translations = {
            en: {
                title: "🌟 Energy Tracker Dashboard",
                subtitle: "Effortlessly monitor your energy usage and costs.",
                usageLabel: "Enter daily usage (kWh):",
                countryLabel: "Select Country:",
                addUsageBtn: "Add Usage",
                summaryTitle: "Summary",
                helpTitle: "Help",
                helpTip1: "💡 Input your daily energy consumption to analyze trends.",
                helpTip2: "📊 View your usage on an interactive graph.",
                totalUsage: "Total Usage",
                averageUsage: "Average Usage",
                costEstimate: "Estimated Cost",
                average: "Avg",
                day: "Day",
                dailyUsageGraph: "Daily Usage (kWh)",
                alertInvalidUsage: "Please enter a valid usage.",
            },
            de: {
                title: "🌟 Energieüberwachung Dashboard",
                subtitle: "Überwachen Sie mühelos Ihren Energieverbrauch und Ihre Kosten.",
                usageLabel: "Täglichen Verbrauch eingeben (kWh):",
                countryLabel: "Land auswählen:",
                addUsageBtn: "Verbrauch hinzufügen",
                summaryTitle: "Zusammenfassung",
                helpTitle: "Hilfe",
                helpTip1: "💡 Geben Sie Ihren täglichen Energieverbrauch ein, um Trends zu analysieren.",
                helpTip2: "📊 Sehen Sie Ihren Verbrauch in einem interaktiven Diagramm.",
                totalUsage: "Gesamtverbrauch",
                averageUsage: "Durchschnittlicher Verbrauch",
                costEstimate: "Geschätzte Kosten",
                average: "Durchschn.",
                day: "Tag",
                dailyUsageGraph: "Täglicher Verbrauch (kWh)",
                alertInvalidUsage: "Bitte geben Sie einen gültigen Verbrauch ein.",
            },
        };
        return translations[language] || translations["en"];
    }

    function getTranslation(key) {
        const language = languageSelect.value;
        const translations = getTranslations(language);
        return translations[key] || key;
    }

    // Initialize the default language
    updateLanguage("en");
});
