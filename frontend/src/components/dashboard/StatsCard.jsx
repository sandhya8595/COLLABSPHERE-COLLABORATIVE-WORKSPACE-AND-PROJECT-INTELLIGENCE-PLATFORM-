const StatsCard = ({ icon: Icon, label, value, delta, deltaPositive = true, accent = false }) => {
  return (
    <div
      className={`rounded-xl border p-5 ${
        accent
          ? 'border-primary-600 bg-primary-600 text-white'
          : 'border-gray-100 bg-white text-gray-900'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className={`text-sm font-medium ${accent ? 'text-primary-100' : 'text-gray-500'}`}>
          {label}
        </span>
        {Icon && (
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg ${
              accent ? 'bg-white/20' : 'bg-gray-50'
            }`}
          >
            <Icon size={16} className={accent ? 'text-white' : 'text-gray-500'} />
          </div>
        )}
      </div>
      <div className="mt-2 flex items-end gap-2">
        <span className="text-3xl font-bold">{value}</span>
      </div>
      {delta && (
        <p className={`mt-1 text-xs font-medium ${
          accent ? 'text-primary-100' : deltaPositive ? 'text-emerald-600' : 'text-red-500'
        }`}>
          {delta}
        </p>
      )}
    </div>
  );
};

export default StatsCard;
