/**
 * Chapter 2 Chart.js Visualizations (Glassmorphism Theme)
 */

document.addEventListener("DOMContentLoaded", () => {
    initChartDefaults();
    renderComponentStressChart();
    renderFinancialTrendChart();
    renderUnitEconomicsChart();
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
// 1. Component Stress & Hesitation Telemetry (Figure 2.4 - Dual Axis Line)
// =========================================================================
function renderComponentStressChart() {
    const canvas = document.getElementById("componentStressChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Glass gradients
    const gGrad = ctx.createLinearGradient(0, 0, 0, 240);
    gGrad.addColorStop(0, "rgba(239, 68, 68, 0.25)");
    gGrad.addColorStop(1, "rgba(239, 68, 68, 0.0)");

    const tGrad = ctx.createLinearGradient(0, 0, 0, 240);
    tGrad.addColorStop(0, "rgba(245, 158, 11, 0.25)");
    tGrad.addColorStop(1, "rgba(245, 158, 11, 0.0)");

    new Chart(ctx, {
        type: "line",
        data: {
            labels: ["00:00", "00:05", "00:10 (Hesitation)", "00:15 (Emergency Halt)", "00:20", "00:25", "00:30 (Recovery)"],
            datasets: [
                {
                    label: "Deceleration Shockwave (G-Force)",
                    data: [0.15, 0.22, 1.45, 1.88, 0.85, 0.30, 0.18],
                    borderColor: "#ef4444",
                    backgroundColor: gGrad,
                    fill: true,
                    tension: 0.35,
                    borderWidth: 2.5,
                    pointBackgroundColor: "#ffffff",
                    pointBorderColor: "#ef4444",
                    pointBorderWidth: 2,
                    pointRadius: 4.5,
                    yAxisID: "yG"
                },
                {
                    label: "Inverter Thermal Stress (°C)",
                    data: [42, 45, 68, 92, 84, 71, 52],
                    borderColor: "#f59e0b",
                    backgroundColor: tGrad,
                    fill: true,
                    tension: 0.35,
                    borderWidth: 2.5,
                    pointBackgroundColor: "#ffffff",
                    pointBorderColor: "#f59e0b",
                    pointBorderWidth: 2,
                    pointRadius: 4.5,
                    yAxisID: "yTemp"
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
                            if (context.datasetIndex === 0) {
                                return ` Deceleration Shock: ${context.raw} G`;
                            }
                            return ` Inverter Temp: ${context.raw} °C`;
                        }
                    }
                }
            },
            scales: {
                yG: {
                    type: "linear",
                    position: "left",
                    min: 0,
                    max: 2.2,
                    ticks: {
                        stepSize: 0.5,
                        callback: (v) => `${v} G`,
                        color: "#dc2626",
                        font: { size: 11, weight: "700" }
                    },
                    grid: { color: "rgba(226, 232, 240, 0.75)" },
                    title: {
                        display: true,
                        text: "Deceleration Shock (G)",
                        color: "#991b1b",
                        font: { size: 11.5, weight: "700" }
                    }
                },
                yTemp: {
                    type: "linear",
                    position: "right",
                    min: 30,
                    max: 100,
                    ticks: {
                        stepSize: 15,
                        callback: (v) => `${v}°C`,
                        color: "#d97706",
                        font: { size: 11, weight: "700" }
                    },
                    grid: { drawOnChartArea: false },
                    title: {
                        display: true,
                        text: "Inverter Temp (°C)",
                        color: "#b45309",
                        font: { size: 11.5, weight: "700" }
                    }
                },
                x: {
                    ticks: {
                        color: "#1e293b",
                        font: { size: 11, weight: "600" }
                    },
                    grid: { color: "rgba(241, 245, 249, 0.8)" }
                }
            }
        }
    });
}

// =========================================================================
// 2. The Productivity Paradox Trend Analysis (Figure 2.5 - Combo Chart)
// =========================================================================
function renderFinancialTrendChart() {
    const canvas = document.getElementById("financialTrendChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Q1 Baseline", "Q2 Expansion", "Q3 Scaling", "Q4 Crisis"],
            datasets: [
                {
                    type: "line",
                    label: "Net Delivery Revenue ($M)",
                    data: [120, 112, 98, 85],
                    borderColor: "#10b981",
                    backgroundColor: "rgba(16, 185, 129, 0.15)",
                    borderWidth: 2.8,
                    pointBackgroundColor: "#ffffff",
                    pointBorderColor: "#10b981",
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    yAxisID: "y"
                },
                {
                    type: "bar",
                    label: "Tech CapEx Grants ($M)",
                    data: [10, 22, 34, 45],
                    backgroundColor: "rgba(59, 130, 246, 0.75)",
                    borderColor: "rgba(255, 255, 255, 0.8)",
                    borderWidth: 1.2,
                    borderRadius: 6,
                    maxBarThickness: 32,
                    yAxisID: "y"
                },
                {
                    type: "bar",
                    label: "Hidden Fleet OpEx ($M)",
                    data: [25, 38, 48, 60],
                    backgroundColor: "rgba(239, 68, 68, 0.82)",
                    borderColor: "rgba(255, 255, 255, 0.8)",
                    borderWidth: 1.2,
                    borderRadius: 6,
                    maxBarThickness: 32,
                    yAxisID: "y"
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
                        boxWidth: 13,
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
                y: {
                    min: 0,
                    max: 140,
                    ticks: {
                        stepSize: 20,
                        callback: (v) => `$${v}M`,
                        color: "#64748b",
                        font: { size: 11, weight: "600" }
                    },
                    grid: { color: "rgba(226, 232, 240, 0.8)" },
                    title: {
                        display: true,
                        text: "Financial Exposure ($ Millions)",
                        color: "#475569",
                        font: { size: 12, weight: "700" }
                    }
                },
                x: {
                    ticks: {
                        color: "#1e293b",
                        font: { size: 11.5, weight: "700" }
                    },
                    grid: { display: false }
                }
            }
        }
    });
}

// =========================================================================
// 3. Risk-Adjusted Unit Economics Model (Figure 2.11 - Stacked Bar Chart)
// =========================================================================
function renderUnitEconomicsChart() {
    const canvas = document.getElementById("unitEconomicsChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: [
                "Manual Fleet Contractor",
                "Flawed Baseline Autonomy",
                "Target Governed Autonomy"
            ],
            datasets: [
                {
                    label: "Energy / Fuel Base",
                    data: [0.35, 0.25, 0.22],
                    backgroundColor: "rgba(59, 130, 246, 0.82)", // Blue
                    borderRadius: 4
                },
                {
                    label: "Hardware & Sensor Depr.",
                    data: [0.25, 0.85, 0.55],
                    backgroundColor: "rgba(139, 92, 246, 0.82)", // Violet
                    borderRadius: 4
                },
                {
                    label: "Human Driver / HITL Operator",
                    data: [1.40, 0.00, 0.28],
                    backgroundColor: "rgba(16, 185, 129, 0.82)", // Emerald
                    borderRadius: 4
                },
                {
                    label: "Remote Teleoperator Rescue Buffer",
                    data: [0.00, 1.60, 0.12],
                    backgroundColor: "rgba(245, 158, 11, 0.85)", // Amber Warning
                    borderRadius: 4
                },
                {
                    label: "Emergency Tow & Scrap Overhead",
                    data: [0.10, 1.50, 0.18],
                    backgroundColor: "rgba(239, 68, 68, 0.88)", // Red Bleed
                    borderRadius: 4
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
                        boxWidth: 12,
                        boxHeight: 12,
                        padding: 14,
                        font: { size: 11, weight: "600" }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return ` ${context.dataset.label}: $${context.raw.toFixed(2)}/mile`;
                        },
                        footer: function(items) {
                            let total = 0;
                            items.forEach(item => {
                                total += item.raw;
                            });
                            return ` Total Loaded Cost: $${total.toFixed(2)}/mile`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    ticks: {
                        color: "#0f172a",
                        font: { size: 11.5, weight: "700" }
                    },
                    grid: { display: false }
                },
                y: {
                    stacked: true,
                    min: 0,
                    max: 5.0,
                    ticks: {
                        stepSize: 1.0,
                        callback: (v) => `$${v.toFixed(2)}`,
                        color: "#64748b",
                        font: { size: 11, weight: "600" }
                    },
                    grid: { color: "rgba(226, 232, 240, 0.8)" },
                    title: {
                        display: true,
                        text: "Loaded Cost per Delivery Mile ($ USD)",
                        color: "#475569",
                        font: { size: 12, weight: "700" }
                    }
                }
            }
        },
        plugins: [
            {
                id: "stackTotals",
                afterDatasetsDraw(chart) {
                    const { ctx, scales: { x, y } } = chart;
                    const totals = ["$2.10 / mi", "$4.20 / mi (Bleed!)", "$1.35 / mi (Target)"];
                    const yValues = [2.10, 4.20, 1.35];

                    ctx.save();
                    ctx.font = "bold 13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
                    ctx.textAlign = "center";

                    yValues.forEach((totalVal, i) => {
                        const xPos = x.getPixelForTick(i);
                        const yPos = y.getPixelForValue(totalVal) - 8;
                        ctx.fillStyle = i === 1 ? "#dc2626" : (i === 2 ? "#16a34a" : "#1e293b");
                        ctx.fillText(totals[i], xPos, yPos);
                    });
                    ctx.restore();
                }
            }
        ]
    });
}
