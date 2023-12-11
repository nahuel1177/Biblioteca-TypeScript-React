import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ICreateLoan } from "../../interfaces/loanInterface";
import { loanService } from "../../services/loanService";
import { memberService } from "../../services/memberService";
import { bookService } from "../../services/bookService";
import { IMember } from "../../interfaces/memberInterface";
import { IBook } from "../../interfaces/bookInterface";
import Swal from "sweetalert2";

// Componente principal
export const CreateLoanPage: React.FC = () => {
  const navigate = useNavigate();

  const [members, setMembers] = useState<IMember[]>([]);
  const [books, setBooks] = useState<IBook[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response2 = await memberService.getMembers();
      if (response2.success) {
        setMembers(response2.result);
      }

      const response3 = await bookService.getBooks();
      if (response3.success) {
        setBooks(response3.result);
      }
    };
    fetchData();
  }, []);
  // Estado inicial del formulario
  const initialLoanState: ICreateLoan = {
    memberId: "",
    bookId: "",
    type: "",
    // Aquí podrías establecer un valor por defecto si lo deseas
  };

  // Estado del formulario
  const [loan, setLoan] = useState<ICreateLoan>(initialLoanState);

  // Manejar cambios en los campos del formulario
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setLoan({ ...loan, [name as string]: value });
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // Aquí podrías enviar los datos del usuario al servidor o realizar otras acciones según tus necesidades
    console.log(loan);
    const loanCreated = await loanService.createLoan(loan);
    console.log("Prestamo :", loanCreated);
    if (loanCreated.success) {
      Swal.fire({
        position: "center",
        icon: "success",
        text: "El préstamo fue creado",
        showConfirmButton: true,
      });
    } else {
      Swal.fire({
        position: "center",
        icon: "error",
        text: loanCreated.error,
        showConfirmButton: true,
      });
    }
    // Puedes reiniciar el formulario después de enviar los datos
    setLoan(initialLoanState);
  };
  const handleHome = async () => {
    navigate("/prestamos");
  };

  const filterMember = (member: IMember) => {
    if (member.name != undefined && !member.isSanctioned) {
      const memberName = member.lastname + ", " + member.name;
      return memberName;
    }
  };

  return (
    <Stack>
      <Container maxWidth="xs">
        <Typography variant="h6" gutterBottom marginTop={2}>
          Realizar Préstamo
        </Typography>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal" size="small" style={{ marginBottom: "1px" }}>
            <InputLabel>Seleccionar Libro</InputLabel>
            <Select
              label="Selccionar Libro"
              name="bookId"
              value={loan.bookId}
              onChange={(e) =>
                handleInputChange(
                  e as ChangeEvent<{ name?: string; value: unknown }>
                )
              }
            >
              {books.map((book, index) => (
                <MenuItem key={index} value={book._id}>
                  {book.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal" size="small" >
            <InputLabel>Seleccionar Socio</InputLabel>
            <Select
              label="Seleccionar Socio"
              name="memberId"
              value={loan.memberId}
              onChange={(e) =>
                handleInputChange(
                  e as ChangeEvent<{ name?: string; value: unknown }>
                )
              }
            >
              {members.map((member, index) => (
                <MenuItem key={index} value={member._id}>
                  {filterMember(member)}
                </MenuItem>
              ))}
            </Select>
            <FormControl fullWidth margin="normal" size="small">
              <InputLabel>Seleccionar Préstamo</InputLabel>
              <Select
                label="Seleccionar Préstamo"
                name="type"
                value={loan.type}
                onChange={(e) =>
                  handleInputChange(
                    e as ChangeEvent<{ name?: string; value: unknown }>
                  )
                }
              >
                <MenuItem value="internal">Interno</MenuItem>
                <MenuItem value="external">Externo</MenuItem>
                {/* Agrega más tipos de prestamos según sea necesario */}
              </Select>
            </FormControl>
          </FormControl>
          <Stack direction="row" spacing={2} style={{ marginTop: "10px" }}>
            <Button type="submit" variant="contained" color="success">
              <Typography fontSize={13}>Prestar</Typography>
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
