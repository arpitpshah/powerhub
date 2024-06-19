import * as React from 'react';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';
import { useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { deleteUser, updateUser } from '../services/userApi';

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
  ) => void;
}

interface UserRow {
  id?: string;
  userId?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  emailId?:string,
  password?:string
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = Math.random().toString();
    setRows((oldRows) => [...oldRows, { id, name: '', age: '', isNew: true }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
  }

  return (
    <GridToolbarContainer>
    </GridToolbarContainer>
  );
}

const FullFeaturedCrudGrid: React.FC = () => {
  const [rows, setRows] = React.useState<GridRowsProp>([]);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://powerhubbackend.us-east-1.elasticbeanstalk.com/api/users/admin');
        const data: UserRow[] = await response.json();
        
        // Add a unique id to each row
        const rowsWithId = data.map((row) => ({ ...row, id: row.userId }));

        setRows(rowsWithId);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, []);

  const handleSnackbarClose = (
    event: React.SyntheticEvent<any, Event> | Event,
    reason: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };
  
  const handleAlertClose = (event: React.SyntheticEvent<Element, Event>) => {
    setSnackbarOpen(false);
  };

  const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleUpdateUser = async (editedUser: UserRow) => {
    try {
      const response = await updateUser(editedUser)
      setSnackbarMessage('User updated successfully!');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error updating user:', error);
      setSnackbarMessage('Failed to update user.');
      setSnackbarOpen(true);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await deleteUser(userId)
      setSnackbarMessage('User deleted successfully!');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error updating user:', error);
      setSnackbarMessage('Failed to delete user.');
      setSnackbarOpen(true);
    }
  };


  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => async () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => async() => {
    await handleDeleteUser(id.toString());
    setRows(rows.filter((row) => row.id !== id));
  };

  function isUserRow(row: any): row is UserRow {
    return 'userId' in row && 'firstName' in row && 'lastName' in row && 'role' in row;
  }

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = async (newRow: GridRowModel) => {
    if (isUserRow(newRow)) {
      const updatedRow = { ...newRow, isNew: false } as UserRow;
      await handleUpdateUser(updatedRow);
      setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    }
    return newRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
    { field: 'userId', headerName: 'User ID', width: 200, editable: true },
    { field: 'firstName', headerName: 'First Name', width: 150, editable: true },
    { field: 'lastName', headerName: 'Last Name', width: 150, editable: true },
    { field: 'role', headerName: 'Role', width: 170, editable: true },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
  
        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key={`save-${id}`}
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              key={`cancel-${id}`}
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }
  
        return [
          <GridActionsCellItem
            key={`edit-${id}`}
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            key={`delete-${id}`}
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];
  const getRowClassName = (params:any) => 
    `super-app-theme--${params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'}`;

  return (
    <Paper elevation={2} sx={{ height: 'auto', width: '100%', margin: 'auto', mt: 3, overflow: 'hidden' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          slots={{
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: { setRows, setRowModesModel },
          }}
          getRowClassName={getRowClassName}
          sx={{
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#e0e0e0',
              color: '#3f3f3f',
            },
            '& .MuiDataGrid-cell': {
              borderBottom: `1px solid #e0e0e0`,
            },
            '& .MuiDataGrid-row': {
              '&:nth-of-type(even)': {
                backgroundColor: 'rgba(245, 245, 245, 1)',
              },
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: `1px solid #e0e0e0`,
              bgcolor: '#f5f5f5',
            },
            '& .MuiButton-root': {
              margin: 1,
            },
          }}
          getRowId={(row) => row.userId}
        />
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleAlertClose} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      </Paper>
  );
};

export default FullFeaturedCrudGrid;
