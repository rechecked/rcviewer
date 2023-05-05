import { Fragment, useState } from 'react';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import LaunchIcon from '@mui/icons-material/Launch';

import { useDashboard } from '../../context/dashboard';
import RefreshRates from '../modals/RefreshRates';
import { buildApiURL } from '../../utils/network';

function DashboardSettingsButton() {

  const { dashboardAgent, setDashboardAgent } = useDashboard();

  const [refreshOpen, setRefreshOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(false);
  const open = Boolean(anchorEl);

  const handleOpen = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRefreshRates = () => {
    handleClose();
    setRefreshOpen(true);
  };

  const handleDisconnect = () => {
    setDashboardAgent({});
  };

  const url = buildApiURL(dashboardAgent, '', {
    pretty: 1
  });

  return (
    <Fragment>
      <IconButton
        aria-controls={open ? 'dashboard-settings-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleOpen}
      >
        <MoreVertOutlinedIcon />
      </IconButton>
      <Menu
        id="dashboard-settings-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem component={Link} href={url} target="_blank" rel="noopener noreferrer" underline="none">
          <ListItemText>
            Open status API in browser
          </ListItemText>
          <ListItemIcon sx={{ width: 20, ml: 1 }}>
            <LaunchIcon fontSize="small" />
          </ListItemIcon>
        </MenuItem>
        <MenuItem onClick={handleRefreshRates}>View refresh rates</MenuItem>
        <Divider />
        <MenuItem onClick={handleDisconnect}>Disconnect</MenuItem>
      </Menu>
      <RefreshRates open={refreshOpen} setOpen={setRefreshOpen} />
    </Fragment>
  );
}

export default DashboardSettingsButton;