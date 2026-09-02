/**
 * Chapter 4 Chart.js Visualizations (Glassmorphism Theme)
 */

document.addEventListener("DOMContentLoaded", () => {
    initChartDefaults();
    renderVsmKaizenChart();
    renderBaselineScorecardChart();
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
// 1. Value Stream Kaizen Impact (Figure 4.8 - Grouped Horizontal Bar Chart)
// =========================================================================
function renderVsmKaizenChart() {
    const canvas = document.getElementById("vsmKaizenChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: [
                "Production Lead Time (Days)",
                "Factory Scrap Rate (%)",
                "Field Thermal Escapes (%)",
                "WIP Floor Clutter (%)"
            ],
            datasets: [
                {
                    label: "Baseline In-House Fabrication (Flawed)",
                    data: [45.5, 19.0, 12.0, 40.0],
                    backgroundColor: "rgba(239, 68, 68, 0.85)",
                    borderColor: "rgba(255, 255, 255, 0.8)",
                    borderWidth: 1.2,
                    borderRadius: 6,
                    maxBarThickness: 20
                },
                {
                    label: "Target Partner Architecture (Kaizen)",
                    data: [10.0, 0.6, 0.0, 5.0],
                    backgroundColor: "rgba(16, 185, 129, 0.85)",
                    borderColor: "rgba(255, 255, 255, 0.8)",
                    borderWidth: 1.2,
                    borderRadius: 6,
                    maxBarThickness: 20
                }
            ]
        },
        options: {
            indexAxis: "y",
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
                            const unit = context.dataIndex === 0 ? " Days" : "%";
                            return ` ${context.dataset.label.split(" (")[0]}: ${context.raw}${unit}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    min: 0,
                    max: 50,
                    ticks: {
                        stepSize: 10,
                        color: "#64748b",
                        font: { size: 11, weight: "600" }
                    },
                    grid: { color: "rgba(226, 232, 240, 0.8)" },
                    title: {
                        display: true,
                        text: "Operational Value Stream Metric Scale",
                        color: "#475569",
                        font: { size: 12, weight: "700" }
                    }
                },
                y: {
                    ticks: {
                        color: "#0f172a",
                        font: { size: 11.5, weight: "700" }
                    },
                    grid: { display: false }
                }
            }
        }
    });
}

// =========================================================================
// 2. Volt-Tech Baseline Capability Scorecard Heatmap (Figure 4.8A - Bar Chart)
// =========================================================================
function renderBaselineScorecardChart() {
    const canvas = document.getElementById("baselineScorecardChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: [
                "D1: Chassis Assembly",
                "D2: Cell Fabrication",
                "D3: Edge BMS TinyML",
                "D4: Cloud DPP Telemetry",
                "D5: Cross-Functional Pods"
            ],
            datasets: [
                {
                    label: "Baseline Maturity Level (0–5)",
                    data: [4, 1, 0, 1, 1],
                    backgroundColor: [
                        "rgba(16, 185, 129, 0.88)", // Green for L4
                        "rgba(239, 68, 68, 0.88)",  // Red for L1
                        "rgba(153, 27, 27, 0.92)",  // Deep Red for L0
                        "rgba(239, 68, 68, 0.88)",  // Red for L1
                        "rgba(239, 68, 68, 0.88)"   // Red for L1
                    ],
                    borderColor: "rgba(255, 255, 255, 0.9)",
                    borderWidth: 1.5,
                    borderRadius: 8,
                    maxBarThickness: 54
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const levels = [
                                "Level 4: Quantitatively Managed (World-Class Assembly)",
                                "Level 1: Ad-Hoc / 81% Yield (Severe Deficit)",
                                "Level 0: Non-Existent (Total Architecture Void)",
                                "Level 1: Unstable Siloed CSVs (Critical Deficit)",
                                "Level 1: Siloed IT/OT Conflict (Workforce Friction)"
                            ];
                            return ` ${levels[context.dataIndex]}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    min: 0,
                    max: 5,
                    ticks: {
                        stepSize: 1,
                        callback: (v) => `Level ${v}`,
                        color: "#64748b",
                        font: { size: 11, weight: "700" }
                    },
                    grid: { color: "rgba(226, 232, 240, 0.8)" },
                    title: {
                        display: true,
                        text: "Architecture Maturity Level (CMMI Scale 0–5)",
                        color: "#475569",
                        font: { size: 12, weight: "700" }
                    }
                },
                x: {
                    ticks: {
                        color: "#0f172a",
                        font: { size: 11, weight: "700" }
                    },
                    grid: { display: false }
                }
            }
        },
        plugins: [
            {
                id: "scoreLabels",
                afterDatasetsDraw(chart) {
                    const { ctx, data } = chart;
                    chart.getDatasetMeta(0).data.forEach((bar, index) => {
                        const score = data.datasets[0].data[index];
                        ctx.save();
                        ctx.font = "bold 13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
                        ctx.textAlign = "center";
                        ctx.fillStyle = score >= 3 ? "#15803d" : "#991b1b";
                        const yPos = score === 0 ? bar.base - 10 : bar.y - 8;
                        ctx.fillText(`L${score} ${score >= 3 ? "✅" : "🔴"}`, bar.x, yPos);
                        ctx.restore();
                    });
                }
            }
        ]
    });
}
