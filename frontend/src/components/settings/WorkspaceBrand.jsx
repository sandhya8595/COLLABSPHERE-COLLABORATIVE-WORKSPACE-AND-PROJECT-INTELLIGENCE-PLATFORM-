import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { workspaceService } from '../../services/workspace.service';
import { Boxes } from 'lucide-react';
import toast from 'react-hot-toast';

const WorkspaceBrand = () => {
  const { workspaceId } = useParams();
  const { activeWorkspace } = useSelector((state) => state.workspace);
  const [name, setName] = useState(activeWorkspace?.name || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await workspaceService.update(workspaceId, { name });
      toast.success('Workspace updated.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update workspace.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-primary-200 bg-white p-6">
      <h3 className="mb-5 text-lg font-semibold text-gray-900">Workspace Brand</h3>

      <div className="mb-5 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary-600 text-white">
          <Boxes size={28} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Workspace Logo</p>
          <p className="text-xs text-gray-400">Recommended: 256×256px transparent PNG.</p>
          <button className="mt-1.5 rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50">
            Replace
          </button>
        </div>
      </div>

      <label className="mb-1 block text-sm font-medium text-gray-700">Workspace Name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-500"
      />

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-4 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
};

export default WorkspaceBrand;
