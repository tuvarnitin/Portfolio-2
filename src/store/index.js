import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './themeSlice';
import terminalReducer from './terminalSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    terminal: terminalReducer,
  },
});
