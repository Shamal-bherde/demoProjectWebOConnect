import React , {useState, useEffect} from "react";
import { Link , useParams, useNavigate} from "react-router-dom";
import "./sidebar.css";import {
 
  Typography,
  Avatar,
  Button,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header";
import './MyProfile.css';
import axios from "axios";
import img from "../images/User.png";


const defaultTheme = createTheme();


 export default function EditProfile() {

  const navigate = useNavigate();
  const { id } = useParams();
  const [userId, setUserId] = useState(id);
  

  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);
  const [showModal, setShowModal] = useState(false);

   const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const [profilePic, setProfilePic] = useState(img);

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [phoneError, setPhoneError] = useState('');


  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
  };

  const generateError = (error) =>
  {
  toast.error(error?.response?.data?.message, {
    position: "bottom-right",
  });}

  const handleSubmit = async (e) => {
    e.preventDefault();
   
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    const phoneRegex = /^\d{10}$/;

    setNameError('');
    setEmailError('');
    setPhoneError('');
    setPasswordError('');

    let isValid = true;

    if (name.trim() === '') {
      setNameError('Name is required');
      isValid = false;
    }

    if (email.trim() === '') {
      setEmailError('Email is required');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Invalid email address');
      isValid = false;
    }

    if (password.trim() === '') {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password should be at least 6 characters long');
      isValid = false;
    }

    if (phone.trim() === '') {
      setPhoneError('Phone number is required');
      isValid = false;
    } else if (!phoneRegex.test(phone)) {
      setPhoneError('Invalid phone number');
      isValid = false;
    }
  
    try {
      
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('password', password);
      formData.append('profilePic', profilePic);

      console.log(formData,"FORM");
      
      const response = await axios.post(`http://localhost:8081/api/editUser/${userId}`, formData ,  {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log(response);

      const id = response.data.insertId ; 
      localStorage.setItem("user", JSON.stringify(response.data.insertId));
         
      alert('User Updated successfully.');
      toast(`response.data.message 🦄`, {
        theme: "dark",
        position: "bottom-right",
      });

      navigate(`/Profile/${userId}`);

    } catch (error) {
      console.log('Error creating user.',error.message);
      generateError(error);
    }
  };

 
return (
    <>
    <Header />
    
    <ToastContainer />

    <nav className={sidebar ? "sidebar active" : "sidebar"}>
      <button className="hamburger" type="button" onClick={showSidebar}>
        <div></div>
      </button>
      <ul onClick={showSidebar}>
       
        <li><Link >WebOConnect Technologies</Link></li>
        
        <li><Link to={`/Profile/${id}`}>My Profile</Link></li>
        <li><Link to={`/Edit/${id}`}>Edit Profile</Link></li>
          
      </ul>
    </nav>
    <div className="card-container">
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
         
          <Typography component="h1" variant="h5">
           Edit Details
          </Typography>
          <br/>
          <ToastContainer />
          
          <form encType="multipart/form-data" onSubmit={handleSubmit}>
  <Grid container spacing={2}>
    <Grid item xs={12}>
      <TextField
        fullWidth
        type="text"
        id="name"
        label="Name"
        name="name" // Updated name attribute
        autoComplete="family-name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={nameError !== ''}
        helperText={nameError}
      />
    </Grid>

    <Grid item xs={12}>
      <TextField
        fullWidth
        type="tel"
        id="phone"
        label="Phone Number"
        name="phone" // Updated name attribute
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        error={phoneError !== ''}
        helperText={phoneError}
      />
    </Grid>

    <Grid item xs={12}>
      <TextField
        fullWidth
        type="email"
        id="email"
        label="Email Address"
        name="email" // Updated name attribute
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={emailError !== ''}
        helperText={emailError}
      />
    </Grid>

    <Grid item xs={12}>
      <TextField
        fullWidth
        name="password" // Updated name attribute
        label="Password"
        type="password"
        id="password"
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={passwordError !== ''}
        helperText={passwordError}
      />
    </Grid>

    <Grid item xs={12}>
      <TextField
        fullWidth
        id="profilePic"
        name="profilepic" // Updated name attribute
        type="file"
        accept="image/*"
        onChange={handleProfilePicChange}
      />
    </Grid>

    <Grid item xs={12}>
      {profilePic && (
        <Avatar
          src={
            JSON.stringify(profilePic) === JSON.stringify(img)
              ? img
              : window.URL.createObjectURL(profilePic)
          }
          alt="Profile Preview"
          style={{ width: '100px', height: '100px' }}
        />
      )}
    </Grid>
  </Grid>
  <Button
    type="submit"
    fullWidth
    variant="contained"
    sx={{ mt: 3, mb: 2 }}
  >
    Edit Profile
  </Button>
</form>

 
            
           
        </Box>
      
      </Container>
    </ThemeProvider>
           
      </div>
    </>
);
}
