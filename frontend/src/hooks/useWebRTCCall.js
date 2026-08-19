import { useState, useEffect, useRef, useCallback } from 'react';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ],
};

export const useWebRTCCall = ({ socket, activeChatId, user }) => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [participants, setParticipants] = useState({}); // socketId -> { stream, user, isMuted, isVideoOff, isScreenSharing }
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [error, setError] = useState(null);
  const [callDuration, setCallDuration] = useState(0);

  const peerConnectionsRef = useRef(new Map()); // socketId -> RTCPeerConnection
  const localStreamRef = useRef(null);
  const cameraTrackRef = useRef(null);
  const screenTrackRef = useRef(null);
  const timerRef = useRef(null);
  const activeChatIdRef = useRef(activeChatId);

  useEffect(() => {
    activeChatIdRef.current = activeChatId;
  }, [activeChatId]);

  // Handle call timer
  useEffect(() => {
    if (isCallActive) {
      setCallDuration(0);
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setCallDuration(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isCallActive]);

  // Clean peer connections and stream
  const cleanupCall = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    peerConnectionsRef.current.forEach((pc) => {
      try {
        pc.close();
      } catch (e) {
        // ignore
      }
    });
    peerConnectionsRef.current.clear();

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    if (screenTrackRef.current) {
      screenTrackRef.current.getTracks().forEach((track) => track.stop());
      screenTrackRef.current = null;
    }

    setLocalStream(null);
    setParticipants({});
    setIsCallActive(false);
    setIsMuted(false);
    setIsVideoOff(false);
    setIsScreenSharing(false);
  }, []);

  const createPeerConnection = useCallback((targetSocketId, participantUser, isInitiator = false) => {
    if (peerConnectionsRef.current.has(targetSocketId)) {
      return peerConnectionsRef.current.get(targetSocketId);
    }

    const pc = new RTCPeerConnection(ICE_SERVERS);
    peerConnectionsRef.current.set(targetSocketId, pc);

    // Add local stream tracks to PC
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current);
      });
    }

    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit('call:signal', {
          to: targetSocketId,
          signal: { type: 'candidate', candidate: event.candidate },
        });
      }
    };

    pc.ontrack = (event) => {
      const [remoteStream] = event.streams;
      if (remoteStream) {
        setParticipants((prev) => ({
          ...prev,
          [targetSocketId]: {
            socketId: targetSocketId,
            user: participantUser || prev[targetSocketId]?.user || { firstName: 'Team Member' },
            stream: remoteStream,
            isMuted: prev[targetSocketId]?.isMuted || false,
            isVideoOff: prev[targetSocketId]?.isVideoOff || false,
            isScreenSharing: prev[targetSocketId]?.isScreenSharing || false,
          },
        }));
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed' || pc.connectionState === 'closed') {
        peerConnectionsRef.current.delete(targetSocketId);
        setParticipants((prev) => {
          const next = { ...prev };
          delete next[targetSocketId];
          return next;
        });
      }
    };

    if (isInitiator) {
      pc.createOffer()
        .then((offer) => pc.setLocalDescription(offer))
        .then(() => {
          socket.emit('call:signal', {
            to: targetSocketId,
            signal: { type: 'offer', sdp: pc.localDescription },
          });
        })
        .catch((err) => console.error('Error creating WebRTC offer:', err));
    }

    return pc;
  }, [socket]);

  // Handle incoming socket signals
  useEffect(() => {
    if (!socket || !isCallActive) return;

    const handleRoomUsers = ({ participants: existingPeers }) => {
      existingPeers.forEach(({ socketId: peerId, user: peerUser }) => {
        createPeerConnection(peerId, peerUser, true);
      });
    };

    const handleUserJoined = ({ socketId: peerId, user: peerUser }) => {
      setParticipants((prev) => ({
        ...prev,
        [peerId]: {
          socketId: peerId,
          user: peerUser,
          stream: null,
          isMuted: false,
          isVideoOff: false,
          isScreenSharing: false,
        },
      }));
      // Wait for peer's offer or initiate if needed
    };

    const handleSignal = async ({ from: peerId, signal, user: peerUser }) => {
      try {
        let pc = peerConnectionsRef.current.get(peerId);
        if (!pc) {
          pc = createPeerConnection(peerId, peerUser, false);
        }

        if (signal.type === 'offer') {
          await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit('call:signal', {
            to: peerId,
            signal: { type: 'answer', sdp: pc.localDescription },
          });
        } else if (signal.type === 'answer') {
          if (pc.signalingState !== 'stable') {
            await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
          }
        } else if (signal.type === 'candidate') {
          if (signal.candidate && pc.remoteDescription) {
            await pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
          }
        }
      } catch (err) {
        console.error('Error handling WebRTC signal:', err);
      }
    };

    const handleMediaStateChanged = ({ socketId: peerId, isMuted: peerMuted, isVideoOff: peerVideoOff, isScreenSharing: peerScreenShare }) => {
      setParticipants((prev) => {
        if (!prev[peerId]) return prev;
        return {
          ...prev,
          [peerId]: {
            ...prev[peerId],
            isMuted: peerMuted !== undefined ? peerMuted : prev[peerId].isMuted,
            isVideoOff: peerVideoOff !== undefined ? peerVideoOff : prev[peerId].isVideoOff,
            isScreenSharing: peerScreenShare !== undefined ? peerScreenShare : prev[peerId].isScreenSharing,
          },
        };
      });
    };

    const handleUserLeft = ({ socketId: peerId }) => {
      const pc = peerConnectionsRef.current.get(peerId);
      if (pc) {
        pc.close();
        peerConnectionsRef.current.delete(peerId);
      }
      setParticipants((prev) => {
        const next = { ...prev };
        delete next[peerId];
        return next;
      });
    };

    socket.on('call:room-users', handleRoomUsers);
    socket.on('call:user-joined', handleUserJoined);
    socket.on('call:signal', handleSignal);
    socket.on('call:media-state-changed', handleMediaStateChanged);
    socket.on('call:user-left', handleUserLeft);

    return () => {
      socket.off('call:room-users', handleRoomUsers);
      socket.off('call:user-joined', handleUserJoined);
      socket.off('call:signal', handleSignal);
      socket.off('call:media-state-changed', handleMediaStateChanged);
      socket.off('call:user-left', handleUserLeft);
    };
  }, [socket, isCallActive, createPeerConnection]);

  // Start / Join Call
  const startCall = async () => {
    try {
      setError(null);
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
      } catch (mediaErr) {
        console.warn('Full video+audio media capture failed, trying audio-only fallback:', mediaErr);
        // Fallback to audio-only if camera is blocked or in use by another tab/window
        stream = await navigator.mediaDevices.getUserMedia({
          video: false,
          audio: true,
        });
        setIsVideoOff(true);
      }

      localStreamRef.current = stream;
      cameraTrackRef.current = stream.getVideoTracks()[0] || null;
      setLocalStream(stream);
      setIsCallActive(true);

      if (socket && activeChatIdRef.current) {
        socket.emit('call:join', { chatId: activeChatIdRef.current });
      }
    } catch (err) {
      console.error('Failed to get media devices:', err);
      let msg = 'Could not access camera/microphone. Please check browser permissions.';
      if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        msg = 'No camera or microphone found on your device.';
      } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        msg = 'Camera or microphone permission was denied.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        msg = 'Camera or microphone is currently locked by another app or browser tab.';
      }
      setError(msg);
    }
  };

  // Leave Call
  const leaveCall = () => {
    if (socket && activeChatIdRef.current) {
      socket.emit('call:leave', { chatId: activeChatIdRef.current });
    }
    cleanupCall();
  };

  // Toggle Microphone
  const toggleAudio = () => {
    if (!localStreamRef.current) return;
    const audioTrack = localStreamRef.current.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      const nextMuted = !audioTrack.enabled;
      setIsMuted(nextMuted);

      if (socket && activeChatIdRef.current) {
        socket.emit('call:toggle-media', {
          chatId: activeChatIdRef.current,
          isMuted: nextMuted,
          isVideoOff,
          isScreenSharing,
        });
      }
    }
  };

  // Toggle Camera
  const toggleVideo = () => {
    if (!localStreamRef.current) return;
    const videoTrack = localStreamRef.current.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      const nextVideoOff = !videoTrack.enabled;
      setIsVideoOff(nextVideoOff);

      if (socket && activeChatIdRef.current) {
        socket.emit('call:toggle-media', {
          chatId: activeChatIdRef.current,
          isMuted,
          isVideoOff: nextVideoOff,
          isScreenSharing,
        });
      }
    }
  };

  // Toggle Screen Share
  const toggleScreenShare = async () => {
    if (!localStreamRef.current) return;

    if (isScreenSharing) {
      // Revert to camera track
      if (cameraTrackRef.current) {
        const videoSenderTrack = localStreamRef.current.getVideoTracks()[0];
        if (videoSenderTrack) {
          localStreamRef.current.removeTrack(videoSenderTrack);
          localStreamRef.current.addTrack(cameraTrackRef.current);
        }

        peerConnectionsRef.current.forEach((pc) => {
          const sender = pc.getSenders().find((s) => s.track && s.track.kind === 'video');
          if (sender) {
            sender.replaceTrack(cameraTrackRef.current);
          }
        });
      }
      if (screenTrackRef.current) {
        screenTrackRef.current.stop();
        screenTrackRef.current = null;
      }
      setIsScreenSharing(false);

      if (socket && activeChatIdRef.current) {
        socket.emit('call:toggle-media', {
          chatId: activeChatIdRef.current,
          isMuted,
          isVideoOff,
          isScreenSharing: false,
        });
      }
    } else {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenTrack = screenStream.getVideoTracks()[0];
        screenTrackRef.current = screenTrack;

        const currentVideoTrack = localStreamRef.current.getVideoTracks()[0];
        if (currentVideoTrack) {
          localStreamRef.current.removeTrack(currentVideoTrack);
        }
        localStreamRef.current.addTrack(screenTrack);

        peerConnectionsRef.current.forEach((pc) => {
          const sender = pc.getSenders().find((s) => s.track && s.track.kind === 'video');
          if (sender) {
            sender.replaceTrack(screenTrack);
          }
        });

        setIsScreenSharing(true);

        screenTrack.onended = () => {
          toggleScreenShare(); // auto revert when user stops sharing via browser floating bar
        };

        if (socket && activeChatIdRef.current) {
          socket.emit('call:toggle-media', {
            chatId: activeChatIdRef.current,
            isMuted,
            isVideoOff,
            isScreenSharing: true,
          });
        }
      } catch (err) {
        console.error('Failed to start screen share:', err);
      }
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      cleanupCall();
    };
  }, [cleanupCall]);

  return {
    isCallActive,
    localStream,
    participants,
    isMuted,
    isVideoOff,
    isScreenSharing,
    error,
    callDuration,
    startCall,
    leaveCall,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
  };
};
