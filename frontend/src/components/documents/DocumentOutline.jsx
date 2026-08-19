const DocumentOutline = ({ outline = [] }) => {
  return (
    <div className="w-56 flex-shrink-0 border-r border-gray-100 p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Outline</p>
      <nav className="space-y-1">
        {outline.length === 0 && (
          <p className="text-xs text-gray-400">Headings will appear here as you write.</p>
        )}
        {outline.map((item, idx) => (
          <a
            key={idx}
            href={`#${item.anchor}`}
            className={`block truncate rounded px-2 py-1 text-sm hover:bg-gray-50 ${
              item.level === 1 ? 'font-semibold text-gray-800' : 'pl-4 text-gray-500'
            }`}
          >
            {item.heading}
          </a>
        ))}
      </nav>
    </div>
  );
};

export default DocumentOutline;
