import { useState, useEffect } from "react";
import { memberService } from "../../services/memberService";
import { IMember } from "../../interfaces/memberInterface";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
  Box,
} from "@mui/material";

import { loanService } from "../../services/loanService";
import { ILoan } from "../../interfaces/loanInterface";
import { SearchBar } from "../SearchBar";
import { CreateMemberModal } from "../Modals/CreateMemberModal";
import { EditMemberModal } from "../Modals/EditMemberModal";
import { useNavigate } from "react-router-dom";
import { useSweetAlert } from "../../hooks/useSweetAlert";
import {
  CreateButton,
  EditButton,
  DeleteButton,
  SanctionButton,
} from "../Buttons";

export function Member() {
  const [members, setMembers] = useState<IMember[]>([]);
  const [loans, setLoans] = useState<ILoan[]>([]);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const handleOpenCreateModal = () => setOpenCreateModal(true);
  const handleCloseCreateModal = () => setOpenCreateModal(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMembers, setFilteredMembers] = useState<IMember[]>([]);
  const swal = useSweetAlert();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await memberService.getMembers();
        if (response.success) {
          // Si la respuesta es exitosa, establecer los socios (incluso si es un array vacío)
          setMembers(response.result || []);

          // Chequear si la fecha de sanción ha pasado y desactivar la sanción si es necesario
          for (const member of response.result || []) {
            if (
              member.sanctionDate != null &&
              member.limitSanctionDays != null
            ) {
              if (isDefeated(member.sanctionDate, member.limitSanctionDays)) {
                const memberToUpdate = member;
                if (memberToUpdate) {
                  memberToUpdate.isSanctioned = false;
                  memberToUpdate.sanctionDate = null;
                  await memberService.sanctionMember(memberToUpdate);
                }
              }
            }
          }
        } else if (!response.result || response.result.length === 0) {
          // Si no hay socios, simplemente establecer un array vacío sin mostrar error
          setMembers([]);
        } else {
          // Solo mostrar error si hay un problema real (no simplemente una colección vacía)
          swal.toast("Error al cargar los socios", "error");
        }

        // Obtener los préstamos
        const response2 = await loanService.getLoans();
        if (response2.success) {
          // Si la respuesta es exitosa, establecer los préstamos (incluso si es un array vacío)
          setLoans(response2.result || []);

          // Chequear si los préstamos han vencido y aplicar la sanción si es necesario
          const currentDate = new Date();
          for (const loan of response2.result || []) {
            const loanDateLimit = new Date(loan.dateLimit);

            // Si el préstamo está activo y ha vencido la fecha de límite
            if (loanDateLimit < currentDate && loan.isActive) {
              // Solo aplicar la sanción si el préstamo es externo
              if (loan.type === "external") {
                // Encontrar el socio asociado al préstamo
                const memberToSanction = response.result?.find(
                  (m) => m._id === loan.memberId
                );

                if (memberToSanction && !memberToSanction.isSanctioned) {
                  // Aplicar la sanción al socio
                  memberToSanction.isSanctioned = true;
                  memberToSanction.sanctionDate = new Date();
                  await memberService.sanctionMember(memberToSanction);

                  // Actualizar el estado local de los socios
                  const updatedResponse = await memberService.getMembers();
                  if (updatedResponse.success) {
                    setMembers(updatedResponse.result || []);
                  }
                }
              }
            }
          }
        } else if (!response2.result || response2.result.length === 0) {
          // Si no hay préstamos, simplemente establecer un array vacío sin mostrar error
          setLoans([]);
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
        // Solo navegar a la página de error en caso de errores graves
        navigate("/error500");
      }
    };
    fetchData();
  }, [navigate]);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredMembers([]);
    }
  }, [searchTerm]);

  const onCLickCreate = async () => {
    handleOpenCreateModal();
  };

  const initialMemberState: IMember = {
    _id: "",
    name: "",
    lastname: "",
    email: "",
    dni: 0,
    isSanctioned: false,
  };

  const [member, setMember] = useState<IMember>(initialMemberState);

  async function onClickUpdate(member: IMember) {
    try {
      setMember(member);
      handleOpen();
    } catch (error) {
      swal.error("El socio no existe");
    }
  }
  const findMemberOnLoan = (id: string) => {
    // Chequear si el socio tiene un préstamo activo
    const activeLoan = loans.find(
      (loan) => loan.memberId === id && loan.isActive === true
    );
    console.log("activeLoan: ", activeLoan?._id);

    return activeLoan;
  };

  const onClickDelete = async (id: string) => {
    try {
      const memberFinded = findMemberOnLoan(id);
      if (!memberFinded) {
        const result = await swal.confirm("¿Esta seguro que desea eliminar?");
        if (result.isConfirmed) {
          const response = await memberService.deleteMember(id);
          if (response.success) {
            const response = await memberService.getMembers();
            setMembers(response.result || []);
            swal.success("El socio fue eliminado");
          }
        }
      } else {
        swal.error("Imposible eliminar. El socio tiene un prestamo vigente.");
      }
    } catch (error) {
      console.error("Error al eliminar socio:", error);
      swal.error("Hubo un problema, intentelo más tarde");
    }
  };

  async function onClickSanction(member: IMember, state: boolean) {
    try {
      if (!member._id) {
        return "Id invalido";
      }
      if (state) {
        member.isSanctioned = state;
        member.sanctionDate = new Date();
        const response = await memberService.sanctionMember(member);
        if (response.success) {
          const response = await memberService.getMembers();
          setMembers(response.result || []);
          swal.error("El socio fue sancionado");
        }
      } else {
        member.isSanctioned = state;
        member.sanctionDate = null;
        const response = await memberService.sanctionMember(member);
        if (response.success) {
          const response = await memberService.getMembers();
          setMembers(response.result || []);
          swal.success("Se le quito la sancion al socio");
        }
      }
    } catch (error) {
      console.error("Error al sancionar/quitar sanción:", error);
      swal.error("El socio no existe");
    }
  }

  const isDefeated = (sanctionDate: Date, limitSanctionDays: number) => {
    const dateNow = new Date();
    sanctionDate = new Date(sanctionDate);

    // Calcular la diferencia en días entre la fecha actual y la fecha de sanción
    const diffTime = dateNow.getTime() - sanctionDate.getTime();
    // Convertir la diferencia a días y redondear al entero más cercano
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Chequear si la diferencia es mayor o igual al límite de días de sanción
    if (diffDays >= limitSanctionDays) {
      return true;
    } else {
      return false;
    }
  };

  const onClickSearch = () => {
    const filtered = members.filter(
      (member) =>
        `${member.name} ${member.lastname}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMembers(filtered);
  };

  return (
    <Stack>
      <Container>
        <EditMemberModal
          open={open}
          handleClose={handleClose}
          member={member}
          onMemberUpdated={async () => {
            const response = await memberService.getMembers();
            if (response.success) {
              setMembers(response.result);
            }
          }}
        />
        <CreateMemberModal
          open={openCreateModal}
          handleClose={handleCloseCreateModal}
          onMemberCreated={async () => {
            const response = await memberService.getMembers();
            if (response.success) {
              setMembers(response.result);
            }
          }}
        />
        <Card style={{ marginTop: "20px" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Socios
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
                tooltipTitle="Agregar Socio"
              />
              <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onSearch={onClickSearch}
                placeholder="Buscar socio..."
              />
            </Stack>
          </CardContent>
        </Card>

        <Grid container spacing={2}>
          {(filteredMembers.length > 0 ? filteredMembers : members)?.map(
            (member, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card style={{ marginTop: "20px" }}>
                  <CardContent>
                    <Box sx={{ position: "relative", mb: 1 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography component="div">
                          {member.lastname}, {member.name}
                        </Typography>
                        <Chip
                          label={member.isSanctioned ? "Sancionado" : "Sin Sanción"}
                          color={member.isSanctioned ? "error" : "success"}
                          size="small"
                          variant="filled"
                        />
                      </Stack>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Correo: {member.email}
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={2}
                      style={{ marginTop: "20px" }}
                    >
                      <EditButton
                        onClick={() => onClickUpdate(member)}
                        tooltipTitle="Editar Socio"
                      />
                      <DeleteButton
                        onClick={() => onClickDelete(member._id)}
                        tooltipTitle="Eliminar Socio"
                      />
                      <SanctionButton
                        isSanctioned={member.isSanctioned || false}
                        onSanction={() => onClickSanction(member, true)}
                        onRemoveSanction={() => onClickSanction(member, false)}
                      />
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
