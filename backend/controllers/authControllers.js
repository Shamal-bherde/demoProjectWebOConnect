const session = require('express-session');
const UserDetails = require('../model/UsersDetails');
const { uploadMiddleware } = require('../middleware/uploadMiddleware');

// Function to check if email already exists in the database
async function checkEmailExists(email) {
  const user = await UserDetails.findOne({ where: { email } });
  return user !== null;
}

module.exports.register = async (req, res) => {
  const { id, name, email, gender, phone, password, date } = req.body;
  const profilepic = req.file ? req.file.filename : 'profilepic';

  try {
    // Check if any required fields are missing
    if (!name || !email || !gender || !phone || !password || !profilepic || !date) {
      return res.status(400).send({ message: 'Missing required fields' });
    }

    // Check if the email already exists in the database
    const emailExists = await checkEmailExists(email);
    if (emailExists) {
      return res.status(409).send({ message: 'Email already exists' });
    }

    const response = await UserDetails.create({
                            id,
                            name,
                            email,
                            gender,
                            phone,
                            password,
                            profilepic,
                            date,
                            status: 'pending',
                          });

   return res.status(200).send(response);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
};

module.exports.registerWithUpload = [uploadMiddleware, module.exports.register];

module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if any required fields are missing
    if (!email || !password) {
      return res.status(400).send({ message: 'Missing required fields' });
    }

    const user = await UserDetails.findOne({ where: { email, password } });

    if (user) {
      req.session.userId = user.id;
      res.cookie('sessionId', req.session.id); // Set the session ID as a cookie
      res.status(200).send(user);
    } else {
      res.status(401).send({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports.fetchUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await UserDetails.findByPk(id);

    if (!user) {
      res.status(404).send({ message: 'User not found' });
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports.editUser = async (req, res) => {
  const id = req.params.id;

  try {
    const { name, email, phone, password } = req.body;

    const profilepic = req.file ? req.file.filename : 'profilepic';

    // Check if any required fields are missing
    if (!name || !email || !phone || !password || !profilepic) {
      return res.status(400).send({ message: 'Missing required fields' });
    }

    const user = await UserDetails.findByPk(id);

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    user.name = name;
    user.email = email;
    user.phone = phone;
    user.password = password;
    user.profilepic = profilepic;

    await user.save();

    res.status(200).send({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports.editUserUpload = [uploadMiddleware, module.exports.editUser];

module.exports.deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await UserDetails.findByPk(id);

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    await user.destroy();

    res.send({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports.editStatus = async (req, res) => {
  const id = req.params.id;

  try {
    
    const status = "active";

    // Update the status using Sequelize
    const [affectedRows] = await UserDetails.update({ status }, { where: { id } });

    if (affectedRows === 0) {
      return res.status(404).send({ message: "User not found" });
    }

    return res.status(200).send({ message: "Status updated successfully" });
  } catch (error) {
    return res.send({ message: error.message });
  }
};

module.exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      // Handle error if session couldn't be destroyed
      res.status(500).send({ error: 'An error occurred during logout' });
    } else {
      // Session destroyed successfully, respond with success message
      res.status(200).send({ message: 'Logout successful' });
    }
  });
};

module.exports.displayUsers = async (req, res) => {
  const { search, sort, page, limit } = req.query;

  try {
    let whereCondition = {};
    let order = [];

    // Searching
    if (search) {
      whereCondition = {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
        ],
      };
    }

    // Sorting
    if (sort) {
      const [column, orderDirection] = sort.split(':');
      order = [[column, orderDirection === 'desc' ? 'DESC' : 'ASC']];
    }

    // Pagination
    const offset = (page - 1) * limit;

    const { count, rows } = await UserDetails.findAndCountAll({
      where: whereCondition,
      order,
      offset,
      limit: parseInt(limit),
    });

    res.send({
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / parseInt(limit)),
      data: rows,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
