import React, { useState, ChangeEvent, FormEvent } from "react";
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
import { ICreateMember } from "../../interfaces/memberInterface";
//import { Add } from "@mui/icons-material";

// Componente principal
export const CreateMemberPage: React.FC = () => {

    const navigate = useNavigate();

    // Estado inicial del formulario
    const initialMemberState: ICreateMember = {
        name: "",
        lastname: "",
        email: "",
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
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        // Aquí podrías enviar los datos del usuario al servidor o realizar otras acciones según tus necesidades
        memberService.createMember(member);
        console.log("Miembro creado:", member);
        // Puedes reiniciar el formulario después de enviar los datos
        setMember(initialMemberState);
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
                    />
                    <TextField
                        label="Apellido"
                        name="lastname"
                        value={member.lastname}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Correo electrónico"
                        name="email"
                        value={member.email}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        type="email"
                    />
                    <Stack direction="row" spacing={2} style={{ marginTop: "20px" }}>
                        <Button type="submit" variant="contained" color="success">
                            <Typography fontSize={13}>Crear Miembro</Typography>
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleHome}>
                            <Typography fontSize={13}>Volver</Typography>
                        </Button>
                    </Stack>
                </form>
            </Container>
        </Stack>
    );
};
