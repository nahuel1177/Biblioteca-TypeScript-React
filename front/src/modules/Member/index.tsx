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
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

export function Member() {
  const [members, setMembers] = useState<IMember[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await memberService.getMembers();
      if (response.data.success) {
        setMembers(response.data.result);
      }
    };
    fetchData();
  }, []);

  return (
    <Container>
      <Card style={{ marginTop: "20px" }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
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
            <Button variant="contained" color="success">
              Nuevo Socio
            </Button>
            <Button variant="contained" color="primary">
              Buscar
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
                  {member.name}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Correo: {member.email}
                </Typography>
                <Stack
                  direction="row"
                  spacing={2}
                  style={{ marginTop: "20px" }}
                >
                  <Button variant="contained">Modificación</Button>
                  <Button variant="contained" color="error" startIcon={<DeleteIcon />}>
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
