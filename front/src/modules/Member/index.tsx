import { useState, useEffect } from "react";
import { memberService } from "../../services/memberService";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { IMember } from "../../interfaces/memberInterface";
import {
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Fab,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Add from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";

export function Member() {
  const [members, setMembers] = useState<IMember[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await memberService.getMembers();
      if (response.data.success) {
        setMembers(response.data.result);
      }
    };
    fetchData();
  }, []);

  const onCLickCreate = async () => {
    navigate("/crear-miembro");
  };

  const onClickDelete = async (id: string | undefined) => {
    try {
      if (!id) {
        return "Id invalido";
      }
      console.log("ID de miembro: ", id);
      const response = await memberService.deleteMember(id);
      if (response.data.success) {
        const response = await memberService.getMembers();
        setMembers(response.data.result);
        return "Se elimino el miembro";
      }
    } catch (error) {
      ("No existe el miembro");
    }
  };

  return (
    <Container>
      <Card style={{ marginTop: "20px" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Administración de Socios
          </Typography>
          <Stack spacing={2} sx={{ width: 300 }}>
            <Autocomplete
              freeSolo
              id="search"
              disableClearable
              options={members.map((option) => option.name)}
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
            <Button variant="contained" color="success" startIcon={<Add />} onClick={() => onCLickCreate()}>
              <Typography fontSize={13}>Socio</Typography>
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SearchIcon />}
            >
              <Typography fontSize={13}>Buscar</Typography>
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        {members.map((member, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card style={{ marginTop: "20px" }}>
              <CardContent>
                <Typography variant="h6" component="div">
                  {member.lastname}, {member.name}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Correo: {member.email}
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
                    onClick={() => onClickDelete(member._id)}
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
