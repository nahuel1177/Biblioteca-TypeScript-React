import { useState, useEffect } from "react";
import { Container, Typography, Grid, Card, CardContent, Button, Stack, Autocomplete, TextField } from "@mui/material";
import { IBook } from "../../interfaces/bookInterface";
import { bookService } from "../../services/bookService";



export function Book() {
  const [books, setBooks] = useState<IBook[]>([]);

  useEffect(() => {
    console.log("Fetch");
    const fetchData = async () => {
      const response = await bookService.getBooks();
      // console.log("response prueba", response);
      console.log("Response FRONT",response);
      if (response.data.success) {
        setBooks(response.data.result);
      }
    };
    fetchData();
  }, []);

  return (
    <Container>
      <Card style={{ marginTop: "20px" , marginBottom: "15px"}}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Administración de Libros
          </Typography>
          <Stack spacing={2} sx={{ width: 300 }}>
            <Autocomplete
              freeSolo
              id="search"
              disableClearable
              options={books.map((option) => option.title)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Buscar"
                  InputProps={{
                    ...params.InputProps,
                    type: "search",
                  }}/>
              )}
              size="small"/>
          </Stack>
          <Button variant="contained" color="success" style={{ marginTop: "20px"}}>
            Nuevo Libro
          </Button>
        </CardContent>
      </Card>
      <Grid container spacing={2}>
        {books.map((book, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card style={{ marginTop: "5px" }}>
              <CardContent>
                <Typography variant="h6" component="div">
                  {book.title}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Author: {book.author}
                </Typography>
                <Stack direction="row" spacing={2} style={{ marginTop: '20px' }}>
                  <Button variant="contained">Préstamo</Button>
                  <Button variant="contained" color="error">
                    Baja
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
