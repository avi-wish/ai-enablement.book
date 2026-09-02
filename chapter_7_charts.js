/**
 * Chapter 7 Chart.js Visualizations (Glassmorphism Theme)
 */

document.addEventListener("DOMContentLoaded", () => {
    initChartDefaults();
    renderOpexWaterfallChart();
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
// 1. Ecosystem OpEx Realization Waterfall (Figure 7.6 - Floating Bar Chart)
// =========================================================================
function renderOpexWaterfallChart() {
    const canvas = document.getElementById("opexWaterfallChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: [
                "Baseline OpEx",
                "Energy Arbitrage",
                "Auto Haulage",
                "Ore Grading AI",
                "SCOR Rail Sync",
                "Risk Gates",
                "Optimized OpEx"
            ],
            datasets: [
                {
                    label: "OpEx Bridge ($M)",
                    data: [
                        [0, 142.0],
                        [130.2, 142.0],
                        [123.8, 130.2],
                        [119.2, 123.8],
                        [113.4, 119.2],
                        [110.6, 113.4],
                        [0, 110.6]
                    ],
                    backgroundColor: [
                        "rgba(71, 85, 105, 0.88)",  // Slate for Baseline
                        "rgba(16, 185, 129, 0.85)", // Green savings
                        "rgba(16, 185, 129, 0.85)", // Green savings
                        "rgba(16, 185, 129, 0.85)", // Green savings
                        "rgba(16, 185, 129, 0.85)", // Green savings
                        "rgba(16, 185, 129, 0.85)", // Green savings
                        "rgba(2, 132, 199, 0.88)"   // Sky Blue for Target
                    ],
                    borderColor: "rgba(255, 255, 255, 0.9)",
                    borderWidth: 1.5,
                    borderRadius: 6,
                    borderSkipped: false,
                    maxBarThickness: 46
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
                            const raw = context.raw;
                            const diff = (raw[1] - raw[0]).toFixed(1);
                            if (context.dataIndex === 0) {
                                return ` Baseline Supply Chain OpEx: $${raw[1]}M`;
                            } else if (context.dataIndex === 6) {
                                return ` Optimized Target OpEx: $${raw[1]}M (22.1% Reduction)`;
                            }
                            return ` Savings Realized: -$${diff}M / Year (Range: $${raw[0]}M – $${raw[1]}M)`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    min: 90,
                    max: 155,
                    ticks: {
                        stepSize: 10,
                        callback: (v) => `$${v}M`,
                        color: "#64748b",
                        font: { size: 11, weight: "700" }
                    },
                    grid: { color: "rgba(226, 232, 240, 0.8)" },
                    title: {
                        display: true,
                        text: "Ecosystem Annual Operating Expense ($ Millions)",
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
                id: "waterfallLabels",
                afterDatasetsDraw(chart) {
                    const { ctx, data } = chart;
                    const diffLabels = [
                        "$142.0M",
                        "-$11.8M",
                        "-$6.4M",
                        "-$4.6M",
                        "-$5.8M",
                        "-$2.8M",
                        "$110.6M"
                    ];
                    chart.getDatasetMeta(0).data.forEach((bar, index) => {
                        ctx.save();
                        ctx.font = "bold 12px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
                        ctx.textAlign = "center";
                        ctx.fillStyle = index === 0 ? "#1e293b" : (index === 6 ? "#0369a1" : "#15803d");
                        
                        const yPos = bar.y - 8;
                        ctx.fillText(diffLabels[index], bar.x, yPos);
                        ctx.restore();
                    });
                }
            }
        ]
    });
}
