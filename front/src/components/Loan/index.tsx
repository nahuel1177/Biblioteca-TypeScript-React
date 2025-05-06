import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  Chip,
  Box,
} from "@mui/material";
import { ILoan } from "../../interfaces/loanInterface";
import { memberService } from "../../services/memberService";
import { IMember } from "../../interfaces/memberInterface";
import { IBook } from "../../interfaces/bookInterface";
import { bookService } from "../../services/bookService";
import { loanService } from "../../services/loanService";
import { useSweetAlert } from "../../hooks/useSweetAlert";
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
  const swal = useSweetAlert();

  useEffect(() => {
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      // Cargar miembros
      const response2 = await memberService.getMembers();
      if (response2.success) {
        setMembers(response2.result || []);

        // Chequear y eliminar sanción si ha pasado el límite de sanción
        const currentDate = new Date();
        for (const member of response2.result || []) {
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

            // Si ha expirado el límite de sanción, quitar la sanción
            if (currentDate >= sanctionEndDate) {
              const memberToUpdate = { ...member };
              memberToUpdate.isSanctioned = false;
              memberToUpdate.sanctionDate = null;

              await memberService.sanctionMember(memberToUpdate);
            }
          }
        }
      }

      // Cargar préstamos
      const response = await loanService.getLoans();
      if (response.success) {
        // Si la respuesta es exitosa pero no hay préstamos, simplemente establecer un array vacío
        setLoans(response.result || []);

        // Check each loan for expiration and sanction members if needed
        for (const loan of response.result || []) {
          // Solo verificar préstamos activos
          if (loan.isActive) {
            const currentDate = new Date();
            const loanDateLimit = new Date(loan.dateLimit);
          
            // Solo sancionar préstamos externos vencidos
            if (loan.type === "external") {
              if (currentDate.getTime() > loanDateLimit.getTime()) {
                // Econtrar y sancionar al miembro
                const memberToUpdate = await memberService.getMemberById(loan.memberId);
                if (memberToUpdate && memberToUpdate.isActive && !memberToUpdate.isSanctioned) {
                  // Aplicar sanción al miembro
                  memberToUpdate.isSanctioned = true;
                  memberToUpdate.sanctionDate = new Date();
                  await memberService.sanctionMember(memberToUpdate);
                }
              }
            }
          }
        }
      } else if (!response.result || response.result.length === 0) {
        // Si no hay préstamos, simplemente establecer un array vacío sin mostrar error
        setLoans([]);
      } else {
        // Solo mostrar error si hay un problema real (no simplemente una colección vacía)
        swal.error("Error al cargar los préstamos");
      }

      // Actualizar miembros actualizados
      const updatedMembers = await memberService.getMembers();
      if (updatedMembers.success) {
        setMembers(updatedMembers.result || []);
      }

      // Cargar libros
      const response3 = await bookService.getBooks();
      if (response3.success) {
        setBooks(response3.result || []);
      } else if (!response3.result || response3.result.length === 0) {
        // Si no hay libros, simplemente establecer un array vacío sin mostrar error
        setBooks([]);
      }
    } catch (error) {
      // Solo navegar a la página de error en caso de errores graves
      console.error("Error al cargar datos:", error);
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
        return swal.error("El préstamo no existe");
      }

      const confirmResult = await swal.confirm("¿Está seguro que desea registrar la devolución?");

      if (!confirmResult.isConfirmed) {
        return; // Usuario canceló la acción
      }

      // En
      const loan = loans.find(loan => loan._id === id);
      
      if (!loan) {
        return swal.error("El préstamo no existe");
      }
      
      // Para préstamos internos, simplemente eliminar sin modificar el estado del miembro
      if (loan.type === "internal") {
        const response = await loanService.deleteLoan(id);
        if (response.success) {
          const updatedLoans = await loanService.getLoans();
          setLoans(updatedLoans.result || []);
          return swal.success("El libro ha sido devuelto");
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
          setLoans(updatedLoans.result || []);
          return swal.success("El libro ha sido devuelto fuera de termino");
        } else {
          // Para préstamos externos que no están vencidos
          const updatedLoans = await loanService.getLoans();
          setLoans(updatedLoans.result || []);
          return swal.success("El libro ha sido devuelto");
        }
      }
    } catch (error) {
      swal.error("Error al procesar la devolución");
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
    // Solo proceder si hay préstamos para actualizar
    if (!loans || loans.length === 0) return;
    
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
            console.error("Error al actualizar el estado del préstamo:", error);
            // Solo mostrar alerta si es un error real, no por falta de datos
            swal.error("Error al actualizar el estado del préstamo");
          }
        } else if (loan.type === "internal" && loan.isDefeated !== "Vigente") {
          // Asegurarse de que los préstamos internos siempre estén marcados como vigentes
          const updatedLoan = { ...loan };
          updatedLoan.isDefeated = "Vigente";
          
          try {
            await loanService.updateLoan(updatedLoan._id, updatedLoan);
          } catch (error) {
            console.error("Error al actualizar el estado del préstamo interno:", error);
            // Solo mostrar alerta si es un error real, no por falta de datos
            swal.error("Error al actualizar el estado del préstamo interno");
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
    if (loans && loans.length > 0) {
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
