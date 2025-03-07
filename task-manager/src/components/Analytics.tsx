import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import type { Task } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface AnalyticsProps {
  tasks: Task[];
}

export default function Analytics({ tasks }: AnalyticsProps) {
  const statusCount = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const priorityCount = tasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusData = {
    labels: ['Pending', 'In Progress', 'Completed'],
    datasets: [
      {
        label: 'Tasks by Status',
        data: [
          statusCount.pending || 0,
          statusCount.in_progress || 0,
          statusCount.completed || 0,
        ],
        backgroundColor: ['#FCD34D', '#60A5FA', '#34D399'],
      },
    ],
  };

  const priorityData = {
    labels: ['Low', 'Medium', 'High'],
    datasets: [
      {
        label: 'Tasks by Priority',
        data: [
          priorityCount.low || 0,
          priorityCount.medium || 0,
          priorityCount.high || 0,
        ],
        backgroundColor: ['#93C5FD', '#FCD34D', '#F87171'],
      },
    ],
  };

  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Task Status Distribution</h3>
        <Pie data={statusData} />
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Task Priority Distribution</h3>
        <Bar
          data={priorityData}
          options={{
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1,
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}