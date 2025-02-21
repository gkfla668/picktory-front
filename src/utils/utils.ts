import { deleteCookie } from "cookies-next";

/** accessToken, refreshToken 삭제 */
export const deleteToken = () => {
  deleteCookie("accessToken", { path: "/" });
  deleteCookie("refreshToken", { path: "/" });
};
