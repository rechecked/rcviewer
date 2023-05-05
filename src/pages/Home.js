import { useNavigate } from "react-router-dom";

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';

import Page from '../components/layout/Page';
import Connect from '../components/modals/Connect';
import RecentAgents from '../components/RecentAgents';
import AddAgentsButton from '../components/buttons/AddAgentsButton';
import { useDashboard } from '../context/dashboard';
import { isEmpty } from '../utils/common';

function Home() {

  const { dashboardAgent, setDashboardAgent } = useDashboard();
  const navigate = useNavigate();

  const clearAgent = () => {
    setDashboardAgent({});
  };

  return (
    <Page>
      <Grid container justifyContent="center" alignItems="stretch" spacing={5}>
        {!isEmpty(dashboardAgent) && (
          <Grid item xs={12}>
            <Alert variant="outlined" severity="info" action={(
              <Stack direction="row" spacing={2}>
                <Button size="small" color="inherit" onClick={() => navigate("/dashboard")}>View Dashboard</Button>
                <Button size="small" color="inherit" onClick={clearAgent}>Close</Button>
              </Stack>
            )}>
              <Stack spacing={2} direction="row" justifyContent="flex-start" alignItems="center">
                You are currently connected to rcagent on &nbsp; <code>{dashboardAgent.hostname+":"+dashboardAgent.port}</code>
              </Stack>
            </Alert>
          </Grid>
        )}
        <Grid item xs={12} sm={12} md={6}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" component="div">Agent Dashboard</Typography>
              <Typography variant="body2">You can connect and view the dashboard for an individual rcagent as long as your browser can connect to it's address or hostname.</Typography>
            </CardContent>
            <CardActions>
              <Connect />
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flex: 1 }}>
              <Typography variant="h6" component="div">Manage Agents</Typography>
              <Typography variant="body2">Add and remove the agents stored in rcviewer. The agent data, including the token, is stored in your local browser's storage.</Typography>
            </CardContent>
            <CardActions>
              <AddAgentsButton />
              <Button color="secondary" onClick={() => navigate('/agents')}>View Agents</Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <RecentAgents />
        </Grid>
      </Grid>
    </Page>
  );
}

export default Home;