/**
 * Chapter 1 Chart.js Visualizations (Glassmorphism Theme)
 */

document.addEventListener("DOMContentLoaded", () => {
    initChartDefaults();
    renderRadarChart();
    renderLossBarChart();
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
// 1. Architecture Maturity Radar Chart (Chart.js - Glass Theme)
// =========================================================================
function renderRadarChart() {
    const canvas = document.getElementById("maturityRadarChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    new Chart(ctx, {
        type: "radar",
        data: {
            labels: [
                "Data Architecture (D₁)",
                "Algorithmic Gov. (D₂)",
                "Edge Scalability (D₃)",
                "Unit Economics (D₄)",
                "Workforce & Culture (D₅)"
            ],
            datasets: [
                {
                    label: "Terra-Resource (Upstream - CMS: 1.8)",
                    data: [1, 2, 2, 2, 2],
                    backgroundColor: "rgba(245, 158, 11, 0.22)",
                    borderColor: "#f59e0b",
                    borderWidth: 2.2,
                    pointBackgroundColor: "#ffffff",
                    pointBorderColor: "#f59e0b",
                    pointBorderWidth: 2,
                    pointRadius: 4.5,
                    pointHoverRadius: 6.5
                },
                {
                    label: "Volt-Tech OEM (Midstream - CMS: 2.2)",
                    data: [2, 2, 3, 2, 2],
                    backgroundColor: "rgba(16, 185, 129, 0.22)",
                    borderColor: "#10b981",
                    borderWidth: 2.2,
                    pointBackgroundColor: "#ffffff",
                    pointBorderColor: "#10b981",
                    pointBorderWidth: 2,
                    pointRadius: 4.5,
                    pointHoverRadius: 6.5
                },
                {
                    label: "Orbit-Logistics (Downstream - CMS: 2.0)",
                    data: [2, 2, 3, 1, 2],
                    backgroundColor: "rgba(59, 130, 246, 0.24)",
                    borderColor: "#3b82f6",
                    borderWidth: 2.2,
                    pointBackgroundColor: "#ffffff",
                    pointBorderColor: "#3b82f6",
                    pointBorderWidth: 2,
                    pointRadius: 4.5,
                    pointHoverRadius: 6.5
                },
                {
                    label: "Target State Horizon (End of Phase H - CMS: 4.2+)",
                    data: [4.2, 4.2, 4.2, 4.2, 4.2],
                    backgroundColor: "rgba(139, 92, 246, 0.08)",
                    borderColor: "#8b5cf6",
                    borderWidth: 2.5,
                    borderDash: [6, 4],
                    pointBackgroundColor: "#ffffff",
                    pointBorderColor: "#8b5cf6",
                    pointBorderWidth: 2,
                    pointRadius: 4.5,
                    pointHoverRadius: 6.5
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
                        boxHeight: 14,
                        usePointStyle: true,
                        padding: 18,
                        font: {
                            size: 11.5,
                            weight: "600"
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return ` ${context.dataset.label.split(" (")[0]}: Level ${context.raw} / 5.0`;
                        }
                    }
                }
            },
            scales: {
                r: {
                    min: 0,
                    max: 5,
                    ticks: {
                        stepSize: 1,
                        backdropColor: "rgba(255, 255, 255, 0.8)",
                        color: "#64748b",
                        font: {
                            size: 10,
                            weight: "700"
                        }
                    },
                    grid: {
                        color: "rgba(203, 213, 225, 0.6)"
                    },
                    angleLines: {
                        color: "rgba(148, 163, 184, 0.4)",
                        lineWidth: 1.2
                    },
                    pointLabels: {
                        color: "#0f172a",
                        font: {
                            size: 12,
                            weight: "700"
                        }
                    }
                }
            }
        }
    });
}

// =========================================================================
// 2. Quarterly EBITDA Bleed Bar Chart (Chart.js - Glass Theme)
// =========================================================================
function renderLossBarChart() {
    const canvas = document.getElementById("lossBarChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Glass Crimson Canvas Gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 260);
    gradient.addColorStop(0, "rgba(248, 113, 113, 0.92)"); // light coral top
    gradient.addColorStop(0.5, "rgba(239, 68, 68, 0.95)");  // bright crimson
    gradient.addColorStop(1, "rgba(185, 28, 28, 0.98)");   // deep ruby bottom

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: [
                "Q1 Baseline",
                "Q2 Expansion",
                "Q3 Peak Fleet",
                "Q4 Emergency"
            ],
            datasets: [
                {
                    label: "Quarterly EBITDA (Millions USD)",
                    data: [-20, -35, -42, -50],
                    backgroundColor: gradient,
                    borderColor: "rgba(255, 255, 255, 0.85)",
                    borderWidth: 1.5,
                    borderRadius: 8,
                    borderSkipped: false,
                    maxBarThickness: 72
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
                        title: function(items) {
                            return items[0].label;
                        },
                        label: function(context) {
                            const val = context.raw;
                            const notes = {
                                "-20": "Unbudgeted Cloud Compute & Tow Buffers",
                                "-35": "Remote Human Teleoperator Escalations",
                                "-42": "Ghost Telemetry & Sensor Overrides",
                                "-50": "🚨 Existential Fiduciary CapEx Freeze"
                            };
                            return [
                                ` EBITDA Loss: -$${Math.abs(val)}M`,
                                ` Driver: ${notes[val] || ""}`
                            ];
                        }
                    }
                }
            },
            scales: {
                y: {
                    min: -60,
                    max: 0,
                    ticks: {
                        stepSize: 10,
                        callback: function(value) {
                            return value === 0 ? "$0M" : `-$${Math.abs(value)}M`;
                        },
                        color: "#64748b",
                        font: {
                            size: 11.5,
                            weight: "600"
                        }
                    },
                    grid: {
                        color: "rgba(226, 232, 240, 0.8)",
                        drawBorder: false
                    },
                    title: {
                        display: true,
                        text: "Quarterly EBITDA (Millions USD)",
                        color: "#475569",
                        font: {
                            size: 12,
                            weight: "700"
                        }
                    }
                },
                x: {
                    ticks: {
                        color: "#1e293b",
                        font: {
                            size: 12,
                            weight: "800"
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        },
        plugins: [
            {
                id: "customBarLabels",
                afterDatasetsDraw(chart) {
                    const { ctx, data } = chart;
                    chart.getDatasetMeta(0).data.forEach((bar, index) => {
                        const val = data.datasets[0].data[index];
                        ctx.save();
                        ctx.fillStyle = "#ffffff";
                        ctx.font = "bold 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
                        ctx.textAlign = "center";
                        ctx.textBaseline = "middle";
                        
                        // Center label inside bar
                        const yPos = (bar.y + bar.base) / 2;
                        ctx.fillText(`-$${Math.abs(val)}M`, bar.x, yPos);
                        ctx.restore();
                    });
                }
            }
        ]
    });
}
