import { Hash, Lock } from 'lucide-react';
import Avatar from '../common/Avatar';

const ChatSidebar = ({ chats = [], activeChatId, onSelectChat, currentUserId }) => {
  const channels = chats.filter((c) => c.type === 'channel' || c.type === 'group');
  const directMessages = chats.filter((c) => c.type === 'direct');

  const getDmPartner = (chat) => chat.members?.find((m) => m._id !== currentUserId);

  return (
    <div className="flex w-64 flex-shrink-0 flex-col border-r border-gray-100 bg-white">
      <div className="border-b border-gray-100 p-4">
        <p className="text-sm font-semibold text-gray-900">Collab Team</p>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <p className="mb-1.5 px-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Channels
        </p>
        <div className="space-y-0.5">
          {channels.map((chat) => (
            <button
              key={chat._id}
              onClick={() => onSelectChat(chat)}
              className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm ${
                activeChatId === chat._id
                  ? 'bg-primary-50 font-semibold text-primary-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {chat.isPrivate ? <Lock size={14} /> : <Hash size={14} />}
              <span className="truncate">{chat.name}</span>
            </button>
          ))}
        </div>

        <p className="mb-1.5 mt-5 px-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Direct Messages
        </p>
        <div className="space-y-0.5">
          {directMessages.map((chat) => {
            const partner = getDmPartner(chat);
            return (
              <button
                key={chat._id}
                onClick={() => onSelectChat(chat)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm ${
                  activeChatId === chat._id
                    ? 'bg-primary-50 font-semibold text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Avatar user={partner} size="xs" showStatus />
                <span className="truncate">
                  {partner ? `${partner.firstName} ${partner.lastName || ''}` : 'Direct Message'}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
