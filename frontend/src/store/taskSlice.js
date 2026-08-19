import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { taskService } from '../services/task.service';

export const fetchBoard = createAsyncThunk('task/fetchBoard', async (boardId, thunkAPI) => {
  try {
    const res = await taskService.getBoard(boardId);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to load board.');
  }
});

const initialState = {
  currentBoard: null,
  columns: [], // [{ _id, name, color, tasks: [...] }]
  status: 'idle',
  error: null,
};

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    // Applied when a task:moved socket event arrives from another client
    applyTaskMove: (state, action) => {
      const { taskId, sourceColumnId, destColumnId, destIndex } = action.payload;

      const sourceCol = state.columns.find((c) => c._id === sourceColumnId);
      const destCol = state.columns.find((c) => c._id === destColumnId);
      if (!sourceCol || !destCol) return;

      const taskIdx = sourceCol.tasks.findIndex((t) => t._id === taskId);
      if (taskIdx === -1) return;

      const [task] = sourceCol.tasks.splice(taskIdx, 1);
      destCol.tasks.splice(destIndex, 0, task);
    },
    // Optimistic local move before server confirms (used by drag-and-drop UI)
    moveTaskLocally: (state, action) => {
      const { taskId, sourceColumnId, destColumnId, destIndex } = action.payload;
      const sourceCol = state.columns.find((c) => c._id === sourceColumnId);
      const destCol = state.columns.find((c) => c._id === destColumnId);
      if (!sourceCol || !destCol) return;

      const taskIdx = sourceCol.tasks.findIndex((t) => t._id === taskId);
      if (taskIdx === -1) return;

      const [task] = sourceCol.tasks.splice(taskIdx, 1);
      destCol.tasks.splice(destIndex, 0, task);
    },
    addTaskToColumn: (state, action) => {
      const { columnId, task } = action.payload;
      const col = state.columns.find((c) => c._id === columnId);
      if (col) col.tasks.push(task);
    },
    updateTaskInPlace: (state, action) => {
      const updatedTask = action.payload;
      for (const col of state.columns) {
        const idx = col.tasks.findIndex((t) => t._id === updatedTask._id);
        if (idx !== -1) {
          col.tasks[idx] = { ...col.tasks[idx], ...updatedTask };
          break;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoard.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBoard.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentBoard = action.payload.board;
        state.columns = action.payload.columns;
      })
      .addCase(fetchBoard.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { applyTaskMove, moveTaskLocally, addTaskToColumn, updateTaskInPlace } = taskSlice.actions;
export default taskSlice.reducer;
