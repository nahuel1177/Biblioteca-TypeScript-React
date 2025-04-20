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
  Fab,
  useTheme,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import Add from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { loanService } from "../../services/loanService";
import { ILoan } from "../../interfaces/loanInterface";
import { SearchBar } from "../SearchBar";
import { CreateMemberModal } from "../CreateMemberModal";
import { EditMemberModal } from "../EditMemberModal";
import { useNavigate } from "react-router-dom";
import { useSweetAlert } from "../../hooks/useSweetAlert";
import { ConstructionOutlined } from "@mui/icons-material";

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
  const theme = useTheme();
  const swal = useSweetAlert();
  
  // Configure SweetAlert2 theme based on app theme
  useEffect(() => {
    // Set SweetAlert2 theme based on the app's current theme
    document.querySelector('.swal2-container')?.setAttribute('data-theme', theme.palette.mode);
  }, [theme.palette.mode]);

  const [sanctionStatus, setSanctionStatus] = useState("Sin Sancion");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await memberService.getMembers();
        if (response.success) {
          setMembers(response.result);

          for (const member of response.result) {
            if (
              member.sanctionDate != null &&
              member.limitSanctionDays != null
            ) {
              if (isDefeated(member.sanctionDate, member.limitSanctionDays)) {
                const memberToUpdate = member;
                if (memberToUpdate) {
                  memberToUpdate.isSanctioned = false;
                  //setSanctionStatus("Sin Sancion");
                  (member.sanctionDate = null),
                    await memberService.sanctionMember(memberToUpdate);
                }
              }
            }
          }
        }
        
        const response2 = await loanService.getLoans();
        if (response2.success) {
          setLoans(response2.result);
        }
      } catch (error) {
        console.error("Error fetching members:", error);
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
    // Aquí podrías establecer un valor por defecto si lo deseas
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
    //const [result, setResult] = useState(false);
    // Check if the member has any active loans
    const activeLoan = loans.find(loan => 
      loan.memberId === id && loan.isActive === true
    );
    console.log("activeLoan: ", activeLoan?._id);
   
    return activeLoan;
  };
  
  const onClickDelete = async (id: string) => {
    try {
      console.log("ID enviado:" ,id);
        const memberFinded = findMemberOnLoan(id);
        console.log("memberFinded: ", memberFinded);
        if (!memberFinded) {
          const result = await swal.confirm("¿Esta seguro que desea eliminar?");
          if (result.isConfirmed) {
            const response = await memberService.deleteMember(id);
            if (response.success) {
              const response = await memberService.getMembers();
              setMembers(response.result);
              swal.success("El socio fue eliminado");
            }
          }
        } else {
          swal.error("Imposible eliminar. El socio tiene prestamos vigentes.");
        }
      } catch (error) {
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
          setMembers(response.result);
          swal.error("El socio fue sancionado");
        }
      } else {
        member.isSanctioned = state;
        member.sanctionDate = null
        const response = await memberService.sanctionMember(member);
        if (response.success) {
          const response = await memberService.getMembers();
          setMembers(response.result);
          swal.success("Se le quito la sancion al socio");
        }
      }
    } catch (error) {
      swal.error("El socio no existe");
    }
  }

  const isDefeated = (sanctionDate: Date, limitSanctionDays: number) => {
    const dateNow = new Date();
    sanctionDate = new Date(sanctionDate);

    if (dateNow.getTime() - sanctionDate.getTime() === limitSanctionDays) {
      //setSanctionStatus("Sin Sancion");
      return true;
    } else {
      //setSanctionStatus("Sancionado");
      return false;
    }
  };

  const state = (memberSanction: boolean | undefined) => {
    if (memberSanction === true) {
      return "Sancionado";
    } else {
      return "Sin Sanción";
    }
  };

  const sanctionMember = (member: IMember) => {
    if (member.isSanctioned) {
      return (
        <Fab
          size="small"
          color="success"
          aria-label="edit"
          onClick={() => onClickSanction(member, false)}
        >
          <CheckIcon />
        </Fab>
      );
    } else {
      return (
        <Fab
          size="small"
          color="default"
          aria-label="edit"
          onClick={() => onClickSanction(member, true)}
        >
          <CloseIcon />
        </Fab>
      );
    }
  };

  const onClickSearch = () => {
    const filtered = members.filter(member => 
      `${member.name} ${member.lastname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
              <Fab color="success" onClick={() => onCLickCreate()} size="small">
                <Add />
              </Fab>

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
          {(filteredMembers.length > 0 ? filteredMembers : members)?.map((member, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card style={{ marginTop: "20px" }}>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {member.lastname}, {member.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Correo: {member.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Estado: {state(member.isSanctioned)}
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={2}
                    style={{ marginTop: "20px" }}
                  >
                    <Fab
                      size="small"
                      color="primary"
                      aria-label="edit"
                      onClick={() => onClickUpdate(member)}
                    >
                      <EditIcon />
                    </Fab>
                    <Fab
                      size="small"
                      color="error"
                      aria-label="edit"
                      onClick={() => onClickDelete(member._id)}
                    >
                      <DeleteIcon />
                    </Fab>
                    {sanctionMember(member)}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Stack>
  );
}
