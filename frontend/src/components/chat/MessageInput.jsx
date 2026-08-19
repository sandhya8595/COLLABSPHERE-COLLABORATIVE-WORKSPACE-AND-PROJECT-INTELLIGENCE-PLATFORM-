import { useRef, useState } from 'react';
import { Bold, Italic, List, Code, Smile, Send, FileText, X } from 'lucide-react';
import ShareDocumentModal from './ShareDocumentModal';

const EMOJI_LIST = [
  '😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂',
  '🙃', '😉', '😌', '😍', '🥰', '😘', '😋', '😛', '😜', '🤪',
  '🥳', '😎', '🤩', '👍', '👎', '👏', '🙌', '🙏', '💪', '🔥',
  '✨', '🚀', '🎉', '❤️', '💡', '💯', '⭐', '✅', '💬', '📌'
];

const MessageInput = ({ onSend, onTyping, workspaceId, placeholder = 'Message...' }) => {
  const [value, setValue] = useState('');
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const typingTimeoutRef = useRef(null);

  const handleChange = (e) => {
    setValue(e.target.value);

    onTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => onTyping(false), 2000);
  };

  const handleAddEmoji = (emoji) => {
    setValue((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleSend = () => {
    if (!value.trim() && !selectedDoc) return;
    onSend(value.trim(), null, selectedDoc?._id || null);
    setValue('');
    setSelectedDoc(null);
    setShowEmojiPicker(false);
    onTyping(false);
  };

  return (
    <div className="border-t border-gray-100 p-4 relative">
      <div className="rounded-lg border border-gray-200 bg-gray-50 focus-within:border-primary-500 focus-within:bg-white">
        <div className="flex items-center gap-1 border-b border-gray-200 px-3 py-1.5">
          <button className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <Bold size={14} />
          </button>
          <button className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <Italic size={14} />
          </button>
          <button className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <List size={14} />
          </button>
          <button className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <Code size={14} />
          </button>
        </div>

        {/* Selected Document Badge */}
        {selectedDoc && (
          <div className="mx-3 mt-2.5 flex items-center justify-between rounded-lg border border-primary-200 bg-primary-50 p-2 text-xs text-primary-900">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-primary-600" />
              <div>
                <span className="font-semibold">{selectedDoc.title}</span>
                <span className="ml-1 text-primary-600">({selectedDoc.category || 'Document'})</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedDoc(null)}
              className="rounded p-0.5 text-primary-500 hover:bg-primary-100"
            >
              <X size={14} />
            </button>
          </div>
        )}

        <textarea
          value={value}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder={placeholder}
          rows={3}
          className="w-full resize-none bg-transparent px-3 py-2 text-sm outline-none"
        />

        <div className="flex items-center justify-between px-3 py-2 relative">
          <div className="flex gap-1 items-center">
            <button
              onClick={() => setIsDocModalOpen(true)}
              title="Share Document"
              className="flex items-center gap-1 rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-primary-600"
            >
              <FileText size={16} />
              <span className="text-xs font-medium">Doc</span>
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                title="Add Emoji"
                className={`rounded p-1.5 ${
                  showEmojiPicker ? 'bg-primary-50 text-primary-600' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                }`}
              >
                <Smile size={16} />
              </button>

              {/* Emoji Picker Popover */}
              {showEmojiPicker && (
                <div className="absolute bottom-10 left-0 z-20 grid grid-cols-8 gap-1 rounded-xl border border-gray-200 bg-white p-2.5 shadow-xl w-64">
                  {EMOJI_LIST.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => handleAddEmoji(emoji)}
                      className="flex h-7 w-7 items-center justify-center rounded text-base hover:bg-gray-100 transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleSend}
            disabled={!value.trim() && !selectedDoc}
            className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-40"
          >
            <Send size={14} />
            Send
          </button>
        </div>
      </div>

      <ShareDocumentModal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
        workspaceId={workspaceId}
        onSelectDocument={setSelectedDoc}
      />
    </div>
  );
};

export default MessageInput;
