import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  useTheme,
  Chip,
  Box,
} from "@mui/material";
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
import { CreateButton } from "../Buttons";

export function Loan() {
  const [loans, setLoans] = useState<ILoan[]>([]);
  const [members, setMembers] = useState<IMember[]>([]);
  const [books, setBooks] = useState<IBook[]>([]);
  const navigate = useNavigate();
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
          // Solo verificar préstamos activos
          if (loan.isActive) {
            const currentDate = new Date();
            const loanDateLimit = new Date(loan.dateLimit);
          
            // Solo sancionar préstamos externos vencidos
            if (loan.type === "external") {
              if (currentDate.getTime() > loanDateLimit.getTime()) {
                // Find the member to potentially sanction
                const memberToUpdate = await memberService.getMemberById(loan.memberId);
                if (memberToUpdate && memberToUpdate.isActive && !memberToUpdate.isSanctioned) {
                  // Apply sanction only if not already sanctioned
                  memberToUpdate.isSanctioned = true;
                  memberToUpdate.sanctionDate = new Date();
                  await memberService.sanctionMember(memberToUpdate);
                }
              }
            }
          }
        }
      }

        // Refresh members list after potential sanctions
        const updatedMembers = await memberService.getMembers();
        if (updatedMembers.success) {
          setMembers(updatedMembers.result);
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

      // Find the loan to check its type
      const loan = loans.find(loan => loan._id === id);
      
      if (!loan) {
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
      
      // Para préstamos internos, simplemente eliminar sin modificar el estado del miembro
      if (loan.type === "internal") {
        const response = await loanService.deleteLoan(id);
        if (response.success) {
          const updatedLoans = await loanService.getLoans();
          setLoans(updatedLoans.result);
          return Swal.fire({
            position: "center",
            icon: "success",
            text: "El libro ha sido devuelto",
            showConfirmButton: true,
            background: theme.palette.background.paper,
            color: theme.palette.text.primary,
          });
        }
        return;
      }
      
      // A partir de aquí solo se procesan préstamos externos
      // Crear una copia del miembro para no modificar el original directamente
      const memberToUpdate = { ...member };

      const response = await loanService.deleteLoan(id);
      if (response.success) {
        // Solo para préstamos externos con sanción
        if (memberToUpdate.isSanctioned) {
          const updatedLoans = await loanService.getLoans();
          setLoans(updatedLoans.result);
          return Swal.fire({
            position: "center",
            icon: "success",
            text: "El libro ha sido devuelto fuera de termino",
            showConfirmButton: true,
            background: theme.palette.background.paper,
            color: theme.palette.text.primary,
          });
        } else {
          // Para préstamos externos que no están vencidos
          const updatedLoans = await loanService.getLoans();
          setLoans(updatedLoans.result);
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
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        text: "Error al procesar la devolución",
        showConfirmButton: true,
        background: theme.palette.background.paper,
        color: theme.palette.text.primary,
      });
    }
  };

  // Función para verificar si un préstamo está vencido
  const isLoanDefeated = (loan: ILoan): boolean => {
    const dateNow = new Date();
    const dateLimit = new Date(loan.dateLimit);

    // Los préstamos internos nunca vencen
    if (loan.type === "internal") {
      return false;
    } else if (dateLimit.getTime() < dateNow.getTime()){
      return true;
    }else{
      return false;
    }
  };

  // Función para actualizar el estado de vencimiento de los préstamos
  const updateLoanStatus = async () => {
    for (const loan of loans) {
      // Asegurarse de que solo los préstamos activos se verifiquen
      if (loan.isActive) {
        const isDefeated = isLoanDefeated(loan);
        
        // Solo actualizar si el estado ha cambiado y no es un préstamo interno
        if (loan.type !== "internal" && 
            ((isDefeated && loan.isDefeated !== "Vencido") ||
            (!isDefeated && loan.isDefeated === "Vencido"))) {

          const updatedLoan = { ...loan };
          updatedLoan.isDefeated = isDefeated ? "Vencido" : "Vigente";

          try {
            await loanService.updateLoan(updatedLoan._id, updatedLoan);
          } catch (error) {
            Swal.fire({
              position: "center",
              icon: "error",
              text: "Error al actualizar el estado del préstamo",
              showConfirmButton: true,
              background: theme.palette.background.paper,
              color: theme.palette.text.primary,
            });
          }
        } else if (loan.type === "internal" && loan.isDefeated !== "Vigente") {
          // Asegurarse de que los préstamos internos siempre estén marcados como vigentes
          const updatedLoan = { ...loan };
          updatedLoan.isDefeated = "Vigente";
          
          try {
            await loanService.updateLoan(updatedLoan._id, updatedLoan);
          } catch (error) {
            Swal.fire({
              position: "center",
              icon: "error",
              text: "Error al actualizar el estado del préstamo interno",
              showConfirmButton: true,
              background: theme.palette.background.paper,
              color: theme.palette.text.primary,
            });
          }
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
              <CreateButton
                onClick={onCLickCreate}
                tooltipTitle="Prestar Libro"
              />
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
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography component="div">
                        {books.find((book) => book._id === loan.bookId)?.title}
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        <Chip 
                          label={loan.type === "external" ? "Externo" : "Interno"} 
                          color={loan.type === "external" ? "primary" : "secondary"}
                          size="small"
                        />
                        <Chip 
                          label={loan.isDefeated} 
                          color={loan.isDefeated === "Vencido" ? "error" : "success"}
                          size="small"
                        />
                      </Stack>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
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
