import React from "react";
import { Fab, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";

interface SanctionButtonProps {
  isSanctioned: boolean;
  onSanction: () => void;
  onRemoveSanction: () => void;
}

export const SanctionButton: React.FC<SanctionButtonProps> = ({ 
  isSanctioned, 
  onSanction, 
  onRemoveSanction 
}) => {
  if (isSanctioned) {
    return (
      <Tooltip title="Quitar Sanción">
        <Fab
          size="small"
          color="success"
          aria-label="remove-sanction"
          onClick={onRemoveSanction}
        >
          <CheckIcon />
        </Fab>
      </Tooltip>
    );
  } else {
    return (
      <Tooltip title="Sancionar">
        <Fab
          size="small"
          color="default"
          aria-label="sanction"
          onClick={onSanction}
        >
          <CloseIcon />
        </Fab>
      </Tooltip>
    );
  }
};