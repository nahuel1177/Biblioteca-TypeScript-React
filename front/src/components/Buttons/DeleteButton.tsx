import React from "react";
import { Fab, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface DeleteButtonProps {
  onClick: () => void;
  tooltipTitle?: string;
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({ 
  onClick, 
  tooltipTitle = "Eliminar" 
}) => {
  return (
    <Tooltip title={tooltipTitle}>
      <Fab
        size="small"
        color="error"
        aria-label="delete"
        onClick={onClick}
      >
        <DeleteIcon />
      </Fab>
    </Tooltip>
  );
};