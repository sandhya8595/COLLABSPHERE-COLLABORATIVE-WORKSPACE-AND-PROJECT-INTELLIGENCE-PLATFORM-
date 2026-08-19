const Loader = ({ fullScreen = false, size = 'md' }) => {
  const sizeClasses = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' };

  const spinner = (
    <div
      className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-200 border-t-primary-600`}
    />
  );

  if (fullScreen) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        {spinner}
      </div>
    );
  }

  return <div className="flex items-center justify-center p-4">{spinner}</div>;
};

export default Loader;
