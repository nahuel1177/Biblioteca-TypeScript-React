import {
  Container,
  Card,
  CardContent,
  Button
} from "@mui/material";

export function Home() {
  return (
    <Container>
        <Card style={{ marginTop: "20px"}}>
          <CardContent>
            <Button>Ingresar a Menu Administrador</Button>
            <Button>Ingresar a Menu Empleado</Button>
          </CardContent>
        </Card>
    </Container>
  );
}
