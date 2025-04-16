import { Modal, Typography, Paper } from "@mui/material";

export const Alert = ({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) => {
  return (
    <Modal open={true} onClose={onClose}>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Paper
          elevation={3}
          style={{
            padding: "20px",
            textAlign: "center",
            border: "none",
            borderRadius: "4px",
            backgroundColor: document.body.classList.contains('dark') ? "#1e1e1e" : "#fff", // Cambia según modo
            color: document.body.classList.contains('dark') ? "#fff" : "#000", // Cambia según modo
          }}
        >
          <Typography variant="body1">{message}</Typography>
          <button
            onClick={onClose}
            style={{
              marginTop: "20px",
              padding: "8px 20px",
              border: "none",
              borderRadius: "4px",
              background: "#007bff",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </Paper>
      </div>
    </Modal>
  );
};