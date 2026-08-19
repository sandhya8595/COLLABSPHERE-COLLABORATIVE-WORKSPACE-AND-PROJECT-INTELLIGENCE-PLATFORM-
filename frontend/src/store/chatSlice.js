import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { chatService } from '../services/chat.service';

export const fetchChats = createAsyncThunk('chat/fetchChats', async (workspaceId, thunkAPI) => {
  try {
    const res = await chatService.getMine(workspaceId);
    return res.data.chats;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to load chats.');
  }
});

export const fetchMessages = createAsyncThunk('chat/fetchMessages', async (chatId, thunkAPI) => {
  try {
    const res = await chatService.getMessages(chatId);
    return res.data.messages;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to load messages.');
  }
});

const initialState = {
  chats: [],
  activeChatId: null,
  messages: [],
  typingUsers: {}, // userId -> name
  status: 'idle',
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveChat: (state, action) => {
      state.activeChatId = action.payload;
      state.messages = [];
    },
    receiveMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    updateMessageReactions: (state, action) => {
      const { messageId, reactions } = action.payload;
      const msg = state.messages.find((m) => m._id === messageId);
      if (msg) msg.reactions = reactions;
    },
    setTyping: (state, action) => {
      const { userId, name, isTyping } = action.payload;
      if (isTyping) state.typingUsers[userId] = name;
      else delete state.typingUsers[userId];
    },
    removeMessageForMe: (state, action) => {
      state.messages = state.messages.filter((m) => m._id !== action.payload);
    },
    clearAllMessages: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.chats = action.payload;
      })
      .addCase(fetchMessages.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.messages = action.payload;
      });
  },
});

export const {
  setActiveChat,
  receiveMessage,
  updateMessageReactions,
  setTyping,
  removeMessageForMe,
  clearAllMessages,
} = chatSlice.actions;
export default chatSlice.reducer;
