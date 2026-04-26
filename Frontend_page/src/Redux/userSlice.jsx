import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    id: sessionStorage.getItem("id") || "",
    name: sessionStorage.getItem("name") || "",
    role: sessionStorage.getItem("role") || "",
  },
  reducers: {
    setUser: (state, action) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.role = action.payload.role;

      // ✅ sync to sessionStorage
      sessionStorage.setItem("id", action.payload.id);
      sessionStorage.setItem("name", action.payload.name);
      sessionStorage.setItem("role", action.payload.role);
    },
    clearUser: (state) => {
      state.id = "";
      state.name = "";
      state.role = "";
       // ✅ clear sessionStorage
      sessionStorage.removeItem("id");
      sessionStorage.removeItem("name");
      sessionStorage.removeItem("role");
    }
  }
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;