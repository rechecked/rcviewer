import { Fragment } from 'react';

import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';

import LoadingCircle from './layout/LoadingCircle';

function PluginOutput({ loading, checkData }) {
  const { output, longoutput, exitcode, perfdata } = checkData;

  let fmtOutput = `${output}`;
  if (longoutput) {
    fmtOutput += `\n${longoutput}`;
  }
  if (perfdata) {
    fmtOutput += ` | ${perfdata}`;
  }

  return (
    <Fragment>
      {loading || (output !== undefined && output !== null && exitcode !== null) ? (
        <Card variant="outlined" sx={{ marginTop: 2 }}>
          {loading ? <Box sx={{ padding: 2 }}><LoadingCircle /></Box> : (
            <Fragment>
              <Box sx={{ padding: '10px 15px' }}>
                {fmtOutput ? <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{fmtOutput}</pre> : <Typography sx={{ color: 'grey.400' }} variant="body1">No plugin output</Typography>}
              </Box>
              <StatusReturnedAlert exitCode={exitcode} />
            </Fragment>
          )}
        </Card>
      ) : null}
    </Fragment>
  );
}

function StatusReturnedAlert({ exitCode }) {
  
  if (exitCode === undefined || exitCode === null) {
    return null;
  }

  let status = '';
  let severity = '';
  switch (exitCode) {
    case 0:
      status = 'OK';
      severity = 'success';
      break;
    case 1:
      status = 'WARNING';
      severity = 'warning';
      break;
    case 2:
      status = 'CRITICAL';
      severity = 'error';
      break;
    default:
      status = 'UNKNOWN';
      severity = 'info';
      break;
  }

  return (
    <Alert severity={severity}>
      {status} - Return code was {exitCode}
    </Alert>
  );
}

export default PluginOutput;