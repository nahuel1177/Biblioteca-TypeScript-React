import { useState, useEffect } from "react";
import { userService } from "../../services/userService";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Add from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
//import CreateIcon from "@mui/icons-material/Create";
import { useNavigate } from "react-router-dom";
import { IUser } from "../../interfaces/userInterface";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Fab,
} from "@mui/material";

export function User() {
  const [users, setUsers] = useState<IUser[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      const response = await userService.getUsers();
      if (response.data.success) {
        setUsers(response.data.result);
      }
    };
    fetchData();
  }, []);

  const onClickCreate = async () => {
    navigate('/crear-usuario');
  };
  //const onClickSearch = async (id: string | undefined) => {

  //}
  const onClickDelete = async (id: string | undefined) => {
    try {
      if (!id) {
        return "Id invalido";
      }
      const response = await userService.deleteUser(id);
      if (response.data.success) {
        const response = await userService.getUsers();
        setUsers(response.data.result);
        return "Se elimino el usuario";
      }
    } catch (error) {
      ("No existe el usuario");
    }
  };

  return (
    <Container>
      <Card style={{ marginTop: "20px" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
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
          <Stack direction="row" spacing={2} style={{ marginTop: "20px" }}>
            <Fab size="small" color="success" onClick={() => onClickCreate}>
              <Add />
            </Fab>
            <Fab color="primary" size="small">
              <SearchIcon />
            </Fab>
          </Stack>
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
                  <Fab size="small" color="primary" aria-label="edit">
                    <EditIcon />
                  </Fab>
                  <Fab
                    size="small"
                    color="error"
                    aria-label="edit"
                    onClick={() => onClickDelete(user._id)}
                  >
                    <DeleteIcon />
                  </Fab>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
