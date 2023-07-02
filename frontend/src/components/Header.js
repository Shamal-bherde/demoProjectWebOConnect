import * as React from "react";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Header() {

	const navigate = useNavigate();

	const logout = async () => {
		try {
			const  response  = await axios.post(
				"http://localhost:8081/api/logout",
				{ withCredentials: true }
			);
	
		  if (response) {
			// Logout successful, do any necessary cleanup or show success message
			console.log('Logout successful');
			navigate('/');
			
		  }
		} catch (error) {
		  // Handle error if an exception occurs
		  console.error('Logout error:', error);
		}
	  };
	
return (
	<AppBar position="static">
		<Toolbar>
        <Typography variant="h2"
			component="div" sx={{ flexGrow: 1 }}>
			
		</Typography>
		
		
		<Typography variant="h6"
			component="div" sx={{ flexGrow: 1 }}>
			WebOConnect Technologies
		</Typography>
		<Button color="inherit" onClick={logout}> Logout</Button>
       
		</Toolbar>
	</AppBar>
);
}
