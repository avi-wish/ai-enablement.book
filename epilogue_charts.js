/**
 * Epilogue Chart.js Visualizations (Glassmorphism Theme)
 */

document.addEventListener("DOMContentLoaded", () => {
    initChartDefaults();
    renderEcosystemHorizonRadarChart();
    renderCompoundingValueChart();
});

function initChartDefaults() {
    if (typeof Chart === "undefined") return;

    Chart.defaults.font.family = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
    Chart.defaults.color = "#334155";
    Chart.defaults.plugins.tooltip.backgroundColor = "rgba(15, 23, 42, 0.9)";
    Chart.defaults.plugins.tooltip.titleColor = "#f8fafc";
    Chart.defaults.plugins.tooltip.bodyColor = "#f1f5f9";
    Chart.defaults.plugins.tooltip.padding = 12;
    Chart.defaults.plugins.tooltip.cornerRadius = 8;
    Chart.defaults.plugins.tooltip.borderColor = "rgba(255, 255, 255, 0.25)";
    Chart.defaults.plugins.tooltip.borderWidth = 1;
}

// =========================================================================
// 1. Master Ecosystem SCOR Sustained Performance Radar (Figure E.1)
// =========================================================================
function renderEcosystemHorizonRadarChart() {
    const canvas = document.getElementById("ecosystemHorizonRadarChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    new Chart(ctx, {
        type: "radar",
        data: {
            labels: [
                "Delivery Reliability (RL.1.1)",
                "Order Responsiveness (RS.1.1)",
                "Upside Agility (AG.1.1)",
                "Cost Efficiency (CO.1.1)",
                "Asset Utilization (AM.1.1)",
                "AI Regulatory Conformance"
            ],
            datasets: [
                {
                    label: "Baseline Pre-Transformation (Fragile)",
                    data: [81.0, 32.0, 35.0, 40.0, 48.0, 62.0],
                    backgroundColor: "rgba(239, 68, 68, 0.2)",
                    borderColor: "#ef4444",
                    borderWidth: 2,
                    pointBackgroundColor: "#ffffff",
                    pointBorderColor: "#ef4444",
                    pointBorderWidth: 2,
                    pointRadius: 4.5
                },
                {
                    label: "Target Governed Mastery (Sustained Horizon)",
                    data: [99.8, 98.0, 95.0, 96.0, 88.0, 99.9],
                    backgroundColor: "rgba(16, 185, 129, 0.25)",
                    borderColor: "#10b981",
                    borderWidth: 2.8,
                    pointBackgroundColor: "#ffffff",
                    pointBorderColor: "#10b981",
                    pointBorderWidth: 2,
                    pointRadius: 5.5
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        boxWidth: 14,
                        usePointStyle: true,
                        font: { size: 11.5, weight: "600" }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return ` ${context.dataset.label}: ${context.raw}% score`;
                        }
                    }
                }
            },
            scales: {
                r: {
                    min: 20,
                    max: 100,
                    ticks: {
                        stepSize: 20,
                        callback: (v) => `${v}%`,
                        color: "#64748b",
                        backdropColor: "transparent",
                        font: { size: 10, weight: "600" }
                    },
                    grid: { color: "rgba(226, 232, 240, 0.85)" },
                    angleLines: { color: "rgba(226, 232, 240, 0.85)" },
                    pointLabels: {
                        color: "#1e293b",
                        font: { size: 11.5, weight: "700" }
                    }
                }
            }
        }
    });
}

// =========================================================================
// 2. Multi-Year Compounding TCO & Net Economic Return (Figure E.5)
// =========================================================================
function renderCompoundingValueChart() {
    const canvas = document.getElementById("compoundingValueChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    new Chart(ctx, {
        type: "line",
        data: {
            labels: ["Q1 (Ch 2)", "Q2 (Ch 5)", "Q3 (Ch 7)", "Q4 (Ch 9)", "Year 2 (H2)", "Year 3 (H3)", "Year 4 (H3+)"],
            datasets: [
                {
                    label: "Cumulative Capital Investment ($M CapEx)",
                    data: [12.0, 18.5, 24.0, 27.5, 31.0, 34.0, 36.5],
                    borderColor: "#f59e0b",
                    backgroundColor: "rgba(245, 158, 11, 0.1)",
                    borderWidth: 2.5,
                    pointBackgroundColor: "#ffffff",
                    pointBorderColor: "#f59e0b",
                    pointRadius: 4,
                    fill: false,
                    tension: 0.25
                },
                {
                    label: "Cumulative Net Realized Value ($M Savings & Gainshare)",
                    data: [-8.5, -3.2, 14.8, 38.4, 76.2, 134.5, 218.0],
                    borderColor: "#10b981",
                    backgroundColor: "rgba(16, 185, 129, 0.15)",
                    borderWidth: 3,
                    pointBackgroundColor: "#ffffff",
                    pointBorderColor: "#10b981",
                    pointRadius: 5,
                    fill: true,
                    tension: 0.3
                },
                {
                    label: "Ungoverned AI Black-Box Trajectory (Projected Loss)",
                    data: [-12.0, -28.0, -49.0, -78.0, -125.0, -190.0, -280.0],
                    borderColor: "#ef4444",
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointBackgroundColor: "#ffffff",
                    pointBorderColor: "#ef4444",
                    pointRadius: 3.5,
                    fill: false,
                    tension: 0.2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: "index",
                intersect: false
            },
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        boxWidth: 14,
                        usePointStyle: true,
                        font: { size: 11.5, weight: "600" }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return ` ${context.dataset.label}: $${context.raw}M`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: "rgba(226, 232, 240, 0.6)" },
                    ticks: { font: { size: 11, weight: "600" }, color: "#64748b" }
                },
                y: {
                    grid: { color: "rgba(226, 232, 240, 0.6)" },
                    ticks: {
                        callback: (v) => `$${v}M`,
                        font: { size: 11, weight: "600" },
                        color: "#64748b"
                    }
                }
            }
        }
    });
}
