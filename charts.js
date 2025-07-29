export function createMarketShareChart() {
    const ctx = document.getElementById('marketShareChart');
    if (!ctx || ctx.chart) {
        return;
    }

    const data = {
        labels: ['Sản xuất (32%)', 'Dịch vụ & CNTT (18%)', 'Dịch vụ tài chính (17%)', 'Ngành khác (33%)'],
        datasets: [{
            label: 'Nhu Cầu ERP Theo Ngành',
            data: [32, 18, 17, 33],
            backgroundColor: [
                '#2563EB', // blue-600
                '#3B82F6', // blue-500
                '#60A5FA', // blue-400
                '#93C5FD'  // blue-300
            ],
            borderColor: '#F8FAFC', // slate-50
            borderWidth: 4,
            hoverOffset: 12
        }]
    };

    const config = {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                animateScale: true,
                animateRotate: true
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: {
                            family: "'Inter', sans-serif",
                            size: 12
                        },
                        color: '#475569', // slate-600
                        boxWidth: 12,
                        padding: 20
                    }
                },
                tooltip: {
                    enabled: true,
                     titleFont: {
                        family: "'Inter', sans-serif"
                    },
                    bodyFont: {
                        family: "'Inter', sans-serif"
                    },
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed !== null) {
                                label += context.parsed + '%';
                            }
                            return label;
                        }
                    }
                }
            },
            cutout: '60%',
        }
    };

    ctx.chart = new Chart(ctx, config);
}
