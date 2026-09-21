import { createSlice } from '@reduxjs/toolkit';

const terminalSlice = createSlice({
  name: 'terminal',
  initialState: {
    isOpen: false,
    history: [],
  },
  reducers: {
    openTerminal: (state) => {
      state.isOpen = true;
    },
    closeTerminal: (state) => {
      state.isOpen = false;
    },
    toggleTerminal: (state) => {
      state.isOpen = !state.isOpen;
    },
    addToHistory: (state, action) => {
      state.history.push(action.payload);
    },
    clearHistory: (state) => {
      state.history = [];
    },
  },
});

export const { openTerminal, closeTerminal, toggleTerminal, addToHistory, clearHistory } = terminalSlice.actions;
export default terminalSlice.reducer;
