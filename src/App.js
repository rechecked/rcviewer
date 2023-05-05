import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

import { AgentsProvider } from './context/agents';
import { DashboardProvider } from './context/dashboard';
import { ExampleProvider } from './context/example';

import Content from './components/layout/Content'; 

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Agents from './pages/Agents';

const theme = createTheme({
  palette: {
    primary: {
      light: '#484848',
      main: '#212121',
      dark: '#000000',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff9b3f',
      main: '#ff6900',
      dark: '#c43700',
      contrastText: '#000',
    },
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true
      }
    }
  },
});

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <AgentsProvider>
          <DashboardProvider>
            <ExampleProvider>
              <CssBaseline enableColorScheme />
              <Content>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/agents" element={<Agents />} />
                </Routes>
              </Content>
            </ExampleProvider>
          </DashboardProvider>
        </AgentsProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
