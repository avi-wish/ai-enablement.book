/**
 * Chapter 6 Chart.js Visualizations (Glassmorphism Theme)
 */

document.addEventListener("DOMContentLoaded", () => {
    initChartDefaults();
    renderLatencyPhysicsChart();
    renderQuantizationBenchmarkChart();
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
// 1. Industrial Latency & Conveyor Drift Benchmarks (Figure 6.1B - Combo Chart)
// =========================================================================
function renderLatencyPhysicsChart() {
    const canvas = document.getElementById("latencyPhysicsChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: [
                "Cloud WAN (Public 5G)",
                "Regional Cloud Edge",
                "On-Prem Private 5G",
                "Industrial Edge GPU (INT8)"
            ],
            datasets: [
                {
                    type: "bar",
                    label: "Network & Inference Latency (ms)",
                    data: [800, 120, 35, 1.8],
                    backgroundColor: [
                        "rgba(239, 68, 68, 0.88)",  // Red (Violent delay)
                        "rgba(245, 158, 11, 0.88)", // Amber (Lag)
                        "rgba(59, 130, 246, 0.88)",  // Blue (Borderline)
                        "rgba(16, 185, 129, 0.88)"  // Green (Real-Time Sub-2ms)
                    ],
                    borderColor: "rgba(255, 255, 255, 0.9)",
                    borderWidth: 1.5,
                    borderRadius: 8,
                    maxBarThickness: 48,
                    yAxisID: "yLatency"
                },
                {
                    type: "line",
                    label: "Conveyor Physical Drift (mm at 500 mm/s)",
                    data: [400, 60, 17.5, 0.9],
                    borderColor: "#7c3aed",
                    backgroundColor: "rgba(124, 58, 237, 0.15)",
                    borderWidth: 2.5,
                    pointBackgroundColor: "#ffffff",
                    pointBorderColor: "#7c3aed",
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    yAxisID: "yDrift"
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
                                return ` Latency: ${context.raw} ms`;
                            }
                            return ` Physical Drift: ${context.raw} mm (Tolerance: ±0.05 mm)`;
                        }
                    }
                }
            },
            scales: {
                yLatency: {
                    type: "logarithmic",
                    position: "left",
                    min: 1,
                    max: 1000,
                    ticks: {
                        callback: (v) => `${v} ms`,
                        color: "#dc2626",
                        font: { size: 10.5, weight: "700" }
                    },
                    grid: { color: "rgba(226, 232, 240, 0.8)" },
                    title: {
                        display: true,
                        text: "Roundtrip Latency (ms - Log Scale)",
                        color: "#991b1b",
                        font: { size: 11.5, weight: "700" }
                    }
                },
                yDrift: {
                    type: "logarithmic",
                    position: "right",
                    min: 0.5,
                    max: 500,
                    ticks: {
                        callback: (v) => `${v} mm`,
                        color: "#7c3aed",
                        font: { size: 10.5, weight: "700" }
                    },
                    grid: { drawOnChartArea: false },
                    title: {
                        display: true,
                        text: "Conveyor Travel Drift (mm - Log Scale)",
                        color: "#6d28d9",
                        font: { size: 11.5, weight: "700" }
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
        }
    });
}

// =========================================================================
// 2. TinyML Model Quantization Benchmarks (Figure 6.4B - Multi-Metric Bar)
// =========================================================================
function renderQuantizationBenchmarkChart() {
    const canvas = document.getElementById("quantizationBenchmarkChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: [
                "FP32 Unquantized (Cloud)",
                "FP16 Half-Precision (Standard Edge)",
                "INT8 TensorRT + 4:2 Sparsity (Target)"
            ],
            datasets: [
                {
                    label: "Inference Latency (ms - Lower is better)",
                    data: [42.0, 14.5, 1.8],
                    backgroundColor: "rgba(239, 68, 68, 0.82)", // Red
                    borderColor: "rgba(255, 255, 255, 0.85)",
                    borderWidth: 1.2,
                    borderRadius: 6,
                    maxBarThickness: 32
                },
                {
                    label: "Memory Binary Size (MB - Lower is better)",
                    data: [48.0, 24.0, 0.62], // Scale normalized in 10s of MB for visual harmony (480MB -> 48.0, 240MB -> 24.0, 6.2MB -> 0.62)
                    backgroundColor: "rgba(245, 158, 11, 0.85)", // Amber
                    borderColor: "rgba(255, 255, 255, 0.85)",
                    borderWidth: 1.2,
                    borderRadius: 6,
                    maxBarThickness: 32
                },
                {
                    label: "Throughput (FPS / 10 - Higher is better)",
                    data: [2.4, 6.8, 55.0], // 24 FPS -> 2.4, 68 FPS -> 6.8, 550 FPS -> 55.0
                    backgroundColor: "rgba(16, 185, 129, 0.85)", // Emerald
                    borderColor: "rgba(255, 255, 255, 0.85)",
                    borderWidth: 1.2,
                    borderRadius: 6,
                    maxBarThickness: 32
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
                        boxHeight: 13,
                        padding: 14,
                        font: { size: 11, weight: "600" }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            if (context.datasetIndex === 0) {
                                return ` Inference Latency: ${context.raw} ms`;
                            } else if (context.datasetIndex === 1) {
                                const realMB = context.raw === 0.62 ? 6.2 : context.raw * 10;
                                return ` Binary Footprint: ${realMB} MB`;
                            }
                            const realFPS = context.raw * 10;
                            return ` Throughput: ${realFPS} FPS`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    min: 0,
                    max: 60,
                    ticks: {
                        stepSize: 15,
                        color: "#64748b",
                        font: { size: 11, weight: "600" }
                    },
                    grid: { color: "rgba(226, 232, 240, 0.8)" },
                    title: {
                        display: true,
                        text: "Benchmark Performance Index",
                        color: "#475569",
                        font: { size: 12, weight: "700" }
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
