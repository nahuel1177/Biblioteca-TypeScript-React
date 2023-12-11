import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  Fab,
  // Autocomplete,
  // TextField,
} from "@mui/material";
import Add from "@mui/icons-material/Add";
// import SearchIcon from "@mui/icons-material/Search";
import { ILoan } from "../../interfaces/loanInterface";
import { memberService } from "../../services/memberService";
import { IMember } from "../../interfaces/memberInterface";
import { IBook } from "../../interfaces/bookInterface";
import { bookService } from "../../services/bookService";
import { loanService } from "../../services/loanService";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export function Loan() {
  const navigate = useNavigate();
  const [loans, setLoans] = useState<ILoan[]>([]);
  const [members, setMembers] = useState<IMember[]>([]);
  const [books, setBooks] = useState<IBook[]>([]);
  const [sanctionStatus, setSanctionStatus] = useState("Vigente");

  useEffect(() => {
    const fetchData = async () => {

      const response2 = await memberService.getMembers();
      if (response2.success) {
        setMembers(response2.result);
      }

      const response = await loanService.getLoans();
      if (response.success) {
        setLoans(response.result);

        for (const loan of response.result) {
          if (isDefeated(loan.dateLimit)) {
            const memberToUpdate = await memberService.getMemberById(loan.memberId)
            console.log(memberToUpdate);

            if (memberToUpdate) {
              memberToUpdate.isSanctioned = true;
              await memberService.sanctionMember(memberToUpdate);
            }
          }
        }
      }

      const response3 = await bookService.getBooks();
      if (response3.success) {
        setBooks(response3.result);
      }
    };
    fetchData();
  }, []);

  const onCLickCreate = async () => {
    navigate("/crear-prestamo");
  };

  const onClickDelete = async (
    id: string | undefined,
    member: IMember | undefined
  ) => {
    try {
      if (!id || !member) {
        return Swal.fire({
          position: "center",
          icon: "error",
          text: "El préstamo no existe",
          showConfirmButton: false,
          timer: 2000,
        });
      }

      const response = await loanService.deleteLoan(id);
      if (response.success) {
        if (member.isSanctioned) {
          const response = await loanService.getLoans();
          setLoans(response.result);
          return Swal.fire({
            position: "center",
            icon: "success",
            text: "El libro ha sido devuelto fuera de termino",
            showConfirmButton: true,
          });
        } else {
          member.sanctionDate = null;
          const response4 = await memberService.updateMember(
            member._id,
            member
          );
          if (response4.success) {
            const response = await loanService.getLoans();
            setLoans(response.result);
            return Swal.fire({
              position: "center",
              icon: "success",
              text: "El libro ha sido devuelto",
              showConfirmButton: true,
            });
          }
        }
      }
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        text: "El préstamo no existe",
        showConfirmButton: true,
      });
    }
  };

  const typeLoan = (loan: ILoan) => {
    {
      if (loan.type == "external") {
        return "Externo";
      } else {
        return "Interno";
      }
    }
  };

  const isDefeated = (dateLimit: Date) => {
    const dateNow = new Date();
    dateLimit = new Date(dateLimit);

    if (dateLimit.getTime() < dateNow.getTime()) {
      setSanctionStatus("Vencido");
      return true;
    } else {
      setSanctionStatus("Vigente");
      return false;
    }
  };

  return (
    <Container>
      <Card style={{ marginTop: "20px" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Préstamos
          </Typography>
           {/*<Stack spacing={2} sx={{ width: 300 }}>
            <Autocomplete
              freeSolo
              id="search"
              disableClearable
              options={loans.map((option) => option.bookId)}
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
          </Stack> */}
          <Stack direction="row" spacing={2} style={{ marginTop: "20px" }}>
            <Fab color="success" onClick={() => onCLickCreate()} size="small">
              <Add />
            </Fab>
            {/* <Fab color="primary" size="small">
              <SearchIcon />
            </Fab> */}
          </Stack>
        </CardContent>
      </Card>
      <Grid container spacing={2}>
        {loans.map((loan, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card style={{ marginTop: "20px" }}>
              <CardContent>
                <Typography variant="h6" component="div">
                  {books.find((book) => book._id === loan.bookId)?.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Autor:{" "}
                  {books.find((book) => book._id === loan.bookId)?.author}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Prestado a:{" "}
                  {members.find((member) => member._id === loan.memberId)?.name}{" "}
                  {
                    members.find((member) => member._id === loan.memberId)
                      ?.lastname
                  }
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Fecha Inicial: {new Date(loan.createdAt).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Fecha de Entrega{" "}
                  {new Date(loan.dateLimit).toLocaleDateString()} (
                  {sanctionStatus})
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tipo: {typeLoan(loan)}
                </Typography>
                <Stack
                  direction="row"
                  spacing={2}
                  style={{ marginTop: "20px" }}
                >
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() =>
                      onClickDelete(
                        loan._id,
                        members.find((member) => member._id === loan.memberId)
                      )
                    }
                  >
                    <Typography fontSize={13}>Devolver</Typography>
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
