/**
 * Chapter 8 Chart.js Visualizations (Glassmorphism Theme)
 */

document.addEventListener("DOMContentLoaded", () => {
    initChartDefaults();
    renderCapitalScurveChart();
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
// 1. Capital Drawdown & Net Value Realization S-Curve (Figure 8.3 - Dual Line)
// =========================================================================
function renderCapitalScurveChart() {
    const canvas = document.getElementById("capitalScurveChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const sCurveGrad = ctx.createLinearGradient(0, 0, 0, 300);
    sCurveGrad.addColorStop(0, "rgba(16, 185, 129, 0.28)");
    sCurveGrad.addColorStop(1, "rgba(16, 185, 129, 0.0)");

    new Chart(ctx, {
        type: "line",
        data: {
            labels: [
                "M0 (Kickoff)",
                "M3 (Tranche 1)",
                "M6 (Tranche 2)",
                "M7 (Breakeven)",
                "M12 (Yr 1)",
                "M24 (Yr 2)",
                "M36 (Yr 3)",
                "M48 (Yr 4)",
                "M60 (Yr 5)"
            ],
            datasets: [
                {
                    label: "Cumulative Net Value Realization S-Curve ($M)",
                    data: [0, -5.2, -1.8, 0.0, 13.4, 44.8, 76.2, 107.6, 139.0],
                    borderColor: "#10b981",
                    backgroundColor: sCurveGrad,
                    fill: true,
                    tension: 0.38,
                    borderWidth: 3,
                    pointBackgroundColor: "#ffffff",
                    pointBorderColor: "#10b981",
                    pointBorderWidth: 2.2,
                    pointRadius: [4, 4, 4, 7, 4, 4, 4, 4, 6] // Highlight breakeven at index 3
                },
                {
                    label: "Staged CapEx Investment ($M)",
                    data: [0, -7.5, -13.8, -18.0, -18.0, -18.0, -18.0, -18.0, -18.0],
                    borderColor: "#f59e0b",
                    backgroundColor: "rgba(245, 158, 11, 0.12)",
                    stepped: true,
                    borderWidth: 2.2,
                    borderDash: [5, 4],
                    pointBackgroundColor: "#ffffff",
                    pointBorderColor: "#f59e0b",
                    pointBorderWidth: 1.8,
                    pointRadius: 4
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
                            const val = context.raw;
                            if (context.datasetIndex === 0) {
                                if (context.dataIndex === 3) {
                                    return ` 🎯 Breakeven Achieved at Month 6.88 (~$0.0M Net)`;
                                }
                                return ` Cumulative Value: ${val >= 0 ? `+$${val.toFixed(1)}M` : `-$${Math.abs(val).toFixed(1)}M`}`;
                            }
                            return ` Staged CapEx Escrow: $${Math.abs(val).toFixed(1)}M Total`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    min: -25,
                    max: 150,
                    ticks: {
                        stepSize: 25,
                        callback: (v) => v === 0 ? "$0M" : (v > 0 ? `+$${v}M` : `-$${Math.abs(v)}M`),
                        color: "#64748b",
                        font: { size: 11, weight: "700" }
                    },
                    grid: { color: "rgba(226, 232, 240, 0.8)" },
                    title: {
                        display: true,
                        text: "Net Value & Staged CapEx ($ Millions)",
                        color: "#475569",
                        font: { size: 12, weight: "700" }
                    }
                },
                x: {
                    ticks: {
                        color: "#0f172a",
                        font: { size: 11, weight: "700" }
                    },
                    grid: { color: "rgba(241, 245, 249, 0.8)" }
                }
            }
        },
        plugins: [
            {
                id: "breakevenAnnotation",
                afterDatasetsDraw(chart) {
                    const { ctx, scales: { x, y } } = chart;
                    const meta = chart.getDatasetMeta(0);
                    const point = meta.data[3]; // Index 3 is Month 7 breakeven

                    if (point) {
                        ctx.save();
                        ctx.font = "bold 11.5px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
                        ctx.fillStyle = "#15803d";
                        ctx.textAlign = "center";
                        ctx.fillText("🎯 Breakeven (Mo 6.88)", point.x, point.y - 14);
                        ctx.restore();
                    }
                }
            }
        ]
    });
}
