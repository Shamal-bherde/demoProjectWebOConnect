import React, {useState} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {useNavigate} from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const defaultTheme = createTheme();

export default function Login() {
  
    const navigate = useNavigate();
    const [values, setValues] = useState({ email: '', password: '' })    
    
   const generateError = (error) =>
    toast.error(error, {
      position: "bottom-right",
    });

    const validateForm = () => {
      let isValid = true;
      const errors = {};
  
      if (!values.email) {
        isValid = false;
        errors.email = "Email is required";
      }
  
      if (!values.password) {
        isValid = false;
        errors.password = "Password is required";
      }
  
      if (!isValid) {
        generateError("Please fill the fields");
        console.log(errors);
      }
  
      return isValid;
    };
 
    const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {

      const  response  = await axios.post(
        "http://localhost:8081/api/login",
        {
          ...values,
        },
        { withCredentials: true }
      );

      const id = response.data[0].id;
      
      if(id !== undefined)
      {
       localStorage.getItem("user", JSON.stringify(id));
         
     
            
      navigate(`/Profile/${id}`);
      }
      else
      {
        console.log(response.data);
        generateError(response.data);
        navigate("/");
       
      }
    } catch (ex) {
      console.log(ex);
    
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>

          <ToastContainer />

          {/* <Box component="form"  noValidate sx={{ mt: 1 }}> */}
          <form  onSubmit={(e) => handleSubmit(e)}>    
            <TextField
              margin="normal"
             
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
             onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
            />
           <TextField
              margin="normal"
             
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
             onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
            />
           
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
             
              <Grid item>
                <Link href="/Register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            </form>
          {/* </Box> */}
       
        </Box>
       
      </Container>
    </ThemeProvider>
  );
}