import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindows, faLinux, faApple } from '@fortawesome/free-brands-svg-icons';

import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';

import SearchIcon from '@mui/icons-material/Search';

import { useDashboard } from '../context/dashboard';
import { useAgents } from '../context/agents';

const SearchBox = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 1),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(3)})`,
    //transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

function Search() {

  const [inputValue, setInputValue] = useState('');

  const navigate = useNavigate();
  const { setDashboardAgent } = useDashboard();
  const { agents } = useAgents();

  const connectToAgent = (agent) => {
    setDashboardAgent(agent);
    navigate('/dashboard');
  };

  const getIcon = (os) => {
    switch (os) {
      case 'Windows':
        return <FontAwesomeIcon icon={faWindows} />;
      case 'Linux':
        return <FontAwesomeIcon icon={faLinux} />;
      case 'Darwin':
        return <FontAwesomeIcon icon={faApple} />;
      default:
        return null;
    }
  };

  return (
    <SearchBox>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <Autocomplete
        id="search-agents"
        options={agents.stored?.map(a => { return { label: a.hostname, os: a.os ? a.os : '' }; })}
        noOptionsText="No agents"
        autoHighlight
        value={null}
        inputValue={inputValue}
        onInputChange={(e, val) => {
          setInputValue(val);
        }}
        onChange={(e, val) => {
          const agent = agents.stored.filter(a => a.hostname === val.label);
          if (agent.length === 1) {
            setInputValue('');
            connectToAgent(agent[0]);
          }
        }}
        renderInput={(params) => (
          <StyledInputBase
            inputRef={params.InputProps.ref}
            placeholder="Search agents..."
            inputProps={{ 'aria-label': 'search', ...params.inputProps }}
          />
        )}
        renderOption={(props, option) => (
          <Box component="li" {...props}>
            {option.os && (<Box sx={{ mr: 2}}>{getIcon(option.os)}</Box>)}
            {option.label}
          </Box>
        )}
      />
    </SearchBox>
  );
}

export default Search;