import React from "react";
import { Fab, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

interface EditButtonProps {
  onClick: () => void;
  tooltipTitle?: string;
}

export const EditButton: React.FC<EditButtonProps> = ({ 
  onClick, 
  tooltipTitle = "Editar" 
}) => {
  return (
    <Tooltip title={tooltipTitle}>
      <Fab
        size="small"
        color="primary"
        aria-label="edit"
        onClick={onClick}
      >
        <EditIcon />
      </Fab>
    </Tooltip>
  );
};