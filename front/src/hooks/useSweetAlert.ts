import Swal from "sweetalert2";
import { useTheme } from "@mui/material/styles";
import { useEffect } from "react";

export const useSweetAlert = () => {
  const theme = useTheme();
  
  // Configurar SweetAlert2 para usar el tema de la aplicación
  useEffect(() => {
    // Configurar el tema de SweetAlert2 basado en el tema actual de la aplicación
    Swal.getContainer()?.setAttribute('data-theme', theme.palette.mode);
    
    // Configurar colores globales para SweetAlert2
    Swal.mixin({
      background: theme.palette.background.paper,
      color: theme.palette.text.primary,
      confirmButtonColor: theme.palette.primary.main,
      cancelButtonColor: theme.palette.error.main,
    });
  }, [theme.palette.mode]);
  
  // Función para mostrar alertas con el tema actual
  const fire = (options: unknown) => {
    return Swal.fire({
      ...(options as object),
      background: theme.palette.background.paper,
      color: theme.palette.text.primary,
    });
  };
  
  // Función para mostrar alertas de éxito
  const success = (message: string) => {
    return fire({
      icon: "success",
      title: "¡Éxito!",
      text: message,
      confirmButtonColor: theme.palette.success.main,
    });
  };
  
  // Función para mostrar alertas de error
  const error = (message: string) => {
    return fire({
      icon: "error",
      title: "Error",
      text: message,
      confirmButtonColor: theme.palette.error.main,
    });
  };
  
  // Función para mostrar confirmaciones
  const confirm = (message: string) => {
    return fire({
      title: "Confirmación",
      text: message,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: theme.palette.primary.main,
      cancelButtonColor: theme.palette.error.main,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    });
  };
  
  // Función para mostrar toasts
  const toast = (message: string, icon: 'success' | 'error' | 'warning' | 'info' | 'question' = 'info') => {
    return fire({
      toast: true,
      position: "top-end",
      icon,
      text: message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  };
  
  return {
    fire,
    success,
    error,
    confirm,
    toast,
    // Mantener acceso al Swal original para casos especiales
    Swal
  };
};