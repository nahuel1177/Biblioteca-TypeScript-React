import { Container, Typography, Button, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export const Error401 = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'url("/background.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          zIndex: 0
        }
      }}
    >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            padding: 5, 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 3
          }}
        >
          <ErrorOutlineIcon sx={{ fontSize: 100, color: 'error.main' }} />
          <Typography variant="h2" component="h1" gutterBottom>
            401
          </Typography>
          <Typography variant="h5" gutterBottom>
            Acceso No Autorizado
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            No tienes permisos para acceder a esta página.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/')}
            size="large"
          >
            Volver al Inicio
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};