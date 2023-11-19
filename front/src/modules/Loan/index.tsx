import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  Autocomplete,
  TextField,
} from "@mui/material";
import Add from "@mui/icons-material/Add";

import { ILoan } from "../../interfaces/loanInterface";
import { memberService } from "../../services/memberService";
import { IMember } from "../../interfaces/memberInterface";
import { IBook } from "../../interfaces/bookInterface";
import { bookService } from "../../services/bookService";
import { loanService } from "../../services/loanService";

export function Loan() {
  const [loans, setLoans] = useState<ILoan[]>([]);
  const [members, setMembers] = useState<IMember[]>([]);
  const [books, setBooks] = useState<IBook[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await loanService.getLoans();
      if (response.data.success) {
        setLoans(response.data.result);
      }

      const response2 = await memberService.getMembers();
      if (response2.data.success) {
        setMembers(response2.data.result);
      }

      const response3 = await bookService.getBooks();
      if (response3.data.success) {
        setBooks(response3.data.result);
      }
    };
    fetchData();
  }, []);

  return (
    <Container>
      <Card style={{ marginTop: "20px" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Préstamos
          </Typography>
          <Stack spacing={2} sx={{ width: 300 }}>
            <Autocomplete
              freeSolo
              id="search"
              disableClearable
              options={loans.map((option) => option.member)}
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
          </Stack>
          <Button
            variant="contained"
            color="success"
            style={{ marginTop: "20px" }}
            startIcon={<Add />}
          >
            <Typography fontSize={13}>Buscar</Typography>
          </Button>
        </CardContent>
      </Card>
      <Grid container spacing={2}>
        {loans.map((loan, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card style={{ marginTop: "20px" }}>
              <CardContent>
                <Typography variant="h6" component="div">
                  {books.find((book) => book._id === loan.book)?.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Autor: {books.find((book) => book._id === loan.book)?.author}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Prestado a:{" "}
                  {members.find((member) => member._id === loan.member)?.name}{" "}
                  {
                    members.find((member) => member._id === loan.member)
                      ?.lastname
                  }
                </Typography>
                <Stack
                  direction="row"
                  spacing={2}
                  style={{ marginTop: "20px" }}
                >
                  <Button variant="contained" color="error">
                  <Typography fontSize={13}>Devolución</Typography>
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
