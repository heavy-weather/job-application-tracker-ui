import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
    reducer: {
        // flashcardSetGroup: flashcardSetGroupReducer,
        // lockInfo: lockInfoReducer,
    },
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch