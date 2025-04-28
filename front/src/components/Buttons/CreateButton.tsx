import React from "react";
import { Fab, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface CreateButtonProps {
  onClick: () => void;
  tooltipTitle?: string;
}

export const CreateButton: React.FC<CreateButtonProps> = ({ 
  onClick, 
  tooltipTitle = "Crear" 
}) => {
  return (
    <Tooltip title={tooltipTitle}>
      <Fab
        color="success"
        onClick={onClick}
        size="small"
        sx={{ display: "flex", gap: 1 }}
      >
        <AddIcon />
      </Fab>
    </Tooltip>
  );
};