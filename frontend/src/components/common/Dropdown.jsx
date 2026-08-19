import { useRef, useState } from 'react';
import { useOutsideClick } from '../../hooks/useOutsideClick';

const Dropdown = ({ trigger, children, align = 'left' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useOutsideClick(ref, () => setIsOpen(false));

  return (
    <div className="relative inline-block" ref={ref}>
      <div onClick={() => setIsOpen((prev) => !prev)}>{trigger}</div>
      {isOpen && (
        <div
          className={`absolute z-40 mt-2 min-w-[180px] rounded-lg border border-gray-100 bg-white py-1 shadow-lg ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
          onClick={() => setIsOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export const DropdownItem = ({ children, onClick, danger = false, icon: Icon }) => (
  <button
    onClick={onClick}
    className={`flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-gray-50 ${
      danger ? 'text-red-600' : 'text-gray-700'
    }`}
  >
    {Icon && <Icon size={16} />}
    {children}
  </button>
);

export default Dropdown;
