import React from "react";
import { Fab, Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

interface ViewButtonProps {
  onClick: () => void;
  tooltipTitle?: string;
}

export const ViewButton: React.FC<ViewButtonProps> = ({ 
  onClick, 
  tooltipTitle = "Ver Detalles" 
}) => {
  return (
    <Tooltip title={tooltipTitle}>
      <Fab
        size="small"
        color="info"
        aria-label="view"
        onClick={onClick}
      >
        <VisibilityIcon />
      </Fab>
    </Tooltip>
  );
};