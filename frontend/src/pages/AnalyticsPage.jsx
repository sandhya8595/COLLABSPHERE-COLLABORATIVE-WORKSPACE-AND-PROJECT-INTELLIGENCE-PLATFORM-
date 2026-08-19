import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import AnalyticsCards from '../components/analytics/AnalyticsCards';
import TaskCompletionChart from '../components/analytics/TaskCompletionChart';
import TeamWorkloadChart from '../components/analytics/TeamWorkloadChart';
import TopContributors from '../components/analytics/TopContributors';
import Loader from '../components/common/Loader';

const RANGE_OPTIONS = [
  { key: '7days', label: 'Last 7 Days' },
  { key: '30days', label: '30 Days' },
  { key: 'year', label: 'Year' },
];

const AnalyticsPage = () => {
  const { workspaceId } = useParams();
  const [range, setRange] = useState('7days');
  const [overview, setOverview] = useState(null);
  const [trend, setTrend] = useState([]);
  const [workload, setWorkload] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!workspaceId) return;
    setLoading(true);

    Promise.all([
      api.get(`/analytics/${workspaceId}/overview?range=${range}`),
      api.get(`/analytics/${workspaceId}/task-completion?range=${range}`),
      api.get(`/analytics/${workspaceId}/team-workload`),
    ])
      .then(([overviewRes, trendRes, workloadRes]) => {
        setOverview(overviewRes.data.data);
        setTrend(trendRes.data.data.trend);
        setWorkload(workloadRes.data.data.workload);
      })
      .finally(() => setLoading(false));
  }, [workspaceId, range]);

  if (loading && !overview) return <Loader />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Overview</h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor your workspace performance and team productivity.
          </p>
        </div>
        <div className="flex rounded-lg border border-gray-200 bg-white p-1">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setRange(opt.key)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                range === opt.key ? 'bg-primary-600 text-white' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <AnalyticsCards overview={overview} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <TaskCompletionChart trend={trend} />
          <TeamWorkloadChart workload={workload} />
        </div>

        <TopContributors
          contributors={workload.map((w) => ({ ...w, role: 'Team Member' }))}
        />
      </div>
    </div>
  );
};

export default AnalyticsPage;
