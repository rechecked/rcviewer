import { useNavigate } from 'react-router-dom';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import Search from '../Search';

function Content(props) {
  const navigate = useNavigate();  
  return (
    <Box>
      <Box>
        <AppBar position="static" elevation={0}>
          <Toolbar>
            <Stack direction="row" alignItems="center" spacing={6} sx={{ flexGrow: 1 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <img src="/logo192.png" style={{ width: 30, height: '100%' }} alt="rechecked logo" />
                <Typography component="a" href="/" variant="h6" sx={{
                  color: 'inherit',
                  textDecoration: 'none',
                }}>
                  ReChecked Viewer
                </Typography>
              </Stack>
              <Stack direction="row" spacing={2} sx={{ display: { xs: 'none', md: 'flex' } }}>
                <Button variant="text" color="inherit" onClick={() => navigate('/dashboard')}>Dashboard</Button>
                <Button variant="text" color="inherit" onClick={() => navigate('/agents')}>Agents</Button>
              </Stack>
            </Stack>
            <Search />
          </Toolbar>
        </AppBar>
      </Box>
      {props.children}
    </Box>
  );
}

export default Content;
