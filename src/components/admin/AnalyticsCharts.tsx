import React, { useMemo } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface AnalyticsChartsProps {
    logs: any[];
}

const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ logs }) => {
    const dailyStats = useMemo(() => {
        const stats: Record<string, number> = {};
        // Last 7 days
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            stats[dateStr] = 0;
        }

        logs.forEach(log => {
            const dateStr = new Date(log.created_at).toISOString().split('T')[0];
            if (stats[dateStr] !== undefined) {
                stats[dateStr]++;
            }
        });

        return stats;
    }, [logs]);

    const countryStats = useMemo(() => {
        const stats: Record<string, number> = {};
        logs.forEach(log => {
            const country = log.country || 'Unknown';
            stats[country] = (stats[country] || 0) + 1;
        });
        return Object.entries(stats)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
    }, [logs]);

    const lineData = {
        labels: Object.keys(dailyStats).map(date => {
            const d = new Date(date);
            return d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' });
        }),
        datasets: [
            {
                label: 'Visitor Traffic',
                data: Object.values(dailyStats),
                fill: true,
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                tension: 0.4,
                pointBackgroundColor: '#2563eb',
                pointBorderColor: '#fff',
                pointHoverRadius: 6,
                pointRadius: 4,
            },
        ],
    };

    const barData = {
        labels: countryStats.map(s => s[0]),
        datasets: [
            {
                label: 'Top Countries',
                data: countryStats.map(s => s[1]),
                backgroundColor: [
                    '#2563eb',
                    '#3b82f6',
                    '#60a5fa',
                    '#93c5fd',
                    '#bfdbfe',
                ],
                borderRadius: 12,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: '#1e293b',
                titleFont: { size: 12, weight: 'bold' as const },
                bodyFont: { size: 12 },
                padding: 12,
                cornerRadius: 12,
                displayColors: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: '#f1f5f9',
                },
                border: {
                    dash: [4, 4],
                },
                ticks: {
                    font: { size: 10, weight: 'bold' as const },
                    color: '#64748b',
                }
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    font: { size: 10, weight: 'bold' as const },
                    color: '#64748b',
                }
            },
        },
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">Traffic Growth</h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">7-Day Engagement Scan</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl">
                        <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                        <span className="text-[10px] font-black uppercase tracking-widest leading-none">Real-time</span>
                    </div>
                </div>
                <div className="h-[300px] w-full">
                    <Line data={lineData} options={options} />
                </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
                <div>
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">Geo Distribution</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Top Visual Outreach</p>
                </div>
                <div className="h-[300px] w-full">
                    <Bar data={barData} options={options} />
                </div>
            </div>
        </div>
    );
};

export default AnalyticsCharts;
