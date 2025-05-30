import Swal from "sweetalert2";
import { PaletteMode } from "@mui/material";

export const themedSwal = (mode: PaletteMode) => {
  return {
    fire: (options: any) => {
      return Swal.fire({
        ...options,
        background: mode === 'dark' ? '#333' : '#fff',
        color: mode === 'dark' ? '#fff' : '#545454',
      });
    },
    success: (message: string, timer = 2000) => {
      return Swal.fire({
        position: "center",
        icon: "success",
        text: message,
        showConfirmButton: false,
        timer,
        background: mode === 'dark' ? '#333' : '#fff',
        color: mode === 'dark' ? '#fff' : '#545454',
      });
    },
    error: (message: string, timer = 2000) => {
      return Swal.fire({
        position: "center",
        icon: "error",
        text: message,
        showConfirmButton: true,
        confirmButtonColor: "#f44336",
        background: mode === 'dark' ? '#333' : '#fff',
        color: mode === 'dark' ? '#fff' : '#545454',
      });
    },
    confirm: (message: string) => {
      return Swal.fire({
        text: message,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar",
        background: mode === 'dark' ? '#333' : '#fff',
        color: mode === 'dark' ? '#fff' : '#545454',
      });
    },
  };
};

export const useSweetAlert = (mode: PaletteMode) => {
  return themedSwal(mode);
};