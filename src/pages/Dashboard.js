import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import moment from 'moment';
import { compareVersions } from 'compare-versions';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import Tooltip from '@mui/material/Tooltip';

import Page from '../components/layout/Page';
import Gauge from '../components/charts/Gauge';
import { MemoryTable, ServicesList, ProcessesList,
  UsersList, PluginsList, DiskList, NetworkList, APIViewer } from '../components/dashboard';
import { useAgent, useAgentOverview } from '../hooks/useAgent';
import { useDashboard } from '../context/dashboard';
import { useAgents } from '../context/agents';
import { isEmpty, ucFirst, platformName } from '../utils/common';
import { DashboardSettingsButton, ExampleCheckButton } from '../components/buttons';

function Dashboard() {
  const { dashboardAgent } = useDashboard();
  const { editAgent } = useAgents();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [upgrade, setUpgrade] = useState(false);

  // Get data for the dashboard
  const { isInitialLoading, failureCount, data: systemInfo } = useAgent(dashboardAgent);
  const { isInitialLoading: overviewIsLoading, data: overview } = useAgentOverview(dashboardAgent);

  // Verify we have agent info or redirect
  useEffect(() => {
    if (isEmpty(dashboardAgent)) {
      navigate('/');
    }
  }, [dashboardAgent, navigate]);

  useEffect(() => {
    async function checkVersion() {
      const resp = await fetch("https://api.rechecked.io/versions?product=rcagent");
      const data = await resp.json();
      if (systemInfo?.version && compareVersions(systemInfo.version, data.latest) === -1) {
        setUpgrade(true);
      }
    }
    if (systemInfo) {
      checkVersion();
    }
  }, [systemInfo]);

  // Update agent information about version, os, etc in stored agents if it exists
  useEffect(() => {
    if (systemInfo?.version) {
      let newAgent = dashboardAgent;
      newAgent.os = ucFirst(systemInfo.os);
      newAgent.platform = platformName(systemInfo.platform);
      newAgent.version = systemInfo.version;
      editAgent(newAgent);
    }
  }, [systemInfo, dashboardAgent]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTabSelect = (e, tabVal) => {
    setSearchParams({ tab: tabVal });
  }

  const agentUrl = `${dashboardAgent.protocol}//${dashboardAgent.hostname}:${dashboardAgent.port}`;

  return (
    <Page>
      {isInitialLoading || isEmpty(systemInfo) || failureCount > 0 ? (
        <Grid container alignItems="center" justifyContent="center" spacing={4}>
          <Grid item>
            {failureCount > 0 ? (
              <Alert severity="error">
                <AlertTitle>Could not connect to <Link color="inherit" href={agentUrl} target="_blank" rel="noopener noreferrer">{dashboardAgent.hostname}</Link></AlertTitle>
                There are a few reasons that this could happen:
                <ul style={{ margin: 0, padding: '5px 25px' }}>
                  <li>No rcagent running on the host</li>
                  <li>You are using a self-signed SSL certificate and need to re-approve the exception</li>
                  <li>If you are using an IP address the host IP may have changed</li>
                </ul>
              </Alert>
            ) : <CircularProgress color="secondary" />}
          </Grid>
        </Grid>
      ) : systemInfo.status === "error" ? <Alert severity="error">{systemInfo.message}</Alert> : (
        <Grid container alignItems="start" justifyContent="space-between" spacing={4}>
          <Grid item>
            <Stack direction="row" spacing={4}>
              <Box>
                <Typography variant="overline">Hostname</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{systemInfo.hostname}</Typography>
                {dashboardAgent.hostname !== systemInfo.hostname && <Typography variant="body1" sx={{ fontSize: 12 }}>{dashboardAgent.hostname}</Typography>}
              </Box>
              <Box>
                <Typography variant="overline">Operating System</Typography>
                <Typography variant="body1">{systemInfo.os && ucFirst(systemInfo.os)}</Typography>
                <Typography variant="body1" sx={{ fontSize: 12 }}>{platformName(systemInfo.platform)} {systemInfo.os === "linux" ? systemInfo.platformVersion : null}</Typography>
              </Box>
              <Box>
                <Typography variant="overline">Uptime</Typography>
                <Tooltip title={moment(systemInfo.bootTime*1000).format('LLLL')}>
                  <Typography variant="body1">{moment.duration(systemInfo.uptime, 'seconds').humanize()}</Typography>
                </Tooltip>
              </Box>
            </Stack>
          </Grid>
          <Grid item>
            <Stack direction="row" spacing={4}>
              <Box>
                <Typography variant="overline">Agent Version</Typography>
                <Typography variant="body1">{systemInfo.version}</Typography>
                {upgrade && <Typography variant="body1" sx={{ fontSize: 12, color: 'red' }}>Update available</Typography>}
              </Box>
              <Box>
                <DashboardSettingsButton />
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <TabContext value={searchParams.get('tab') ?? 'overview'}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', justifyContent: 'space-between', display: 'flex' }}>
                <Tabs
                  value={searchParams.get('tab') ?? 'overview'}
                  onChange={handleTabSelect}
                  variant="scrollable"
                  scrollButtons="auto"
                  aria-label="dashboard component tabs"
                >
                  <Tab label="Overview" value="overview" />
                  <Tab label="Disk" value="disk" />
                  <Tab label="Network" value="network" />
                  <Tab label={<div>Processes</div>} value="processes" />
                  <Tab label="Services" value="services" />
                  <Tab label="Users" value="users" />
                  <Tab label="Plugins" value="plugins" />
                  <Tab label="API Viewer" value="api" />
                </Tabs>
              </Box>
              <TabPanel sx={{ p: 0, pt: 3 }} value="overview">
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6} lg={4}>
                    <Box sx={{ height: 150 }}>
                      <Gauge label="CPU" value={overviewIsLoading ? null : overview.cpu?.percent[0]} />
                    </Box>
                    <Stack direction="column" alignItems="center" spacing={2}> 
                      <ExampleCheckButton size="small" variant="outlined" type="cpu/percent" />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <Box sx={{ height: 150 }}>
                      <Gauge label="Memory" value={overviewIsLoading ? null : overview.mem?.usedPercent} />
                    </Box>
                    <Stack direction="column" alignItems="center" spacing={2}>
                      <Box sx={{ width: '100%' }}>
                        <MemoryTable os={systemInfo.os} mem={overviewIsLoading ? null : overview.mem} />
                      </Box>
                      <ExampleCheckButton size="small" variant="outlined" type="memory/virtual" />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <Box sx={{ height: 150 }}>
                      <Gauge label="Swap" value={overviewIsLoading ? null : overview.swap?.usedPercent} />
                    </Box>
                    <Stack direction="column" alignItems="center" spacing={2}>
                      <Box sx={{ width: '100%' }}>
                        <MemoryTable os={systemInfo.os} mem={overviewIsLoading ? null : overview.swap} />
                      </Box>
                      <ExampleCheckButton size="small" variant="outlined" type="memory/swap" />
                    </Stack>
                  </Grid>
                </Grid>
              </TabPanel>
              <TabPanel sx={{ p: 0, pt: 3 }} value="disk">
                <DiskList agent={dashboardAgent} />
              </TabPanel>
              <TabPanel sx={{ p: 0, pt: 3 }} value="network">
                <NetworkList agent={dashboardAgent} />
              </TabPanel>
              <TabPanel sx={{ p: 0, pt: 3 }} value="processes">
                <ProcessesList agent={dashboardAgent} />
              </TabPanel>
              <TabPanel sx={{ p: 0, pt: 3 }} value="services">
                <ServicesList agent={dashboardAgent} />
              </TabPanel>
              <TabPanel sx={{ p: 0, pt: 3 }} value="users">
                <UsersList agent={dashboardAgent} os={systemInfo.os} />
              </TabPanel>
              <TabPanel sx={{ p: 0, pt: 3 }} value="plugins">
                <PluginsList agent={dashboardAgent} />
              </TabPanel>
              <TabPanel sx={{ p: 0, pt: 3 }} value="api">
                <APIViewer agent={dashboardAgent} />
              </TabPanel>
            </TabContext>
          </Grid>
        </Grid>
      )}
    </Page>
  );
}

export default Dashboard;