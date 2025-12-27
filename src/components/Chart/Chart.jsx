import { useState, useEffect } from 'react';
import { fetchDailyData } from '../../api';
import { Line, Bar } from 'react-chartjs-2';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Tooltip,
    Legend,
    Title,Filler
} from 'chart.js';
 
import { Box, CircularProgress, Typography } from '@mui/material';
import { formatBarLabels, formatDateLabels } from '../../hook/utils';

// ✅ REQUIRED registration (Chart.js v3+)
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Tooltip,
    Legend,
    Title,
    Filler
);

const Charts = ({ data: { confirmed, deaths, recovered }, country, darkMode, loading }) => {
    const [dailyData, setDailyData] = useState([]);

    useEffect(() => {
        const fetchAPI = async () => {
            const data = await fetchDailyData();
            setDailyData(data);
        };

        fetchAPI();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height={400}>
                <CircularProgress />
                <Typography variant="body1" sx={{ ml: 2, color: darkMode ? '#fff' : 'inherit' }}>
                    Loading chart data...
                </Typography>
            </Box>
        );
    }

 
 
    const getCommonOptions = (title = '', isLineChart = false) => ({
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                labels: {
                    color: darkMode ? '#e0e0e0' : '#666',
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                backgroundColor: darkMode ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                titleColor: darkMode ? '#e0e0e0' : '#333',
                bodyColor: darkMode ? '#e0e0e0' : '#333',
                borderColor: darkMode ? '#444' : '#ddd',
                borderWidth: 1,
                callbacks: {
                    title: function (context) {
                        if (isLineChart && context[0]) {
                            const index = context[0].dataIndex;
                            if (dailyData[index]) { 
                                const date = new Date(dailyData[index].date);
                                return date.toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                });
                            }
                        }
                        return context[0].label || '';
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                    drawBorder: false,
                },
                ticks: {
                    color: darkMode ? '#b0b0b0' : '#666',
                    maxTicksLimit: isLineChart ? 12 : 3, 
                    maxRotation: 45,
                    minRotation: 0,
                    padding: 10,
                    callback: function (value, index, values) {
                        if (isLineChart && dailyData[index]) {
                             if (dailyData.length <= 10) {
                                // Show all labels if few data points
                                return formatDateLabels(dailyData[index].date);
                            } else {
                                // Show every nth label with year for clarity
                                const interval = Math.ceil(dailyData.length / 12); 
                                if (index % interval === 0 || index === values.length - 1) {
                                    return formatDateLabels(dailyData[index].date);
                                }
                                return '';
                            }
                        }
                        return this.getLabelForValue(value);
                    }
                }
            },
            y: {
                grid: {
                    color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                    drawBorder: false,
                },
                ticks: {
                    color: darkMode ? '#b0b0b0' : '#666',
                    padding: 10,
                    callback: function (value) {
                        // Format large numbers with K/M/B suffixes
                        if (value >= 1000000000) {
                            return (value / 1000000000).toFixed(1) + 'B';
                        }
                        if (value >= 1000000) {
                            return (value / 1000000).toFixed(1) + 'M';
                        }
                        if (value >= 1000) {
                            return (value / 1000).toFixed(1) + 'K';
                        }
                        return value.toLocaleString(); // Add commas to large numbers
                    }
                }
            }
        }
    });

    const lineChart = dailyData.length ? (
        <Line
            data={{
                labels: dailyData.map(({ date }) => date), 
                datasets: [
                    {
                        data: dailyData.map(({ confirmed }) => confirmed),
                        label: 'Infected',
                        borderColor: '#667eea',
                        backgroundColor: '#667eea4d',
                        fill: true,
                        tension: 0.4,
                        pointBorderColor: '#667eea',
                        pointBackgroundColor: darkMode ? '#1a1a2e' : '#fff',
                        pointRadius: 3,
                        pointHoverRadius: 6,
                    },
                    {
                        data: dailyData.map(({ recovered }) => recovered),
                        label: 'Recovered',
                        borderColor: '#00f2fe',
                        backgroundColor: '#00f2fe4d',
                        fill: true,
                        tension: 0.4,
                        pointBorderColor: '#00f2fe',
                        pointBackgroundColor: darkMode ? '#1a1a2e' : '#fff',
                        pointRadius: 3,
                        pointHoverRadius: 6,
                    },
                    {
                        data: dailyData.map(({ deaths }) => deaths),
                        label: 'Deaths',
                        borderColor: darkMode ? '#ff5252' : 'red',
                        backgroundColor: darkMode ? 'rgba(255, 82, 82, 0.3)' : 'rgba(255,0,0,0.3)',
                        fill: true,
                        tension: 0.4,
                        pointBorderColor: darkMode ? '#ff5252' : 'red',
                        pointBackgroundColor: darkMode ? '#1a1a2e' : '#fff',
                        pointRadius: 3,
                        pointHoverRadius: 6,
                    },
                ],
            }}
            options={{
                ...getCommonOptions('Global COVID-19 Data', true),
                plugins: {
                    ...getCommonOptions('Global COVID-19 Data', true).plugins,
                    title: {
                        display: true,
                        text: 'Global COVID-19 Data',
                        color: darkMode ? '#e0e0e0' : '#333',
                        font: {
                            size: 16,
                            weight: 'bold'
                        },
                        padding: {
                            top: 10,
                            bottom: 30
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index',
                },
                animation: {
                    duration: 1000,
                }
            }}
        />
    ) : null;

    const barChart = confirmed ? (
        <Bar
            data={{
                labels: formatBarLabels(),
                datasets: [
                    {
                        label: 'People',
                        backgroundColor: darkMode ? [
                            'rgba(93, 120, 255, 0.7)',
                            'rgba(76, 175, 80, 0.7)',
                            'rgba(255, 82, 82, 0.7)',
                        ] : [
                            'rgba(0, 0, 255, 0.5)',
                            'rgba(0, 255, 0, 0.5)',
                            'rgba(255, 0, 0, 0.5)',
                        ],
                        borderColor: darkMode ? [
                            'rgba(93, 120, 255, 1)',
                            'rgba(76, 175, 80, 1)',
                            'rgba(255, 82, 82, 1)',
                        ] : [
                            'rgba(0, 0, 255, 1)',
                            'rgba(0, 255, 0, 1)',
                            'rgba(255, 0, 0, 1)',
                        ],
                        borderWidth: 2,
                        borderRadius: 4,
                        data: [confirmed.value, recovered.value, deaths.value],
                    },
                ],
            }}
            options={{
                ...getCommonOptions(`Current state in ${country}`, false),
                plugins: {
                    ...getCommonOptions(`Current state in ${country}`, false).plugins,
                    title: {
                        display: true,
                        text: `COVID-19 Statistics in ${country}`,
                        color: darkMode ? '#e0e0e0' : '#333',
                        font: {
                            size: 16,
                            weight: 'bold'
                        },
                        padding: {
                            top: 10,
                            bottom: 30
                        }
                    },
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                const value = context.raw;
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += value.toLocaleString();
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    ...getCommonOptions().scales,
                    x: {
                        ...getCommonOptions().scales.x,
                        ticks: {
                            color: darkMode ? '#b0b0b0' : '#666',
                            font: {
                                size: 14,
                                weight: 'bold'
                            },
                            padding: 15
                        },
                        grid: {
                            display: false // Remove grid lines for bar chart x-axis
                        }
                    },
                    y: {
                        ...getCommonOptions().scales.y,
                        beginAtZero: true,
                        ticks: {
                            color: darkMode ? '#b0b0b0' : '#666',
                            padding: 10,
                            callback: function (value) {
                                if (value >= 1000000000) {
                                    return (value / 1000000000).toFixed(1) + 'B';
                                }
                                if (value >= 1000000) {
                                    return (value / 1000000).toFixed(1) + 'M';
                                }
                                if (value >= 1000) {
                                    return (value / 1000).toFixed(1) + 'K';
                                }
                                return value.toLocaleString();
                            }
                        }
                    }
                }
            }}
        />
    ) : null;

    return (
        <div 
            style={{
                backgroundColor: darkMode ? 'rgba(26, 26, 46, 0.69)' : 'transparent',
                padding: '20px',
                borderRadius: '12px',
                backdropFilter:  'blur(12px)',
                border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.9), 0.1)',
                height: '600px',  
                position: 'relative',
                display:'flex',
                justifyContent:'center',
                marginTop:'50px',
                minWidth:'70vw'

            }}
        >
            {country ? barChart : lineChart}
            {!country && !lineChart && (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    <Typography variant="body1" sx={{ color: darkMode ? '#fff' : 'inherit' }}>
                        No chart data available
                    </Typography>
                </Box>
            )}
        </div>
    );
};

export default Charts;