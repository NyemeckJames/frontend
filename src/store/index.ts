import { configureStore } from "@reduxjs/toolkit";
import eventReducer from "../store/eventSlice";
import userReducer from "./userSlice";

export const store = configureStore({
  reducer: {
    events: eventReducer,
    users: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
