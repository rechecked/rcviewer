import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';

function LoadingCircle() {
  return (
    <Grid container alignItems="center" justifyContent="center" spacing={4}>
      <Grid item>
        <CircularProgress color="secondary" />
      </Grid>
    </Grid>
  );
}

export default LoadingCircle;