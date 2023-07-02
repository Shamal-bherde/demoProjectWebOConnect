const {
  registerWithUpload,
    login,
    profile,
    deleteUser,
    editUser,
    fetchUser,
    logout,
    editUserUpload,
    displayUsers,
    editStatus,
  } = require("../controllers/authControllers");
  
  const router = require("express").Router();
  
  router.post("/api/register", registerWithUpload);
  router.post("/api/login", login);
  router.get("/api/profile", profile);
  router.post("/api/editUser/:id", editUserUpload);
  router.post("/api/editStatus/:id", editStatus);
  router.post("/api/deleteUser/:id" ,  deleteUser);
  router.get("/api/profile/:id", fetchUser);
  router.post("/api/logout" ,  logout);
  router.get("/api/allUsers", displayUsers);

  module.exports = router;
  