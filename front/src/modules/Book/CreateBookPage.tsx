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
import { bookService } from "../../services/bookService";
import { useNavigate } from "react-router-dom";
import { ICreateBook } from "../../interfaces/bookInterface";
//import { Add } from "@mui/icons-material";

// Componente principal
export const CreateBookPage: React.FC = () => {

    const navigate = useNavigate();

    // Estado inicial del formulario
    const initialBookState: ICreateBook = {
        title: "",
        author: "",
        stock: 0,
        // Aquí podrías establecer un valor por defecto si lo deseas
    };

    // Estado del formulario
    const [book, setBook] = useState<ICreateBook>(initialBookState);

    // Manejar cambios en los campos del formulario
    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
    ) => {
        const { name, value } = e.target;
        setBook({ ...book, [name as string]: value });
    };

    // Manejar envío del formulario
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        // Aquí podrías enviar los datos del usuario al servidor o realizar otras acciones según tus necesidades
        bookService.createBook(book);
        console.log("Libro creado:", book);
        // Puedes reiniciar el formulario después de enviar los datos
        setBook(initialBookState);
    };

    const handleHome = async () => {
        navigate("/libros");
    };

    return (
        <Stack>
            <Container maxWidth="xs">
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Título"
                        name="title"
                        value={book.title}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Autor"
                        name="author"
                        value={book.author}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Ejemplares"
                        name="stock"
                        value={book.stock}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <Stack direction="row" spacing={2} style={{ marginTop: "20px" }}>
                        <Button type="submit" variant="contained" color="success" >
                            <Typography fontSize={13}>Crear Libro</Typography>
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
