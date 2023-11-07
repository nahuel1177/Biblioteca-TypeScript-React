import { useState, useEffect } from "react";
import { user } from "../../services/user";

import {
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
} from "@mui/material";

interface IUser {
  username: string;
  email: string;
  password: string;
}

export function User() {
  const [users, setUsers] = useState<IUser[]>([]);
  console.log("Paso1");
  useEffect(() => {
    const fetchData = async () => {
      console.log("Entro");
      const response = await user.getUsers();
      console.log(response);
      setUsers(response);
    };
    fetchData();
  }, []);

  return (
  <Container>

        <Card style={{ marginTop: '20px' }}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              Administración de Usuarios
            </Typography>

            <Button variant="contained" color="success">
              Nuevo Usuario
            </Button>
          </CardContent>
        </Card>

      <Grid container spacing={2}>
        {users.map((user, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card style={{ marginTop: '20px' }}>
              <CardContent>
                <Typography variant="h6" component="div">
                  {user.username}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Correo: {user.email}
                </Typography>
                <Stack direction="row" spacing={2} style={{ marginTop: '20px' }}>
                  <Button variant="contained">Modificación</Button>
                  <Button variant="contained" color="error">
                    Baja
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
