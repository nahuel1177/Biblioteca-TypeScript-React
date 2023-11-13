import { useState, useEffect } from "react";
import { userService } from "../../services/userService";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { IUser } from "../../interfaces/userInterface";
import {
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
} from "@mui/material";

export function User() {
  const [users, setUsers] = useState<IUser[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await userService.getUsers();
      if (response.data.success) {
        setUsers(response.data.result);
      }
    };
    fetchData();
  }, []);

  // const onClickDelete = (e: IUser) => {}
   
  return (
    <Container>
      <Card style={{ marginTop: "20px" }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Administración de Usuarios
          </Typography>
          <Stack spacing={2} sx={{ width: 300 }}>
            <Autocomplete
              freeSolo
              id="search"
              disableClearable
              options={users.map((option) => option.username)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Buscar"
                  InputProps={{
                    ...params.InputProps,
                    type: "search",
                  }}
                />
              )}
              size="small"
            />
          </Stack>
          <Button
            variant="contained"
            color="success"
            style={{ marginTop: "20px" }}
          >
            Nuevo Usuario
          </Button>
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        {users.map((user, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card style={{ marginTop: "20px" }}>
              <CardContent>
                <Typography variant="h6" component="div">
                  {user.username}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Correo: {user.email}
                </Typography>
                <Stack
                  direction="row"
                  spacing={2}
                  style={{ marginTop: "20px" }}
                >
                  <Button variant="contained">Modificación</Button>
                  <Button
                    // onClick={() => onClickDelete(user)}
                    variant="contained"
                    color="error"
                  >
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
