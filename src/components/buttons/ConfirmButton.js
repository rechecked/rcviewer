import { Fragment, useState } from 'react';

import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function ConfirmButton({ label, disabled, buttonLabel, title, description, onConfirm }) {

  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    setOpen(false);
    onConfirm && onConfirm();
  };

  return (
    <Fragment>
      <Button disabled={disabled ? disabled : false} color="secondary" onClick={() => setOpen(true)} startIcon={<DeleteIcon />}>{label}</Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {title && <DialogTitle id="alert-dialog-title">
          {title}
        </DialogTitle>}
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {description}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} autoFocus>Cancel</Button>
          <Button onClick={handleConfirm} color="secondary">
            {buttonLabel ? buttonLabel : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}

export default ConfirmButton;