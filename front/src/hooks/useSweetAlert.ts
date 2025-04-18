import { useTheme } from "@mui/material";
import { themedSwal } from "../utils/sweetAlertUtils";

export const useSweetAlert = () => {
  const theme = useTheme();
  return themedSwal(theme.palette.mode);
};