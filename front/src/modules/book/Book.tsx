import { useState, useEffect } from "react";

import { Container, Typography, Grid, Card, CardContent } from "@mui/material";

interface IBook {
  title: string;
  author: string;
}

export function Book() {
  const [books, setBooks] = useState<IBook[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/books")
      .then((response) => response.json())

      .then((data) => setBooks(data))

      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Book Module
      </Typography>

      <Grid container spacing={2}>
        {books.map((book, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div">
                  {book.title}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Author: {book.author}
                </Typography>

              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
