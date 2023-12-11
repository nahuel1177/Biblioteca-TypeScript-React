import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { memberService } from "../../services/memberService";
import TextField from "@mui/material/TextField";
//import Autocomplete from "@mui/material/Autocomplete";
import { IMember } from "../../interfaces/memberInterface";
import {
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Fab,
  Modal,
} from "@mui/material";
const style = {
  position: "absolute",
  top: "40%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};
import DeleteIcon from "@mui/icons-material/Delete";
import Add from "@mui/icons-material/Add";
//import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { loanService } from "../../services/loanService";
import { ILoan } from "../../interfaces/loanInterface";

export function Member() {
  const [members, setMembers] = useState<IMember[]>([]);
  const [loans, setLoans] = useState<ILoan[]>([]);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  //const [sanctionStatus, setSanctionStatus] = useState("Sin Sancion");

  useEffect(() => {
    const fetchData = async () => {
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
    };
    fetchData();
  }, []);

  const onCLickCreate = async () => {
    navigate("/crear-miembro");
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
      Swal.fire({
        position: "center",
        icon: "error",
        text: "El socio no existe",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  }
  const findMemberOnLoan = (id: string) => {
    const loanFinded = loans.map((loan) => (loan.memberId = id));
    if (loanFinded.length > 0) {
      return true;
    } else {
      return false;
    }
  };
  const onClickDelete = async (id: string | undefined) => {
    try {
      if (!id) {
        Swal.fire({
          position: "center",
          icon: "error",
          text: "El socio no existe",
          showConfirmButton: true,
        });
      } else {
        const memberFinded = findMemberOnLoan(id);
        if (!memberFinded) {
          const response = await memberService.deleteMember(id);
          if (response.success) {
            const response = await memberService.getMembers();
            setMembers(response.result);
            return Swal.fire({
              position: "center",
              icon: "success",
              text: "El socio fue eliminado",
              showConfirmButton: true,
            });
          }
        } else {
          Swal.fire({
            position: "center",
            icon: "error",
            text: "Imposible eliminar. El socio tiene prestamos vigentes.",
            showConfirmButton: true,
          });
        }
      }
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        text: "El socio no existe",
        showConfirmButton: true,
      });
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
          //setSanctionStatus("Sancionado");
          return Swal.fire({
            position: "center",
            icon: "error",
            text: "El socio fue sancionado",
            showConfirmButton: true,
          });
        }
      } else {
        member.isSanctioned = state;
        member.sanctionDate = null
        const response = await memberService.sanctionMember(member);
        if (response.success) {
          const response = await memberService.getMembers();
          setMembers(response.result);
          //setSanctionStatus("Sin Sancion");
          return Swal.fire({
            position: "center",
            icon: "success",
            text: "Se le quito la sancion al socio",
            showConfirmButton: true,
          });
        }
      }
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        text: "El socio no existe",
        showConfirmButton: true,
      });
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

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setMember({ ...member, [name as string]: value });
    console.log("Miembro Input: ", member);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // Aquí podrías enviar los datos del usuario al servidor o realizar otras acciones según tus necesidades
    if (
      member.name != "" &&
      member.lastname != "" &&
      member.email != "" &&
      member.dni != null
    ) {
      memberService.updateMember(member._id, member);
      // Puedes reiniciar el formulario después de enviar los datos
      const response = await memberService.getMembers();
      if (response.success) {
        setMembers(response.result);
        setMember(initialMemberState);
        handleClose();
        Swal.fire({
          position: "center",
          icon: "success",
          text: "El socio fue actualizado",
          showConfirmButton: true,
        });
      }
    } else {
      handleClose();
      Swal.fire({
        position: "center",
        icon: "error",
        text: "Datos faltantes o inválidos",
        showConfirmButton: true,
      });
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

  return (
    <Stack>
      <Container>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          sx={style}
        >
          <Container maxWidth="xs">
            <Typography variant="h6" gutterBottom marginTop={2}>
              Modificación de Socio
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Nombres"
                name="name"
                value={member.name}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                size="small"
              />
              <TextField
                label="Apellidos"
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
                label="Correo"
                name="correo"
                value={member.email}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                size="small"
              />
              <Stack direction="row" spacing={2} style={{ marginTop: "20px" }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  onClick={handleSubmit}
                >
                  <Typography fontSize={13}>Modificar</Typography>
                </Button>
                <Button variant="contained" color="error" onClick={handleClose}>
                  <Typography fontSize={13}>Cancelar</Typography>
                </Button>
              </Stack>
            </form>
          </Container>
        </Modal>
        <Card style={{ marginTop: "20px" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Administración de Socios
            </Typography>
            {/* <Stack spacing={2} sx={{ width: 300 }}>
              <Autocomplete
                freeSolo
                id="search"
                disableClearable
                options={members.map((option) => option.name)}
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
          {members.map((member, index) => (
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
