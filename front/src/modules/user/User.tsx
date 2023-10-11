import { useState, useEffect } from "react";

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
  password: string;
}

export function User() {
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/users")
      .then((response) => response.json())

      .then((data) => setUsers(data))

      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <Container>

        <Card>
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
            <Card>
              <CardContent>
                <Typography variant="h6" component="div">
                  {user.username}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Password: {user.password}
                </Typography>
                <Stack direction="row" spacing={2}>
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
