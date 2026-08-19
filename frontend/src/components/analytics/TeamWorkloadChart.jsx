import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const TeamWorkloadChart = ({ workload = [] }) => {
  const data = workload.map((w) => ({ name: w.name.split(' ')[0], tasks: w.taskCount }));

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5">
      <h3 className="mb-4 text-base font-semibold text-gray-900">Team Workload</h3>
      {data.length === 0 ? (
        <p className="py-16 text-center text-sm text-gray-400">No assigned tasks yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
            <XAxis type="number" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 12, fill: '#475569' }}
              axisLine={false}
              tickLine={false}
              width={70}
            />
            <Tooltip cursor={{ fill: '#f8fafc' }} />
            <Bar dataKey="tasks" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={16} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default TeamWorkloadChart;
