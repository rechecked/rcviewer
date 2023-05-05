import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import TableCell from '@mui/material/TableCell';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

function SortTableHeader({ columns, order, orderBy, onRequestSort }) {

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {columns.map((col, index) => {
    
          // Only display sortable if column is sortable
          if (col.sortable) {
            return (
              <TableCell
                key={col.id ?? index}
                colSpan={col.colSpan ? col.colSpan : null}
                sortDirection={orderBy === col.id ? order : false}
              >
                <TableSortLabel
                  active={orderBy === col.id}
                  direction={orderBy === col.id ? order : 'asc'}
                  onClick={createSortHandler(col.id)}
                >
                  {col.tooltip ? (
                    <Tooltip placement="top" title={col.tooltip}>
                      <Typography variant="inherit">{col.label}</Typography>
                    </Tooltip>
                  ) : col.label}
                </TableSortLabel>
              </TableCell>
            );
          } else if (col.label) {
            return <TableCell colSpan={col.colSpan ? col.colSpan : null}
              key={col.id ?? col.label ?? index}>{col.label}</TableCell>;
          }

          return <TableCell key={col.id ?? index}></TableCell>;
        })}
      </TableRow>
    </TableHead>
  );
}

export default SortTableHeader;