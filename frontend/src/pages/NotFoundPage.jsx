import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-50 text-center">
      <h1 className="text-7xl font-bold text-primary-600">404</h1>
      <p className="mt-3 text-lg text-gray-600">Page not found.</p>
      <Link
        to="/"
        className="mt-6 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
      >
        Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFoundPage;
