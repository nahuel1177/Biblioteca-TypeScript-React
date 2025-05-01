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
  useTheme,
} from "@mui/material";
import Add from "@mui/icons-material/Add";
import { ILoan } from "../../interfaces/loanInterface";
import { memberService } from "../../services/memberService";
import { IMember } from "../../interfaces/memberInterface";
import { IBook } from "../../interfaces/bookInterface";
import { bookService } from "../../services/bookService";
import { loanService } from "../../services/loanService";
import Swal from "sweetalert2";
import { SearchBar } from "../SearchBar";
import { useNavigate } from "react-router-dom";
import { CreateLoanModal } from "../Modals/CreateLoanModal";

export function Loan() {
  const [loans, setLoans] = useState<ILoan[]>([]);
  const [members, setMembers] = useState<IMember[]>([]);
  const [books, setBooks] = useState<IBook[]>([]);
  const navigate = useNavigate();
  //const [sanctionStatus, setSanctionStatus] = useState("Vigente");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLoans, setFilteredLoans] = useState<ILoan[]>([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const handleOpenCreateModal = () => setOpenCreateModal(true);
  const handleCloseCreateModal = () => setOpenCreateModal(false);
  const theme = useTheme(); // Add this to get the current theme

  useEffect(() => {
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const response2 = await memberService.getMembers();
      if (response2.success) {
        setMembers(response2.result);

        // Check for expired sanctions
        const currentDate = new Date();
        for (const member of response2.result) {
          if (
            member.isSanctioned &&
            member.sanctionDate &&
            member.limitSanctionDays
          ) {
            const sanctionDate = new Date(member.sanctionDate);
            const sanctionEndDate = new Date(sanctionDate);
            sanctionEndDate.setDate(
              sanctionEndDate.getDate() + member.limitSanctionDays
            );

            // If sanction period has ended, remove the sanction
            if (currentDate >= sanctionEndDate) {
              const memberToUpdate = { ...member };
              memberToUpdate.isSanctioned = false;
              memberToUpdate.sanctionDate = null;

              await memberService.sanctionMember(memberToUpdate);
            }
          }
        }
      }

      const response = await loanService.getLoans();
      if (response.success) {
        setLoans(response.result);

        // Check each loan for expiration and sanction members if needed
        
        for (const loan of response.result) {
          const currentDate = new Date();
          const loanDateLimit = new Date(loan.dateLimit);

          // Si loan is expired
          console.log("Tipo de prestamo: ", loan.type);
          if (loan.type === "external") {
            console.log("Prestamo externo");
            if (currentDate.getTime() > loanDateLimit.getTime()) {
              // Find the member to potentially sanction
              const memberToUpdate = await memberService.getMemberById(
                loan.memberId
              );
              if (memberToUpdate && memberToUpdate.isActive) {
                // Apply sanction
                memberToUpdate.isSanctioned = true;
                memberToUpdate.sanctionDate = new Date();
                await memberService.sanctionMember(memberToUpdate);
              }
            }
          }
        }

        // Refresh members list after potential sanctions
        const updatedMembers = await memberService.getMembers();
        if (updatedMembers.success) {
          setMembers(updatedMembers.result);
        }
      } else {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          text: "Error al cargar los préstamos",
          showConfirmButton: false,
          timer: 1500,
          background: theme.palette.background.paper,
          color: theme.palette.text.primary,
        });
      }

      const response3 = await bookService.getBooks();
      if (response3.success) {
        setBooks(response3.result);
      }
    } catch (error) {
      navigate("/error500");
    }
  };

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredLoans([]);
    }
  }, [searchTerm]);

  const onCLickCreate = async () => {
    handleOpenCreateModal();
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
          background: theme.palette.background.paper,
          color: theme.palette.text.primary,
        });
      }

      const confirmResult = await Swal.fire({
        text: "¿Está seguro que desea registrar la devolución?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar",
        background: theme.palette.background.paper,
        color: theme.palette.text.primary,
      });

      if (!confirmResult.isConfirmed) {
        return; // User cancelled the operation
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
            background: theme.palette.background.paper,
            color: theme.palette.text.primary,
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
              background: theme.palette.background.paper,
              color: theme.palette.text.primary,
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
        background: theme.palette.background.paper,
        color: theme.palette.text.primary,
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

  // Función para verificar si un préstamo está vencido
  const isLoanDefeated = (loan: ILoan): boolean => {
    const dateNow = new Date();
    const dateLimit = new Date(loan.dateLimit);
    
    // Los préstamos internos nunca vencen
    if (loan.type !== "external") {
      return false;
    }
    
    return dateLimit.getTime() < dateNow.getTime();
  };
  
  // Función para actualizar el estado de vencimiento de los préstamos
  const updateLoanStatus = async () => {
    for (const loan of loans) {
      const isDefeated = isLoanDefeated(loan);
      
      // Solo actualizar si el estado ha cambiado
      if ((isDefeated && loan.isDefeated !== "Vencido") || 
          (!isDefeated && loan.isDefeated === "Vencido")) {
        
        const updatedLoan = { ...loan };
        updatedLoan.isDefeated = isDefeated ? "Vencido" : "Vigente";
        
        try {
          await loanService.updateLoan(updatedLoan._id, updatedLoan);
        } catch (error) {
          console.error("Error al actualizar el estado del préstamo:", error);
        }
      }
    }
  };

  const onClickSearch = () => {
    const filtered = loans.filter((loan) => {
      const book = books.find((book) => book._id === loan.bookId);
      const member = members.find((member) => member._id === loan.memberId);

      return (
        book?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${member?.name} ${member?.lastname}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    });
    setFilteredLoans(filtered);
  };

  // Ejecutar la verificación de préstamos cuando cambie la lista de préstamos
  useEffect(() => {
    if (loans.length > 0) {
      updateLoanStatus();
    }
  }, [loans]);

  return (
    <Stack>
      <Container>
        <CreateLoanModal
          open={openCreateModal}
          handleClose={handleCloseCreateModal}
          onLoanCreated={fetchData}
        />

        <Card style={{ marginTop: "20px" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Préstamos
            </Typography>

            <Stack
              direction="row"
              spacing={2}
              style={{ marginTop: "20px" }}
              alignItems="center"
              justifyContent="space-between"
            >
              <Fab color="success" onClick={() => onCLickCreate()} size="small">
                <Add />
              </Fab>
              <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onSearch={onClickSearch}
                placeholder="Buscar Libro o Socio..."
              />
            </Stack>
          </CardContent>
        </Card>
        <Grid container spacing={2}>
          {(filteredLoans.length > 0 ? filteredLoans : loans).map(
            (loan, index) => (
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
                      {
                        members.find((member) => member._id === loan.memberId)
                          ?.name
                      }{" "}
                      {
                        members.find((member) => member._id === loan.memberId)
                          ?.lastname
                      }
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Fecha Inicial:{" "}
                      {new Date(loan.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Fecha de Entrega{" "}
                      {new Date(loan.dateLimit).toLocaleDateString()}
                      {` (${loan.isDefeated})`}
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
                            members.find(
                              (member) => member._id === loan.memberId
                            )
                          )
                        }
                      >
                        <Typography fontSize={13}>Devolver</Typography>
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            )
          )}
        </Grid>
      </Container>
    </Stack>
  );
}
