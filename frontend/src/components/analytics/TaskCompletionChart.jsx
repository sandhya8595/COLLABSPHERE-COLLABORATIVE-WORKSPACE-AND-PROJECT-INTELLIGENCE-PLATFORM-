import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const TaskCompletionChart = ({ trend = [] }) => {
  const data = trend.map((t) => ({
    date: new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    completed: t.count,
  }));

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5">
      <h3 className="mb-4 text-base font-semibold text-gray-900">Task Completion Over Time</h3>
      {data.length === 0 ? (
        <p className="py-16 text-center text-sm text-gray-400">No task activity in this period.</p>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip cursor={{ fill: '#f8fafc' }} />
            <Bar dataKey="completed" fill="#2563eb" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default TaskCompletionChart;
