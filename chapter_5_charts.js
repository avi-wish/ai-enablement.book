/**
 * Chapter 5 Chart.js Visualizations (Glassmorphism Theme)
 */

document.addEventListener("DOMContentLoaded", () => {
    initChartDefaults();
    renderLegacyDataRotChart();
    renderPipelineQualityChart();
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
// 1. Legacy Data Rot Breakdown (Figure 5.3B - Doughnut Chart)
// =========================================================================
function renderLegacyDataRotChart() {
    const canvas = document.getElementById("legacyDataRotChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: [
                "Incompatible Schemas (CSV/DBF)",
                "Corrupted Purity Readings",
                "Duplicate Batch IDs & Timestamps",
                "Cryptographically Clean Records"
            ],
            datasets: [
                {
                    data: [42, 28, 18, 12],
                    backgroundColor: [
                        "rgba(239, 68, 68, 0.88)",  // Red (Schema Rot)
                        "rgba(245, 158, 11, 0.88)", // Amber (Purity Rot)
                        "rgba(139, 92, 246, 0.88)", // Purple (Duplicates)
                        "rgba(16, 185, 129, 0.88)"  // Green (Clean)
                    ],
                    borderColor: "rgba(255, 255, 255, 0.95)",
                    borderWidth: 2,
                    hoverOffset: 8
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "68%",
            plugins: {
                legend: {
                    position: "right",
                    labels: {
                        boxWidth: 14,
                        boxHeight: 14,
                        usePointStyle: true,
                        padding: 16,
                        font: { size: 11.5, weight: "600" }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const count = Math.round(14000 * (context.raw / 100));
                            return ` ${context.label}: ${context.raw}% (~${count.toLocaleString()} records)`;
                        }
                    }
                }
            }
        },
        plugins: [
            {
                id: "centerText",
                afterDraw(chart) {
                    const { ctx } = chart;
                    const meta = chart.getDatasetMeta(0);
                    if (!meta.data.length) return;
                    const centerPoint = meta.data[0];

                    ctx.save();
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";

                    ctx.font = "bold 20px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
                    ctx.fillStyle = "#0f172a";
                    ctx.fillText("88% Rot", centerPoint.x, centerPoint.y - 10);

                    ctx.font = "500 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
                    ctx.fillStyle = "#dc2626";
                    ctx.fillText("12,320 Defective", centerPoint.x, centerPoint.y + 12);
                    ctx.restore();
                }
            }
        ]
    });
}

// =========================================================================
// 2. Data Pipeline Quality & Ingestion Stabilization (Figure 5.6B - Combo Chart)
// =========================================================================
function renderPipelineQualityChart() {
    const canvas = document.getElementById("pipelineQualityChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: [
                "State 0: Legacy Silos",
                "State 1: ACL Cleansing",
                "State 2: Lakehouse Sync",
                "State 3: DPP Streaming"
            ],
            datasets: [
                {
                    type: "line",
                    label: "Assay Purity Variance (±%)",
                    data: [4.8, 2.1, 0.4, 0.1],
                    borderColor: "#ef4444",
                    backgroundColor: "rgba(239, 68, 68, 0.15)",
                    borderWidth: 2.8,
                    pointBackgroundColor: "#ffffff",
                    pointBorderColor: "#ef4444",
                    pointBorderWidth: 2,
                    pointRadius: 5.5,
                    yAxisID: "yVariance"
                },
                {
                    type: "bar",
                    label: "Daily Ingestion Throughput (Records/Day)",
                    data: [250, 2400, 7500, 12500],
                    backgroundColor: "rgba(59, 130, 246, 0.82)",
                    borderColor: "rgba(255, 255, 255, 0.85)",
                    borderWidth: 1.2,
                    borderRadius: 6,
                    maxBarThickness: 42,
                    yAxisID: "yThroughput"
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
                            if (context.datasetIndex === 0) {
                                return ` Purity Variance: ±${context.raw}%`;
                            }
                            return ` Ingestion Rate: ${context.raw.toLocaleString()} events/day`;
                        }
                    }
                }
            },
            scales: {
                yThroughput: {
                    type: "linear",
                    position: "left",
                    min: 0,
                    max: 14000,
                    ticks: {
                        stepSize: 3500,
                        callback: (v) => `${(v / 1000).toFixed(1)}k`,
                        color: "#2563eb",
                        font: { size: 11, weight: "700" }
                    },
                    grid: { color: "rgba(226, 232, 240, 0.8)" },
                    title: {
                        display: true,
                        text: "Daily Throughput (Records / Day)",
                        color: "#1d4ed8",
                        font: { size: 11.5, weight: "700" }
                    }
                },
                yVariance: {
                    type: "linear",
                    position: "right",
                    min: 0,
                    max: 6.0,
                    ticks: {
                        stepSize: 1.5,
                        callback: (v) => `±${v}%`,
                        color: "#dc2626",
                        font: { size: 11, weight: "700" }
                    },
                    grid: { drawOnChartArea: false },
                    title: {
                        display: true,
                        text: "Assay Purity Variance (±%)",
                        color: "#991b1b",
                        font: { size: 11.5, weight: "700" }
                    }
                },
                x: {
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
