/**
 * Chapter 9 Chart.js Visualizations (Glassmorphism Theme)
 */

document.addEventListener("DOMContentLoaded", () => {
    initChartDefaults();
    renderFitnessFunctionsChart();
    renderEuAiActRadarChart();
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
// 1. CI/CD Fitness Functions Timing & Latency (Figure 9.3B - Bar Chart)
// =========================================================================
function renderFitnessFunctionsChart() {
    const canvas = document.getElementById("fitnessFunctionsChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: [
                "ArchUnit Layer Isolation",
                "Spectral OpenAPI Linting",
                "ASIL-D HIL Timing Assert",
                "HSM ECC Secp384r1 Seal"
            ],
            datasets: [
                {
                    label: "Execution Latency (Seconds)",
                    data: [1.2, 0.8, 1.8, 0.3],
                    backgroundColor: [
                        "rgba(59, 130, 246, 0.85)",  // Sky Blue
                        "rgba(139, 92, 246, 0.85)", // Purple
                        "rgba(16, 185, 129, 0.85)", // Emerald
                        "rgba(245, 158, 11, 0.85)"  // Amber
                    ],
                    borderColor: "rgba(255, 255, 255, 0.9)",
                    borderWidth: 1.5,
                    borderRadius: 6,
                    maxBarThickness: 28
                }
            ]
        },
        options: {
            indexAxis: "y",
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return ` Execution Time: ${context.raw}s (Status: 100% Conformance Passed)`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    min: 0,
                    max: 3.0,
                    ticks: {
                        stepSize: 0.5,
                        callback: (v) => `${v}s`,
                        color: "#64748b",
                        font: { size: 11, weight: "700" }
                    },
                    grid: { color: "rgba(226, 232, 240, 0.8)" },
                    title: {
                        display: true,
                        text: "Verification Latency (Seconds - Pipeline Limit: 5.0s Total)",
                        color: "#475569",
                        font: { size: 11.5, weight: "700" }
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
        },
        plugins: [
            {
                id: "passLabels",
                afterDatasetsDraw(chart) {
                    const { ctx } = chart;
                    chart.getDatasetMeta(0).data.forEach((bar, index) => {
                        const val = [1.2, 0.8, 1.8, 0.3][index];
                        ctx.save();
                        ctx.font = "bold 11.5px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
                        ctx.fillStyle = "#15803d";
                        ctx.textAlign = "left";
                        ctx.fillText(`${val}s (PASS ✅)`, bar.x + 8, bar.y + 4);
                        ctx.restore();
                    });
                }
            }
        ]
    });
}

// =========================================================================
// 2. EU AI Act 7 Statutory Pillars Compliance (Figure 9.2B - Radar Chart)
// =========================================================================
function renderEuAiActRadarChart() {
    const canvas = document.getElementById("euAiActRadarChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    new Chart(ctx, {
        type: "radar",
        data: {
            labels: [
                "Art 9: Risk Management",
                "Art 10: Data Governance",
                "Art 11: Tech Documentation",
                "Art 12: Record-Keeping",
                "Art 13: Transparency",
                "Art 14: Human Oversight",
                "Art 15: Robustness & Cyber"
            ],
            datasets: [
                {
                    label: "Audited Ecosystem Conformance (%)",
                    data: [99.8, 99.9, 99.5, 100.0, 99.7, 99.9, 99.8],
                    backgroundColor: "rgba(16, 185, 129, 0.25)",
                    borderColor: "#10b981",
                    borderWidth: 2.5,
                    pointBackgroundColor: "#ffffff",
                    pointBorderColor: "#10b981",
                    pointBorderWidth: 2,
                    pointRadius: 5
                },
                {
                    label: "EAB Stage-Gate Quality Threshold (99.50%)",
                    data: [99.5, 99.5, 99.5, 99.5, 99.5, 99.5, 99.5],
                    borderColor: "rgba(239, 68, 68, 0.75)",
                    borderWidth: 1.8,
                    borderDash: [4, 4],
                    pointRadius: 0,
                    fill: false
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
                            return ` ${context.dataset.label}: ${context.raw}%`;
                        }
                    }
                }
            },
            scales: {
                r: {
                    min: 99.0,
                    max: 100.0,
                    ticks: {
                        stepSize: 0.25,
                        callback: (v) => `${v}%`,
                        color: "#64748b",
                        backdropColor: "transparent",
                        font: { size: 10, weight: "600" }
                    },
                    grid: { color: "rgba(226, 232, 240, 0.85)" },
                    angleLines: { color: "rgba(203, 213, 225, 0.8)" },
                    pointLabels: {
                        color: "#0f172a",
                        font: { size: 11, weight: "700" }
                    }
                }
            }
        }
    });
}
