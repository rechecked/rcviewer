import { Fragment, useState } from 'react';
import moment from 'moment';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Alert from '@mui/material/Alert';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import ImportExportIcon from '@mui/icons-material/ImportExport';

import { useAgents } from '../../context/agents';

const downloadFile = ({ data, fileName, fileType }) => {
  const blob = new Blob([data], { type: fileType });
  const a = document.createElement('a');
  a.download = fileName;
  a.href = window.URL.createObjectURL(blob);
  const clickEvt = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  a.dispatchEvent(clickEvt);
  a.remove();
};

function ImportExport() {

  const { agents, importAgents } = useAgents();

  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileUpload = (e) => {
    setError('');
    setSuccess('');
    if (e.target.files.length === 0) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = e => {
      try {
        // Try to import the agents if the JSON is valid
        const imported = JSON.parse(e.target.result);
        const [total, errors] = importAgents(imported);
        if (errors === 0) {
          setSuccess(`Sucess! Imported ${total} agents.`);
        } else {
          setSuccess(`Imported ${total - errors} agents with ${errors} failures.`);
        }
      } catch (e) {
        setError('File was not valid JSON. Verify the file you are uploading.');
      }
    };
    // Reset the file input
    e.target.value = '';
  };

  const exportToJSON = () => {
    downloadFile({
      data: JSON.stringify(agents.stored),
      fileName: 'rcviewer-agents-'+moment().format("MM-DD-YYYY")+'.json',
      fileType: 'text/json',
    });
  };

  const handleClose = () => {
    setOpen(false);
    setError('');
    setSuccess('');
  };

  return (
    <Fragment>
      <Button color="secondary" onClick={() => setOpen(true)} startIcon={<ImportExportIcon />}>Import/Export</Button>
      <Dialog fullWidth maxWidth="md" open={open} onClose={handleClose}>
        <DialogTitle>Import/Export Agents</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ marginBottom: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ marginBottom: 2 }}>{success}</Alert>}
          <DialogContentText sx={{ marginBottom: 1 }}>
            Import agents from an exported json file. All valid agents in the file will be imported. If an agent already exists it will be overwritten by the one from the imported file.
          </DialogContentText>
          <Button color="secondary" component="label" startIcon={<UploadIcon />}>
            Upload JSON File
            <input hidden accept="application/JSON" type="file" onChange={handleFileUpload} />
          </Button>
          <DialogContentText sx={{ marginTop: 3, marginBottom: 1 }}>
            You can export all the agents stored to take with you to another browser or to use for a backup. Note that agent tokens are not encrypted and are plain text in the exported file.
          </DialogContentText>
          <Button color="secondary" onClick={exportToJSON} startIcon={<DownloadIcon />}>Download</Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}

export default ImportExport;