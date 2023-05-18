import { useNavigate, useSearchParams } from "react-router-dom";
import { Link as RouterLink } from 'react-router-dom';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';

import Search from '../Search';

function Content(props) {
  const navigate = useNavigate();  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Box sx={{ flex: '1 0 auto' }}>
        <Box>
          <AppBar position="static" elevation={0}>
            <Toolbar>
              <Stack direction="row" alignItems="center" spacing={6} sx={{ flexGrow: 1 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <img src="/logo192.png" style={{ width: 30, height: '100%' }} alt="rechecked logo" />
                  <Typography component={RouterLink} to="/" variant="h6" sx={{
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
      <Footer />
    </Box>
  );
}

function Footer() {

  // Don't display on the api viewer page
  const [searchParams] = useSearchParams();
  if (searchParams.get('tab') === 'api') {
    return;
  }

  return (
    <Container maxWidth={false} sx={{ flexShrink: 0 }}>
      <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ py: 3 }}>
        <Stack direction="row" divider={<Divider orientation="vertical" />} spacing={3}>
          <Typography variant="body2">
            &copy; {new Date().getFullYear()} <Link href="https://rechecked.io" target="_blank" rel="noopener noreferrer">ReChecked</Link>
          </Typography>
        </Stack>
        <Stack direction="row" divider={<Divider orientation="vertical" />} spacing={3}>
          <Typography variant="body2">
            <Link href="https://rechecked.io/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</Link>
          </Typography>
          <Typography variant="body2">
            <Link href="https://rechecked.io/terms-of-use" target="_blank" rel="noopener noreferrer">Terms of Use</Link>
          </Typography>
        </Stack>
      </Stack>
    </Container>
  );
}

export default Content;
