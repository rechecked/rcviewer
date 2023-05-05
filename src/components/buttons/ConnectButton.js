import { useNavigate } from 'react-router-dom';

import IconButton from '@mui/material/IconButton';
import PreviewOutlinedIcon from '@mui/icons-material/PreviewOutlined';
import Tooltip from '@mui/material/Tooltip';

import { useDashboard } from '../../context/dashboard';

function ConnectButton({ agent }) {

  const navigate = useNavigate();
  const { setDashboardAgent } = useDashboard();

  const connectToAgent = (agent) => {
    setDashboardAgent(agent);
    navigate('/dashboard');
  };

  return (
    <Tooltip placement="top" title="Connect and view dashboard">
      <IconButton onClick={() => connectToAgent(agent)} aria-label="connect to agent">
        <PreviewOutlinedIcon />
      </IconButton>
    </Tooltip>
    );
}

export default ConnectButton;