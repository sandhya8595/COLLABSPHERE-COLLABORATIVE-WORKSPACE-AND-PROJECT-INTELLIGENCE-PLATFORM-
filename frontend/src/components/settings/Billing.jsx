const Billing = () => {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6">
      <h3 className="mb-5 text-lg font-semibold text-gray-900">Billing</h3>
      <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-4">
        <div>
          <p className="font-semibold text-gray-900">Free Plan</p>
          <p className="text-sm text-gray-500">Up to 10 members, 5GB storage per workspace.</p>
        </div>
        <button className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700">
          Upgrade Plan
        </button>
      </div>
    </div>
  );
};

export default Billing;
