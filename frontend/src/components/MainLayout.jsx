import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function MainLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <AppBar position="static" sx={{ mb: 4 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>ZenMediClick</Typography>
          {user && <Button color="inherit" onClick={logout}>Salir</Button>}
        </Toolbar>
      </AppBar>
      <Container>{children}</Container>
    </>
  );
}