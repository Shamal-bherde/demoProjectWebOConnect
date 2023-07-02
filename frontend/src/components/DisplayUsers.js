import React, { useState, useEffect } from 'react';
import AppBar from "@mui/material/AppBar";
import { format } from 'date-fns';
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {  Modal } from "react-bootstrap";
import EditIcon from '@mui/icons-material/Edit';
import Paper from '@mui/material/Paper';
import { getUsers } from './GetUsers';
import { Avatar } from '@mui/material';
import axios from 'axios';
import Button from '@mui/material/Button';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DisplayUsers()  {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [showModal, setShowModal] = useState(false);
    const [editUserId, setEditUserId] = useState(null);
    const [editStatus, setEditStatus] = useState('');
    const [statusError, setStatusError] = useState('');

    const navigate = useNavigate(); 

 
    const generateError = (error) =>
    {
    toast.error(error?.response?.data?.message, {
        position: "bottom-right",
    });}
  
    const handleSearchChange = (e) => {
      setSearch(e.target.value);
    };
  
    const handleSortChange = (e) => {
      setSort(e.target.value);
    };
  
    const handlePageChange = (e) => {
      setPage(parseInt(e.target.value));
    };
  
    const handleLimitChange = (e) => {
      setLimit(parseInt(e.target.value));
    };

    useEffect(() => {
      fetchUsers();
    }, [search, sort, page, limit]);
  
    const fetchUsers = async () => {
      try {
        const response = await getUsers({ search, sort, page, limit });
      
        const usersArray = response.data;
        setUsers(usersArray);
      } catch (error) {
        console.error(error);
      }
    };

      const handleEdit = (user) => {
        setEditUserId(user.id);
        setEditStatus(user.status);
        setShowModal(true);
      };

         // Define a function to get the status color based on its value
    const getStatusColor = (status) => {
        switch (status) {
          case "active":
            return "green";
          case "pending":
            return "brown";
          case "deactive":
            return "red";
          default:
            return "black";
        }
      };
    
      const handleSubmit = async () => {
        if (editStatus.trim() === '') {
          setStatusError('Status is required');
          return;
        }
    
        try {
          const formData = new FormData();
          formData.append('status', editStatus);
    
          const response = await axios.post(
            `http://localhost:8081/api/editStatus/${editUserId}`,
            formData
          );
    
          console.log(response);
    
          alert('User Updated successfully.');
          toast(response.data.message, {
            theme: "dark",
            position: "bottom-right",
          });
    
          navigate(`/AllUsers`);
        } catch (error) {
          console.log('Error editing user.', error.message);
          generateError(error);
        }
    
        setShowModal(false);
      };
    
    return (
      <div>
        
        <AppBar position="static">
		<Toolbar>
        <Typography variant="h5"
			component="div" sx={{ flexGrow: 1 }}>
			WebOConnect Technologies
		</Typography>
		
		<Typography variant="h6"
			component="div" sx={{ flexGrow: 1 }}>
                     
            {/* Sort */}
            <select value={sort} onChange={handleSortChange}>
            <option value="" >Sort By</option>
            <option value="name:asc">Name (Ascending)</option>
            <option value="name:desc">Name (Descending)</option>
            <option value="email:asc">Email (Ascending)</option>
            <option value="email:desc">Email (Descending)</option>
            </select>
		</Typography>

        <Typography variant="h6"
			component="div" sx={{ flexGrow: 1 }}>
                
            {/* Pagination */}
            <div>
            <label>Page</label>
            <input type="number" value={page} onChange={handlePageChange} min="1" />
            </div>
            
        </Typography>
        <Typography variant="h6"
			component="div" sx={{ flexGrow: 1 }}>
         {/* Pagination */}
            <div>
            <label>Limit</label>
            <input type="number" value={limit} onChange={handleLimitChange} min="1" max="100" />
            </div>
  
        </Typography>

        
        {/* Search */}

        <input type="text" value={search} onChange={handleSearchChange} placeholder="Search" />  
		</Toolbar>

	    </AppBar>  

        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                <TableRow>
                <TableCell align="center"><b>Id</b></TableCell>
                    
                    <TableCell align="center"><b>Profile</b></TableCell>
                    <TableCell align="center"><b>Name</b></TableCell>
                    <TableCell align="center"><b>Email</b></TableCell>
                    <TableCell align="center"><b>Gender</b></TableCell>
                    <TableCell align="center"><b>Password</b></TableCell>
                    <TableCell align="center"><b>Date</b></TableCell>
                    <TableCell align="center"><b>Status</b></TableCell>
                    <TableCell align="center">
                    <b>  
                       Action
                        </b>
                    </TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {users && users.map((user) => (
              
                    <TableRow
                    key={user.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                    <TableCell align="center">{user.id}</TableCell>                   
                    
                    <TableCell align="center"><Avatar alt="Profile Pic" src={`http://localhost:3000/uploads/${user.profilepic}`} /></TableCell>
                    <TableCell align="center">{user.name}</TableCell>                   
                    <TableCell align="center">{user.email}</TableCell>
                    <TableCell align="center">{user.gender}</TableCell>
                    <TableCell align="center">{user.password}</TableCell>
                    <TableCell align="center"> {format(new Date(user.date), 'dd MMM yyyy')}</TableCell>   
                    <TableCell align="center" style={{
                color: getStatusColor(user.status),
                fontWeight: "bold",
              }}
              >{user.status}</TableCell>
                    <TableCell align="center">
                      
                        <Button color='secondary' onClick={() => handleEdit(user)}><EditIcon /></Button> 
                                              
                    </TableCell>
                    
                         {/* Confirmation Modal for Edit*/}
                        <Modal show={showModal && editUserId === user.id} onHide={() => setShowModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirm Edit</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <input
                            type='text'
                            id="status"
                            label="Status"
                            name="status"
                            autoComplete="family-name"
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value)}
                            error={statusError !== ''}
                            helperText={statusError}
                            />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Cancel
                            </Button>
                            <Button color="error" onClick={handleSubmit}>
                            Edit
                            </Button>
                        </Modal.Footer>
                        </Modal>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </TableContainer>
      </div>
    );
  }
  