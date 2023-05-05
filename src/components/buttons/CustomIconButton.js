import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function CustomIconButton({ type, onClick }) {

  let icon = '';
  switch (type) {
    default:
    case 'delete':
      icon = <DeleteIcon />;
      break;
    case 'edit':
      icon = <EditIcon />;
      break;
  }

  return (
    <IconButton onClick={onClick ? onClick : null} aria-label={type + ' button'}>
      {icon}
    </IconButton>
  );
}

export default CustomIconButton;