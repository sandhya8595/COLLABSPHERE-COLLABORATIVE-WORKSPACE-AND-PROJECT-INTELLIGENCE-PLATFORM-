import { useState } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  PhoneOff,
  Maximize2,
  Minimize2,
  Users,
  X,
  Copy,
  UserPlus,
  Check,
} from 'lucide-react';
import toast from 'react-hot-toast';
import VideoTile from './VideoTile';

const VideoCallModal = ({
  chatName = 'Team Meeting',
  localStream,
  participants = {},
  user,
  isMuted,
  isVideoOff,
  isScreenSharing,
  callDuration = 0,
  onToggleAudio,
  onToggleVideo,
  onToggleScreenShare,
  onLeaveCall,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showParticipantsList, setShowParticipantsList] = useState(false);
  const [pinnedId, setPinnedId] = useState(null);
  const [copied, setCopied] = useState(false);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const hrs = Math.floor(mins / 60);
    if (hrs > 0) {
      return `${hrs}:${(mins % 60).toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopyLink = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('joinCall', 'true');
    navigator.clipboard.writeText(url.toString());
    setCopied(true);
    toast.success('Meeting invite link copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };

  const participantList = Object.values(participants);
  const totalCount = participantList.length + 1; // including self

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Grid column calculation based on total participants
  const getGridClasses = () => {
    if (pinnedId) return 'grid-cols-1 md:grid-cols-3';
    if (totalCount === 1) return 'grid-cols-1 max-w-4xl mx-auto';
    if (totalCount === 2) return 'grid-cols-1 md:grid-cols-2';
    if (totalCount <= 4) return 'grid-cols-1 sm:grid-cols-2';
    if (totalCount <= 6) return 'grid-cols-2 md:grid-cols-3';
    return 'grid-cols-2 md:grid-cols-4';
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-gray-900/95 p-3 text-white shadow-2xl backdrop-blur-lg border border-gray-700/60 transition-all hover:scale-105">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/80 font-bold text-sm">
          {totalCount}
        </div>
        <div>
          <h4 className="font-semibold text-sm">{chatName}</h4>
          <p className="text-xs text-indigo-400 font-mono">{formatDuration(callDuration)}</p>
        </div>
        <div className="flex items-center gap-1.5 ml-2 border-l border-gray-700 pl-3">
          <button
            onClick={onToggleAudio}
            className={`rounded-lg p-2 transition-colors ${
              isMuted ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-200 hover:bg-gray-700'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
          </button>
          <button
            onClick={() => setIsMinimized(false)}
            className="rounded-lg bg-indigo-600 p-2 text-white hover:bg-indigo-700 transition-colors"
            title="Expand Video Call"
          >
            <Maximize2 size={16} />
          </button>
          <button
            onClick={onLeaveCall}
            className="rounded-lg bg-red-600 p-2 text-white hover:bg-red-700 transition-colors"
            title="Leave Call"
          >
            <PhoneOff size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-950/95 backdrop-blur-xl text-white">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between border-b border-gray-800/80 px-6 py-4 bg-gray-900/40">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
          <h2 className="font-semibold text-lg text-gray-100">{chatName}</h2>
          <span className="rounded-full bg-gray-800 px-3 py-1 text-xs text-indigo-400 font-mono border border-gray-700/50">
            {formatDuration(callDuration)}
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-indigo-950/60 border border-indigo-700/40 px-3 py-1 text-xs text-indigo-300 font-medium">
            <Users size={14} />
            <span>{totalCount} participants</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600/90 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-600 active:scale-95 transition-all shadow-md"
            title="Copy call link to share with team members"
          >
            {copied ? <Check size={16} className="text-emerald-400" /> : <UserPlus size={16} />}
            <span>{copied ? 'Link Copied!' : 'Invite / Copy Link'}</span>
          </button>
          <button
            onClick={() => setShowParticipantsList(!showParticipantsList)}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
              showParticipantsList ? 'bg-indigo-600 text-white' : 'bg-gray-800/80 text-gray-300 hover:bg-gray-800'
            }`}
          >
            <Users size={16} />
            <span>People ({totalCount})</span>
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            className="rounded-xl bg-gray-800/80 p-2.5 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            title="Minimize call window"
          >
            <Minimize2 size={18} />
          </button>
          <button
            onClick={toggleFullscreen}
            className="rounded-xl bg-gray-800/80 p-2.5 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            <Maximize2 size={18} />
          </button>
        </div>
      </div>

      {/* Main Video Call Content Body */}
      <div className="relative flex flex-1 overflow-hidden p-6 gap-6">
        {/* Video Grid */}
        <div className="flex-1 overflow-y-auto">
          <div className={`grid gap-4 h-full auto-rows-fr ${getGridClasses()}`}>
            {/* Local Video Tile */}
            <VideoTile
              stream={localStream}
              user={user}
              isLocal={true}
              isMuted={isMuted}
              isVideoOff={isVideoOff}
              isScreenSharing={isScreenSharing}
              isPinned={pinnedId === 'local'}
              onPin={() => setPinnedId(pinnedId === 'local' ? null : 'local')}
            />

            {/* Remote Participants Video Tiles */}
            {participantList.map((peer) => (
              <VideoTile
                key={peer.socketId}
                stream={peer.stream}
                user={peer.user}
                isLocal={false}
                isMuted={peer.isMuted}
                isVideoOff={peer.isVideoOff}
                isScreenSharing={peer.isScreenSharing}
                isPinned={pinnedId === peer.socketId}
                onPin={() => setPinnedId(pinnedId === peer.socketId ? null : peer.socketId)}
              />
            ))}
          </div>
        </div>

        {/* Side Drawer: Participant List */}
        {showParticipantsList && (
          <div className="w-80 rounded-2xl bg-gray-900/90 border border-gray-800 p-5 flex flex-col backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4">
              <h3 className="font-semibold text-gray-200">Call Participants ({totalCount})</h3>
              <button
                onClick={() => setShowParticipantsList(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-800 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto pr-1">
              {/* Copy Invite Link Card */}
              <div className="rounded-xl bg-indigo-950/60 p-3 border border-indigo-800/50 mb-3">
                <p className="text-xs text-indigo-200 mb-2">Want to invite more team members?</p>
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors shadow-sm"
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copied ? 'Link Copied!' : 'Copy Meeting Link'}</span>
                </button>
              </div>

              {/* Local User */}
              <div className="flex items-center justify-between rounded-xl bg-gray-800/50 p-3 border border-gray-700/40">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 font-bold text-xs">
                    {user?.firstName ? user.firstName[0].toUpperCase() : 'Y'}
                  </div>
                  <div>
                    <p className="font-medium text-xs text-gray-200">
                      {user?.firstName} {user?.lastName} (You)
                    </p>
                    <p className="text-[10px] text-gray-400">Host</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  {isMuted ? <MicOff size={14} className="text-red-400" /> : <Mic size={14} className="text-emerald-400" />}
                  {isVideoOff ? <VideoOff size={14} className="text-red-400" /> : <Video size={14} className="text-emerald-400" />}
                </div>
              </div>

              {/* Remote Users */}
              {participantList.map((peer) => (
                <div
                  key={peer.socketId}
                  className="flex items-center justify-between rounded-xl bg-gray-800/40 p-3 border border-gray-700/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-700 font-bold text-xs text-indigo-300">
                      {peer.user?.firstName ? peer.user.firstName[0].toUpperCase() : 'M'}
                    </div>
                    <div>
                      <p className="font-medium text-xs text-gray-200">
                        {peer.user?.firstName} {peer.user?.lastName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    {peer.isMuted ? <MicOff size={14} className="text-red-400" /> : <Mic size={14} className="text-emerald-400" />}
                    {peer.isVideoOff ? <VideoOff size={14} className="text-red-400" /> : <Video size={14} className="text-emerald-400" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Controls Bar (Google Meet Toolbar Style) */}
      <div className="flex items-center justify-center gap-4 border-t border-gray-800/80 bg-gray-900/60 py-4 backdrop-blur-md">
        {/* Toggle Audio Mute */}
        <button
          onClick={onToggleAudio}
          className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200 shadow-lg ${
            isMuted
              ? 'bg-red-600 text-white hover:bg-red-700 scale-105'
              : 'bg-gray-800 text-gray-200 hover:bg-gray-700 hover:text-white'
          }`}
          title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
        >
          {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
        </button>

        {/* Toggle Camera */}
        <button
          onClick={onToggleVideo}
          className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200 shadow-lg ${
            isVideoOff
              ? 'bg-red-600 text-white hover:bg-red-700 scale-105'
              : 'bg-gray-800 text-gray-200 hover:bg-gray-700 hover:text-white'
          }`}
          title={isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}
        >
          {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
        </button>

        {/* Toggle Screen Sharing */}
        <button
          onClick={onToggleScreenShare}
          className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200 shadow-lg ${
            isScreenSharing
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 scale-105'
              : 'bg-gray-800 text-gray-200 hover:bg-gray-700 hover:text-white'
          }`}
          title={isScreenSharing ? 'Stop Presenting Screen' : 'Present Entire Screen'}
        >
          <Monitor size={20} />
        </button>

        {/* End / Leave Call */}
        <button
          onClick={onLeaveCall}
          className="flex h-12 w-16 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700 transition-all duration-200 shadow-xl hover:scale-105 ml-4"
          title="Leave Video Call"
        >
          <PhoneOff size={22} />
        </button>
      </div>
    </div>
  );
};

export default VideoCallModal;
