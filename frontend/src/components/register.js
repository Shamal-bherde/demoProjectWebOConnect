import React , {useState , useRef} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Select, MenuItem , InputLabel, FormControl } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ToastContainer, toast } from "react-toastify";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import img from "../images/User.png";


const defaultTheme = createTheme();

export default function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState("pending");

  const [profilePic, setProfilePic] = useState(img);
 
  const [message, setMessage] = useState('');

  const [nameError, setNameError] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [dateError, setDateError] = useState('');
  const [genderError, setGenderError] = useState('');

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
  };

  const generateError = (error) =>
  {
  toast.error(error?.response?.data?.message, {
    position: "bottom-right",
  });}

  const handleSubmit = async (event) => {
    event.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    const phoneRegex = /^\d{10}$/;

    setNameError('');
    setEmailError('');
    setPhoneError('');
    setPasswordError('');
    setDateError('');
    setGenderError('');

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

    if (date.trim() === '') {
      setDateError('Date is required');
      isValid = false;
    }

    if (gender.trim() === '') {
      setGenderError('Gender is required');
      isValid = false;
    }

    if (isValid)
    {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('gender', gender);
      formData.append('phone', phone);
      formData.append('password', password);
      formData.append('profilePic', profilePic);
      formData.append('date', date);
      formData.append('status', status);

      const responseData = await fetch('http://localhost:8081/api/register', {
        method: 'POST',
        body: formData,
       
      });

     try{
      const data = await responseData.json();
      console.log(data); 
      const id = data.id;
      console.log(id);
      localStorage.setItem("userId",id);
      navigate(`/Profile/${id}`);
     }
     catch{
      console.log("Check Record");
     }
    
  } catch (error) {
    console.log(error.message);
    setMessage('Error creating user.');
    generateError(error);  
  }
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
            Sign up
          </Typography>
          <br/>
          <ToastContainer />
          
          <form  encType='multipart/form-data' onSubmit={(e) => handleSubmit(e)}>
            
                <Grid container spacing={2}>
              
              <Grid item xs={12} >
                <TextField
                  
                  fullWidth
                  type='text'
                  id="name"
                  label="Name"
                  name="name"
                  autoComplete="family-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)} 
                  error={nameError !== ''}
                  helperText={nameError}
                  />
              </Grid>
           
              <Grid item xs={12} sm={6}>
              <FormControl sx={{minWidth:"100%"}}>
              <InputLabel id="gender-select-helper-label">Gender</InputLabel>

                <Select
                 fullWidth
              
                id="gender"
                value={gender}
                label="Gender"
                onChange={(e) => setGender(e.target.value)}
                error={genderError !== ''}
                helperText={genderError}
              >
            
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
              </FormControl>
            
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  
                  fullWidth
                  type='tel'
                  id="phone"
                  label="Phone Number"
                  name="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)} 
                  error={phoneError !== ''}
                  helperText={phoneError}
                  />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  
                  fullWidth
                  type='email'
                  id="email"
                  label="Email Address"
                  name="email"
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
                  name="password"
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
             
              <Grid item xs={12} >
                <TextField
                  
                  fullWidth
                  type='date'
                  id="date" 
                  name="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)} 
                  error={dateError !== ''}
                  helperText={dateError}
                  />
              </Grid>
              <Grid item xs={12} >
                <TextField
                  
                  fullWidth
              
                  id="profilePic"
                  name="profilePic"
                  type="file" accept="image/*" onChange={handleProfilePicChange}
                />
                    </Grid>
                <Grid item xs={12} >

                  {profilePic && <Avatar src={JSON.stringify(profilePic)=== JSON.stringify(img) ? img : window.URL.createObjectURL(profilePic)} alt="Profile Preview" style={{ width: "100px" , height: "100px"}}/>}
              </Grid>
              
              <Grid item xs={12} >
                <TextField
                  
                  fullWidth
                  type='text'
                  id="status"
                  name="status"
                  value={status}
                  onChange={(e) => setDate(e.target.value)} />
               
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className='btn btn-primary'
              sx={{ mt: 3, mb: 2 }}
              
            >
              Sign Up
            </Button>
            </form>
 
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
           
        </Box>
      
      </Container>
    </ThemeProvider>
  );
}