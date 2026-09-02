/**
 * Chapter 10 Chart.js Visualizations (Glassmorphism Theme)
 * Figures 10.2, 10.7, 10.8 (Takeover Latency Gauge), 10.9 (Cost Candlestick)
 */

document.addEventListener("DOMContentLoaded", () => {
    initChartDefaults();
    renderCostRealizationChart();
    renderResolutionPieChart();
    renderTakeoverLatencyGaugeChart();
    renderCostCandlestickChart();
});

function initChartDefaults() {
    if (typeof Chart === "undefined") return;

    Chart.defaults.font.family = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
    Chart.defaults.color = "#334155";
    Chart.defaults.plugins.tooltip.backgroundColor = "rgba(15, 23, 42, 0.92)";
    Chart.defaults.plugins.tooltip.titleColor = "#f8fafc";
    Chart.defaults.plugins.tooltip.bodyColor = "#f1f5f9";
    Chart.defaults.plugins.tooltip.padding = 12;
    Chart.defaults.plugins.tooltip.cornerRadius = 8;
    Chart.defaults.plugins.tooltip.borderColor = "rgba(255, 255, 255, 0.25)";
    Chart.defaults.plugins.tooltip.borderWidth = 1;
}

// =========================================================================
// 1. Live APM Cost Realization Telemetry (Figure 10.2 - Line Chart)
// =========================================================================
function renderCostRealizationChart() {
    const canvas = document.getElementById("costRealizationChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const fillGradient = ctx.createLinearGradient(0, 0, 0, 300);
    fillGradient.addColorStop(0, "rgba(59, 130, 246, 0.25)");
    fillGradient.addColorStop(1, "rgba(59, 130, 246, 0.0)");

    new Chart(ctx, {
        type: "line",
        data: {
            labels: [
                "Month 1 (Baseline)",
                "Month 2",
                "Month 3 (Refit)",
                "Month 4",
                "Month 5 (Target Met)",
                "Month 6 (Optimized)"
            ],
            datasets: [
                {
                    label: "Live Fleet Operating Cost ($/km)",
                    data: [1.12, 1.08, 1.03, 0.98, 0.94, 0.92],
                    borderColor: "#2563eb",
                    backgroundColor: fillGradient,
                    fill: true,
                    tension: 0.35,
                    borderWidth: 2.8,
                    pointBackgroundColor: "#ffffff",
                    pointBorderColor: "#2563eb",
                    pointBorderWidth: 2,
                    pointRadius: 5.5
                },
                {
                    label: "Phase A Target Ceiling ($0.94/km)",
                    data: [0.94, 0.94, 0.94, 0.94, 0.94, 0.94],
                    borderColor: "#ef4444",
                    borderWidth: 1.8,
                    borderDash: [5, 4],
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
                            return ` ${context.dataset.label}: $${context.raw.toFixed(2)}/km`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    min: 0.85,
                    max: 1.20,
                    ticks: {
                        stepSize: 0.05,
                        callback: (v) => `$${v.toFixed(2)}`,
                        color: "#64748b",
                        font: { size: 11, weight: "700" }
                    },
                    grid: { color: "rgba(226, 232, 240, 0.8)" },
                    title: {
                        display: true,
                        text: "Loaded Cost per KM ($/km)",
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
        }
    });
}

// =========================================================================
// 2. Autonomous Fleet Incident Resolution Composition (Figure 10.7 - Doughnut)
// =========================================================================
function renderResolutionPieChart() {
    const canvas = document.getElementById("resolutionPieChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: [
                "Autonomous AI Routing (85%)",
                "HITL Tele-Assist Triage (13%)",
                "Manual Roadside Escalation (2%)"
            ],
            datasets: [
                {
                    data: [85, 13, 2],
                    backgroundColor: [
                        "rgba(16, 185, 129, 0.88)", // Emerald Green (Autonomous)
                        "rgba(59, 130, 246, 0.88)",  // Sky Blue (HITL Tele-Assist)
                        "rgba(245, 158, 11, 0.88)"  // Amber (Manual Roadside)
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
            cutout: "66%",
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
                            return ` ${context.label}: ${context.raw}% of all routing dispatches`;
                        }
                    }
                }
            }
        },
        plugins: [
            {
                id: "pieCenterText",
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
                    ctx.fillText("98% Governed", centerPoint.x, centerPoint.y - 10);

                    ctx.font = "500 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
                    ctx.fillStyle = "#15803d";
                    ctx.fillText("Zero Towing Escapes", centerPoint.x, centerPoint.y + 12);
                    ctx.restore();
                }
            }
        ]
    });
}

// =========================================================================
// 3. Takeover Latency Gauge Chart (Figure 10.8 - Semi-Doughnut Gauge)
// =========================================================================
function renderTakeoverLatencyGaugeChart() {
    const canvas = document.getElementById("takeoverLatencyGaugeChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const currentLatency = 135; // Measured ms
    const maxScale = 300; // Total scale ms

    new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: [
                "Optimal Band (0–150 ms)",
                "Warning Band (150–200 ms)",
                "SLA Breach Band (200–300 ms)"
            ],
            datasets: [
                {
                    data: [150, 50, 100],
                    backgroundColor: [
                        "rgba(16, 185, 129, 0.90)", // Emerald (0-150ms)
                        "rgba(245, 158, 11, 0.90)", // Amber Warning (150-200ms)
                        "rgba(239, 68, 68, 0.90)"   // Red Breach (200-300ms)
                    ],
                    borderColor: "#ffffff",
                    borderWidth: 2,
                    hoverOffset: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            circumference: 180,
            rotation: -90,
            cutout: "70%",
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        boxWidth: 12,
                        boxHeight: 12,
                        usePointStyle: true,
                        padding: 14,
                        font: { size: 11, weight: "600" }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return ` ${context.label}: ${context.raw} ms band`;
                        }
                    }
                }
            }
        },
        plugins: [
            {
                id: "gaugeNeedleAndTelemetry",
                afterDraw(chart) {
                    const { ctx, chartArea } = chart;
                    const meta = chart.getDatasetMeta(0);
                    if (!meta.data.length) return;

                    const centerX = (chartArea.left + chartArea.right) / 2;
                    const centerY = chartArea.bottom - 25;
                    const outerRadius = meta.data[0].outerRadius;
                    const innerRadius = meta.data[0].innerRadius;

                    ctx.save();

                    // 1. Draw Tick Marks & Scale Labels
                    ctx.font = "bold 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
                    ctx.fillStyle = "#64748b";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";

                    // 0 ms (Left)
                    ctx.fillText("0 ms", centerX - outerRadius - 18, centerY - 5);
                    // 150 ms (Top Left, 90 deg from horizontal start)
                    ctx.fillText("150 ms", centerX - (innerRadius * 0.4), centerY - outerRadius - 12);
                    // 200 ms (Top Right, SLA Gate)
                    ctx.fillStyle = "#b45309";
                    ctx.fillText("200 ms (SLA)", centerX + (innerRadius * 0.45), centerY - outerRadius - 12);
                    // 300 ms (Right)
                    ctx.fillStyle = "#dc2626";
                    ctx.fillText("300 ms", centerX + outerRadius + 22, centerY - 5);

                    // 2. Draw Needle pointing at 135 ms
                    // 0ms = -PI (180 deg), 300ms = 0 (0 deg)
                    const angle = -Math.PI + (currentLatency / maxScale) * Math.PI;
                    const needleLength = innerRadius + (outerRadius - innerRadius) * 0.7;

                    ctx.save();
                    ctx.translate(centerX, centerY);
                    ctx.rotate(angle);

                    // Needle shadow
                    ctx.shadowColor = "rgba(15, 23, 42, 0.25)";
                    ctx.shadowBlur = 6;
                    ctx.shadowOffsetX = 2;
                    ctx.shadowOffsetY = 2;

                    // Needle polygon
                    ctx.beginPath();
                    ctx.moveTo(0, -4);
                    ctx.lineTo(needleLength, 0);
                    ctx.lineTo(0, 4);
                    ctx.closePath();
                    ctx.fillStyle = "#0f172a";
                    ctx.fill();
                    ctx.restore();

                    // 3. Central Pivot Circle
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
                    ctx.fillStyle = "#0284c7";
                    ctx.fill();
                    ctx.lineWidth = 2.5;
                    ctx.strokeStyle = "#ffffff";
                    ctx.stroke();

                    // 4. Center Telemetry Digital Display
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";

                    // Large Digital Readout
                    ctx.font = "bold 26px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
                    ctx.fillStyle = "#0f172a";
                    ctx.fillText(`${currentLatency} ms`, centerX, centerY - 46);

                    // Status Badge
                    ctx.font = "bold 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
                    ctx.fillStyle = "#15803d";
                    ctx.fillText("✓ COMPLIANT (SLA ≤ 200 ms)", centerX, centerY - 24);

                    // Subtext
                    ctx.font = "500 10px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
                    ctx.fillStyle = "#64748b";
                    ctx.fillText("EU AI Act Art. 14 Human Oversight Gate", centerX, centerY - 8);

                    ctx.restore();
                }
            }
        ]
    });
}

// =========================================================================
// 4. Cost Volatility Candlestick Chart (Figure 10.9 - SCOR CO.1.1)
// =========================================================================
function renderCostCandlestickChart() {
    const canvas = document.getElementById("costCandlestickChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const candlestickData = [
        { week: "Week 1 (Pre-HITL)", open: 1.15, high: 1.40, low: 1.05, close: 1.25, type: "bearish", label: "High Cost Spike" },
        { week: "Week 2 (Transition)", open: 1.25, high: 1.35, low: 1.00, close: 1.10, type: "bullish", label: "Initial Dampening" },
        { week: "Week 3 (HITL Active)", open: 1.10, high: 1.15, low: 0.95, close: 0.98, type: "bullish", label: "Variance Reduction" },
        { week: "Week 4 (Optimized)", open: 0.98, high: 1.00, low: 0.90, close: 0.92, type: "bullish", label: "Predictable Floor" }
    ];

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: candlestickData.map(d => d.week),
            datasets: [
                {
                    label: "Operating Cost Body (Open to Close Range)",
                    data: candlestickData.map(d => [Math.min(d.open, d.close), Math.max(d.open, d.close)]),
                    backgroundColor: candlestickData.map(d => 
                        d.close > d.open ? "rgba(239, 68, 68, 0.85)" : "rgba(16, 185, 129, 0.85)"
                    ),
                    borderColor: candlestickData.map(d => 
                        d.close > d.open ? "#dc2626" : "#059669"
                    ),
                    borderWidth: 2,
                    borderRadius: 4,
                    barPercentage: 0.42
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
                        usePointStyle: true,
                        font: { size: 11, weight: "600" }
                    }
                },
                tooltip: {
                    callbacks: {
                        title: function(items) {
                            const idx = items[0].dataIndex;
                            return candlestickData[idx].week;
                        },
                        label: function(context) {
                            const idx = context.dataIndex;
                            const d = candlestickData[idx];
                            const variance = (d.high - d.low).toFixed(2);
                            const change = (d.close - d.open).toFixed(2);
                            const changeSign = d.close >= d.open ? "+$" : "-$";

                            return [
                                ` Open: $${d.open.toFixed(2)}/km`,
                                ` Close: $${d.close.toFixed(2)}/km (${changeSign}${Math.abs(change)})`,
                                ` High (Spike): $${d.high.toFixed(2)}/km`,
                                ` Low (Floor): $${d.low.toFixed(2)}/km`,
                                ` Weekly Variance (Wick): $${variance}/km`
                            ];
                        }
                    }
                }
            },
            scales: {
                y: {
                    min: 0.80,
                    max: 1.50,
                    ticks: {
                        stepSize: 0.10,
                        callback: (v) => `$${v.toFixed(2)}`,
                        color: "#64748b",
                        font: { size: 11, weight: "700" }
                    },
                    grid: { color: "rgba(226, 232, 240, 0.8)" },
                    title: {
                        display: true,
                        text: "Loaded Fleet Cost per KM ($/km)",
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
                id: "candlestickWicksAndTargets",
                afterDraw(chart) {
                    const { ctx, scales: { x, y } } = chart;
                    const meta = chart.getDatasetMeta(0);
                    if (!meta.data.length) return;

                    ctx.save();

                    // 1. Draw Target Ceiling Line ($1.10)
                    const targetY = y.getPixelForValue(1.10);
                    ctx.beginPath();
                    ctx.setLineDash([6, 5]);
                    ctx.moveTo(chart.chartArea.left, targetY);
                    ctx.lineTo(chart.chartArea.right, targetY);
                    ctx.strokeStyle = "#f59e0b";
                    ctx.lineWidth = 1.8;
                    ctx.stroke();
                    ctx.setLineDash([]);

                    ctx.font = "bold 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
                    ctx.fillStyle = "#b45309";
                    ctx.textAlign = "right";
                    ctx.fillText("Phase A Target Ceiling ($1.10/km)", chart.chartArea.right - 8, targetY - 6);

                    // 2. Draw High/Low Wicks through each candle
                    candlestickData.forEach((d, idx) => {
                        const bar = meta.data[idx];
                        if (!bar) return;

                        const barX = bar.x;
                        const highY = y.getPixelForValue(d.high);
                        const lowY = y.getPixelForValue(d.low);
                        const isBearish = d.close > d.open;

                        ctx.beginPath();
                        ctx.moveTo(barX, highY);
                        ctx.lineTo(barX, lowY);
                        ctx.strokeStyle = isBearish ? "#dc2626" : "#059669";
                        ctx.lineWidth = 2.5;
                        ctx.stroke();

                        // High and Low caps
                        ctx.beginPath();
                        ctx.moveTo(barX - 6, highY);
                        ctx.lineTo(barX + 6, highY);
                        ctx.moveTo(barX - 6, lowY);
                        ctx.lineTo(barX + 6, lowY);
                        ctx.stroke();
                    });

                    // 3. Annotations
                    // Week 1 Long Wick annotation
                    const bar0 = meta.data[0];
                    if (bar0) {
                        ctx.fillStyle = "#991b1b";
                        ctx.font = "bold 10.5px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
                        ctx.textAlign = "center";
                        ctx.fillText("▲ Extreme Wick ($1.40)", bar0.x, y.getPixelForValue(1.40) - 10);
                        ctx.font = "500 9.5px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
                        ctx.fillStyle = "#dc2626";
                        ctx.fillText("(Unhandled Edge Spikes)", bar0.x, y.getPixelForValue(1.40) + 16);
                    }

                    // Week 4 Tight Body annotation
                    const bar3 = meta.data[3];
                    if (bar3) {
                        ctx.fillStyle = "#166534";
                        ctx.font = "bold 10.5px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
                        ctx.textAlign = "center";
                        ctx.fillText("✓ Tight Body ($0.90–$1.00)", bar3.x, y.getPixelForValue(1.00) - 10);
                        ctx.font = "500 9.5px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
                        ctx.fillStyle = "#15803d";
                        ctx.fillText("(Governed Stability)", bar3.x, y.getPixelForValue(0.90) + 20);
                    }

                    ctx.restore();
                }
            }
        ]
    });
}
