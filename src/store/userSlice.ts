import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Organisateur" | "Participant";
}

interface UserState {
  users: User[];
}

const initialState: UserState = {
  users: [
    { id: "1", name: "Alice", email: "alice@example.com", role: "Participant" },
    { id: "2", name: "Bob", email: "bob@example.com", role: "Organisateur" },
    { id: "3", name: "Charlie", email: "charlie@example.com", role: "Admin" },
  ],
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    changeRole: (state, action: PayloadAction<{ id: string; role: User["role"] }>) => {
      const user = state.users.find((u) => u.id === action.payload.id);
      if (user) {
        user.role = action.payload.role;
      }
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((user) => user.id !== action.payload);
    },
  },
});

export const { changeRole, deleteUser } = userSlice.actions;
export default userSlice.reducer;
