import React , {useState, useEffect} from "react";
import { Link , useParams, useNavigate, Navigate} from "react-router-dom";
import "./sidebar.css";import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Avatar,
  Button,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {  Modal } from "react-bootstrap";
import Header from "./Header";
import './MyProfile.css';
import axios from "axios";

export default function MyProfile() {

  const navigate = useNavigate();
  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);
  const [showModal, setShowModal] = useState(false);

  const { id } = useParams(); // Access the userID from the route parameter

  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    fetchUserDetails(id);
  }, [id]);

  const fetchUserDetails = async (id) => {
    try {
      const response = await fetch(`http://localhost:8081/api/profile/${id}`);

      if (response.ok) {
        
      const user = await response.json();

      // Convert the date to a human-readable form
      user.date = new Date(user.date).toLocaleDateString();
       setUserDetails(user);
    
        toast(`See Your Profile 🦄`, {
          theme: "dark",
          position: "bottom-right",
        });
        
      } else {
        console.error("Error fetching user details:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  if (!userDetails) {
    return <div>Record Not Exists</div>;
  }

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

    
  const deleteUser = async () => {
    try {
      const response = await axios.post(`http://localhost:8081/api/deleteUser/${id}`);

      console.log(response.data.message);
      if (response.ok) 
        toast(`User deleted successfully.`, {
          theme: "dark",
          position: "bottom-right",
        });
        navigate("/"); // Redirect to home page after successful deletion
      
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleDelete = () => {
    // Call the deleteUser API function here
    
    deleteUser(id)
      .then(() => {
            alert("User Deleted Successfully");
      });
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
        <li><Link to="/">Logout</Link></li>
        <li><Link onClick={() => setShowModal(true)} >Delete Account</Link></li>
        
      </ul>
    </nav>
    <div className="card-container">
        <Card sx={{ maxWidth: 345 }} className="profile-card">
          <CardHeader
            avatar={
              <Avatar
                alt="Profile Pic"
                width = "70"
                height = "70"
                src={`http://localhost:3000/uploads/${userDetails.profilepic}`}
              />
            }
            title={userDetails.name}
            subheader={userDetails.email}
          />
          <CardMedia
          sx={{ height: 200 }}
            component="img"
            alt="Profile Pic"
            image={`http://localhost:3000/uploads/${userDetails.profilepic}`}
          />
          <CardContent>
            <Typography variant="body2" component="div">
              <strong>ID:</strong> {userDetails.id}
            </Typography>
            <br/>
            <Typography variant="body2" component="div">
              <strong>Gender:</strong> {userDetails.gender}
            </Typography>
            <br/>
            <Typography variant="body2" component="div">
              <strong>Phone:</strong> {userDetails.phone}
            </Typography>
            <br/>
            <Typography variant="body2" component="div">
              <strong>Date:</strong> {userDetails.date}
            </Typography>
            <br/>
            <Typography variant="body2" component="div"   
              style={{
                color: getStatusColor(userDetails.status),
                fontWeight: "bold",
              }}>
              <strong>Status:</strong> {userDetails.status}
            </Typography>
            <br/>
          </CardContent>
          <CardActions>
            <Link to={`/Edit/${id}`} ><Button color="primary">Edit Profile</Button></Link>
            <Button size="small"  color="error" onClick={() => setShowModal(true)} >
              Delete Account
            </Button>

             {/* Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete your account?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button color="error" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
          </CardActions>
        </Card>
      </div>
    </>
);
}
