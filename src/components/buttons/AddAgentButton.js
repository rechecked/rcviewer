import { useState } from 'react';

import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CheckIcon from '@mui/icons-material/Check';

import { useAgents } from '../../context/agents';

function AddAgentButton({ agent }) {

  const [added, setAdded] = useState(false);

  const { addAgent } = useAgents();

  const handleAddAgent = () => {
    addAgent(agent);
    setAdded(true);
  };

  return (
    <Tooltip title="Add agent">
      <IconButton onClick={handleAddAgent} aria-label="add agent">
        {added ? <CheckIcon /> : <AddOutlinedIcon />}
      </IconButton>
    </Tooltip>
  );
}

export default AddAgentButton;