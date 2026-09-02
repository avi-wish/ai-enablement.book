/**
 * Chapter 3 Chart.js Visualizations (Glassmorphism Theme)
 */

document.addEventListener("DOMContentLoaded", () => {
    initChartDefaults();
    renderTransformationReadinessChart();
    renderRiskReductionChart();
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
// 1. Business Transformation Readiness Assessment (Figure 3.8 - Radar Chart)
// =========================================================================
function renderTransformationReadinessChart() {
    const canvas = document.getElementById("transformationReadinessChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    new Chart(ctx, {
        type: "radar",
        data: {
            labels: [
                "Leadership & Governance",
                "Technical Data Pipeline",
                "Supplier Lineage (OEM)",
                "Workforce Trust & Escrow",
                "Regulatory & ESG Compliance",
                "Capital & Value Discipline"
            ],
            datasets: [
                {
                    label: "Baseline Readiness (Pre-Intervention)",
                    data: [85, 50, 35, 40, 60, 45],
                    backgroundColor: "rgba(239, 68, 68, 0.22)",
                    borderColor: "#ef4444",
                    borderWidth: 2.2,
                    pointBackgroundColor: "#ffffff",
                    pointBorderColor: "#ef4444",
                    pointBorderWidth: 2,
                    pointRadius: 4.5
                },
                {
                    label: "Target Post-Escrow Readiness (Phase A Gate)",
                    data: [95, 85, 75, 85, 90, 88],
                    backgroundColor: "rgba(16, 185, 129, 0.22)",
                    borderColor: "#10b981",
                    borderWidth: 2.4,
                    pointBackgroundColor: "#ffffff",
                    pointBorderColor: "#10b981",
                    pointBorderWidth: 2,
                    pointRadius: 4.5
                },
                {
                    label: "Critical Risk Ceiling (50% Threshold)",
                    data: [50, 50, 50, 50, 50, 50],
                    backgroundColor: "rgba(245, 158, 11, 0.05)",
                    borderColor: "#f59e0b",
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointRadius: 0
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
                            return ` ${context.dataset.label.split(" (")[0]}: ${context.raw}% Readiness`;
                        }
                    }
                }
            },
            scales: {
                r: {
                    min: 0,
                    max: 100,
                    ticks: {
                        stepSize: 20,
                        callback: (v) => `${v}%`,
                        backdropColor: "rgba(255, 255, 255, 0.8)",
                        color: "#64748b",
                        font: { size: 10, weight: "700" }
                    },
                    grid: { color: "rgba(203, 213, 225, 0.6)" },
                    angleLines: { color: "rgba(148, 163, 184, 0.4)" },
                    pointLabels: {
                        color: "#0f172a",
                        font: { size: 11.5, weight: "700" }
                    }
                }
            }
        }
    });
}

// =========================================================================
// 2. Architecture Risk Mitigation & Reduction (Figure 3.9 - Horizontal Bars)
// =========================================================================
function renderRiskReductionChart() {
    const canvas = document.getElementById("riskReductionChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: [
                "CapEx Bleed ($50M/Qtr)",
                "Ghost Telemetry Masking",
                "Edge Disconnect Freezes",
                "Workforce AI Revolt"
            ],
            datasets: [
                {
                    label: "Initial Risk Score (Pre-Mitigation)",
                    data: [25, 20, 20, 25],
                    backgroundColor: "rgba(239, 68, 68, 0.85)",
                    borderColor: "rgba(255, 255, 255, 0.8)",
                    borderWidth: 1.2,
                    borderRadius: 6,
                    maxBarThickness: 22
                },
                {
                    label: "Residual Risk Score (Post-Architecture Safeguards)",
                    data: [4, 5, 6, 5],
                    backgroundColor: "rgba(16, 185, 129, 0.85)",
                    borderColor: "rgba(255, 255, 255, 0.8)",
                    borderWidth: 1.2,
                    borderRadius: 6,
                    maxBarThickness: 22
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
                            const score = context.raw;
                            const rating = score >= 20 ? "🚨 Critical (Red)" : (score >= 12 ? "⚠️ High (Amber)" : "✅ Controlled (Green)");
                            return ` ${context.dataset.label.split(" (")[0]}: Score ${score}/25 (${rating})`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    min: 0,
                    max: 25,
                    ticks: {
                        stepSize: 5,
                        color: "#64748b",
                        font: { size: 11, weight: "600" }
                    },
                    grid: { color: "rgba(226, 232, 240, 0.8)" },
                    title: {
                        display: true,
                        text: "Risk Severity Index (Probability × Impact, Scale 1–25)",
                        color: "#475569",
                        font: { size: 12, weight: "700" }
                    }
                },
                y: {
                    ticks: {
                        color: "#0f172a",
                        font: { size: 12, weight: "700" }
                    },
                    grid: { display: false }
                }
            }
        }
    });
}
