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
import { IBook } from "../../interfaces/bookInterface";
import { bookService } from "../../services/bookService";
import Add from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";

export function Book() {
  const [books, setBooks] = useState<IBook[]>([]);

  useEffect(() => {
    console.log("Fetch");
    const fetchData = async () => {
      const response = await bookService.getBooks();
      // console.log("response prueba", response);
      console.log("Response FRONT", response);
      if (response.data.success) {
        setBooks(response.data.result);
      }
    };
    fetchData();
  }, []);

  const onClickDelete = async (id: string | undefined) => {
    try {
      if (!id) {
        return "Id invalido";
      }
      const response = await bookService.deleteBook(id);
      if (response.data.success) {
        const response = await bookService.getBooks();
        setBooks(response.data.result);
        return "Se elimino el libro";
      }
    } catch (error) {
      ("No existe el libro");
    }
  };
  return (
    <Container>
      <Card style={{ marginTop: "20px", marginBottom: "15px" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
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
                  }}
                />
              )}
              size="small"
            />
          </Stack>
          <Stack direction="row" spacing={2} style={{ marginTop: "20px" }}>
            <Button variant="contained" color="success" startIcon={<Add />}>
              <Typography fontSize={13}>Libro</Typography>
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SearchIcon />}
            >
              <Typography fontSize={13}>Buscar</Typography>
            </Button>
          </Stack>
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
                <Stack
                  direction="row"
                  spacing={2}
                  style={{ marginTop: "20px" }}
                >
                  <Button variant="contained" startIcon={<Add />}>
                    <Typography fontSize={13}>Préstamo</Typography>
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => onClickDelete(book._id)}
                  >
                    <Typography fontSize={13}>Baja</Typography>
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
