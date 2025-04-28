/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, FormEvent, useState } from "react";
import { TextField, Button, Typography, Container, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./index.css";
import { authService } from "../../services/authService";
import { Alert } from "../../components/Alert";
import { localStorage } from '../../services/localStorage';

interface LoginProps {
  onLogin: (
    loggedIn: boolean,
    user: { 
      username: string; 
      role: string;
      name: string;
      lastname: string;
    }
  ) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [showAlert, setShowAlert] = useState<string | boolean>(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await authService.login({
        username,
        password,
      });
  
      if (response.success && response.user) {
      
        const userData = {
          username: response.user.username,
          role: response.user.role,
          name: response.user.name,  
          lastname: response.user.lastname
        };
        localStorage.set(response);

        onLogin(true, userData);
        navigate("/");
      } else {
        setShowAlert(response.error || 'Login failed');
      }
    } catch (error) {
      setShowAlert(true);
    }
  };

  return (
    <div className="login-container">
      <div className="background-image"></div>
      <div className="login-form-container">
        <Container maxWidth="xs">
          <Paper elevation={3} style={{ padding: 20 }}>
            <Typography variant="h5" gutterBottom align="center">
              BIBLIOTECA
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                size="small"
                fullWidth
                label="Usuario"
                variant="outlined"
                margin="normal"
                value={username}
                onChange={handleUsernameChange}
              />
              <TextField
                size="small"
                fullWidth
                label="Contraseña"
                type="password"
                variant="outlined"
                margin="normal"
                value={password}
                onChange={handlePasswordChange}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                style={{ marginTop: 20 }}
              >
                Ingresar
              </Button>
            </form>
            {showAlert && typeof showAlert === "string" && (
              <Alert message={showAlert} onClose={() => setShowAlert(false)} />
            )}
          </Paper>
        </Container>
      </div>
    </div>
  );
};