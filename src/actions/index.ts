import { loginUser, logout, registerUser } from "./auth";
import { getProductsByPage } from "./products";

export const server = {
  // actions

  // Auth
  loginUser,
  logout,
  registerUser,

  // Productos
  getProductsByPage,
};
