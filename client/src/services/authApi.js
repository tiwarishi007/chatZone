import api from "./api";

// LOGIN
export const loginUser = async (data) => {
  // backend-ready
  return api.post("/auth/login", data);
};

// REGISTER
export const registerUser = async (data) => {
  // backend-ready
  return api.post("/auth/register", data);
};
