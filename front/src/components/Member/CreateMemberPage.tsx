import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import {
  TextField,
  Button,
  //FormControl,
  //InputLabel,
  //Select,
  //MenuItem,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { memberService } from "../../services/memberService";
import { useNavigate } from "react-router-dom";
import { ICreateMember, IMember } from "../../interfaces/memberInterface";
import Swal from "sweetalert2";
//import { Add } from "@mui/icons-material";

// Componente principal
export const CreateMemberPage: React.FC = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<IMember[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await memberService.getMembers();
      if (response.success) {
        setMembers(response.result);
        console.log(members);
      }
    };
    fetchData();
  }, []);
  // Estado inicial del formulario
  const initialMemberState: ICreateMember = {
    name: "",
    lastname: "",
    email: "",
    dni: 0,
    // Aquí podrías establecer un valor por defecto si lo deseas
  };

  // Estado del formulario
  const [member, setMember] = useState<ICreateMember>(initialMemberState);

  // Manejar cambios en los campos del formulario
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setMember({ ...member, [name as string]: value });
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // Aquí podrías enviar los datos del usuario al servidor o realizar otras acciones según tus necesidades
    if (
      member.name != "" &&
      member.lastname != "" &&
      member.dni != undefined &&
      member.email != ""
    ) {
      const memberFinded = await memberService.getMemberByDni(member.dni);
      if (!memberFinded.success) {
        memberService.createMember(member);
        Swal.fire({
          position: "center",
          icon: "success",
          text: "El socio fue dado de alta",
          showConfirmButton: true,
        });
        // Puedes reiniciar el formulario después de enviar los datos
        setMember(initialMemberState);
      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          text: "El socio ya existe.",
          showConfirmButton: true,
        });
      }
    } else {
      Swal.fire({
        position: "center",
        icon: "error",
        text: "Datos faltantes o inválidos.",
        showConfirmButton: true,
      });
    }
  };

  const handleHome = async () => {
    navigate("/socios");
  };

  return (
    <Stack>
      <Container maxWidth="xs">
        <Typography variant="h6" gutterBottom marginTop={2}>
          Alta de Socio
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nombre"
            name="name"
            value={member.name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            size="small"
          />
          <TextField
            label="Apellido"
            name="lastname"
            value={member.lastname}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            size="small"
          />
          <TextField
            label="Documento"
            name="dni"
            value={member.dni}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            type="number"
            size="small"
          />
          <TextField
            label="Correo electrónico"
            name="email"
            value={member.email}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            type="email"
            size="small"
          />
          <Stack direction="row" spacing={2} style={{ marginTop: "20px" }}>
            <Button type="submit" variant="contained" color="success">
              <Typography fontSize={13}>Crear</Typography>
            </Button>
            <Button variant="contained" color="error" onClick={handleHome}>
              <Typography fontSize={13}>Cancelar</Typography>
            </Button>
          </Stack>
        </form>
      </Container>
    </Stack>
  );
};
