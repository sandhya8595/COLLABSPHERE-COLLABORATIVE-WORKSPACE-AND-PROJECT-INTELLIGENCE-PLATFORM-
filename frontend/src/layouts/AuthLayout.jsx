import { Boxes } from 'lucide-react';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Left panel - branding */}
      <div className="hidden flex-col justify-between bg-gradient-to-br from-primary-50 to-indigo-50 p-12 lg:flex">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white">
            <Boxes size={20} />
          </div>
          <span className="text-xl font-bold text-gray-900">CollabSphere</span>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md rounded-2xl bg-white/60 p-8 shadow-xl backdrop-blur">
            <div className="mb-4 h-40 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-500 opacity-90" />
            <p className="text-sm text-gray-600">
              Real-time collaboration, project intelligence, and enterprise-grade security — all
              in one workspace.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-gray-900">Enterprise Collaboration, Simplified.</h2>
          <p className="mt-2 max-w-md text-gray-600">
            Connect your teams, align your goals, and ship faster with our unified workspace
            platform designed for modern workflows.
          </p>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex flex-col items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-gray-500">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
