import Alert from '@mui/material/Alert';

function ServicesWarning({ services }) {
  if (services) {
    if (services.length > 0 && services.filter(o => o.status !== 'stopped').length === 0) {
      return (
        <Alert severity="info" sx={{ mb: 3 }}>
          It looks like all your services are <b>stopped</b>, this generally means rcagent is not running with elevated permissions.
        </Alert>
      );
    } else if (services.length === 0) {
      return (
        <Alert severity="info" sx={{ mb: 3 }}>
          It looks like there are no services to display, this generally means rcagent is not running with elevated permissions.
        </Alert>
      );
    }
  }
}

export default ServicesWarning;