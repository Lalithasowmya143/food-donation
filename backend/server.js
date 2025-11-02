const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'your-secret-key-change-in-production';

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection (Updated to Atlas)
mongoose.connect('mongodb+srv://Username:Password@free.4gsjckz.mongodb.net/fooddonation?appName=Free', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected to Atlas'))
.catch(err => console.log('MongoDB Error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, enum: ['donor', 'orphanage'], required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  organizationName: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Food Donation Schema
const donationSchema = new mongoose.Schema({
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  foodType: { type: String, required: true },
  quantity: { type: String, required: true },
  expiryTime: { type: String, required: true },
  pickupAddress: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['available', 'accepted', 'completed'], default: 'available' },
  acceptedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

const Donation = mongoose.model('Donation', donationSchema);

// Food Request Schema
const requestSchema = new mongoose.Schema({
  orphanageId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  foodType: { type: String, required: true },
  quantity: { type: String, required: true },
  urgency: { type: String, enum: ['low', 'medium', 'high'], required: true },
  description: String,
  status: { type: String, enum: ['pending', 'fulfilled', 'cancelled'], default: 'pending' },
  fulfilledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

const Request = mongoose.model('Request', requestSchema);

// Notification Schema
const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['donation_accepted', 'request_fulfilled'], required: true },
  contactDetails: {
    name: String,
    phone: String,
    address: String,
    email: String
  },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Notification = mongoose.model('Notification', notificationSchema);

// Feedback Schema
const feedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  userType: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

// Auth Middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // WARNING: This is NOT secure verification. See note below.
    const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Helper function to create simple JWT
// WARNING: This is NOT a secure JWT. See note below.
const createToken = (userId) => {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
  const payload = Buffer.from(JSON.stringify({ userId, exp: Date.now() + 86400000 })).toString('base64');
  return `${header}.${payload}.signature`; // This is not a real signature
};

// Routes

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, userType, phone, address, organizationName } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // You should hash the password here before saving
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password, // Should be hashedPassword
      userType,
      phone,
      address,
      organizationName
    });

    await user.save();

    const token = createToken(user._id);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        phone: user.phone,
        address: user.address,
        organizationName: user.organizationName
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    
    // You should compare the hashed password here
    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!user || !isMatch) { ... }

    if (!user || user.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = createToken(user._id);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        phone: user.phone,
        address: user.address,
        organizationName: user.organizationName
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get Profile
app.get('/api/auth/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update Profile
app.put('/api/auth/profile', authMiddleware, async (req, res) => {
  try {
    const { name, phone, address, organizationName } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, phone, address, organizationName },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create Donation (Donor)
app.post('/api/donations', authMiddleware, async (req, res) => {
  try {
    const { foodType, quantity, expiryTime, pickupAddress, description } = req.body;

    const donation = new Donation({
      donorId: req.userId,
      foodType,
      quantity,
      expiryTime,
      pickupAddress,
      description
    });

    await donation.save();
    res.status(201).json(donation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get All Available Donations (Orphanage)
app.get('/api/donations', authMiddleware, async (req, res) => {
  try {
    const donations = await Donation.find({ status: 'available' })
      .populate('donorId', 'name phone address email organizationName')
      .sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get My Donations (Donor)
app.get('/api/donations/my', authMiddleware, async (req, res) => {
  try {
    const donations = await Donation.find({ donorId: req.userId })
      .populate('acceptedBy', 'name phone address email organizationName')
      .sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Accept Donation (Orphanage)
app.put('/api/donations/:id/accept', authMiddleware, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    if (donation.status !== 'available') {
      return res.status(400).json({ message: 'Donation already accepted' });
    }

    donation.status = 'accepted';
    donation.acceptedBy = req.userId;
    await donation.save();

    const orphanage = await User.findById(req.userId);
    
    const notification = new Notification({
      userId: donation.donorId,
      message: `Your donation of ${donation.foodType} has been accepted!`,
      type: 'donation_accepted',
      contactDetails: {
        name: orphanage.organizationName || orphanage.name,
        phone: orphanage.phone,
        address: orphanage.address,
        email: orphanage.email
      }
    });

    await notification.save();

    const updatedDonation = await Donation.findById(req.params.id)
      .populate('acceptedBy', 'name phone address email organizationName');

    res.json(updatedDonation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create Request (Orphanage)
app.post('/api/requests', authMiddleware, async (req, res) => {
  try {
    const { foodType, quantity, urgency, description } = req.body;

    const request = new Request({
      orphanageId: req.userId,
      foodType,
      quantity,
      urgency,
      description
    });

    await request.save();
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get All Pending Requests (Donor)
app.get('/api/requests', authMiddleware, async (req, res) => {
  try {
    const requests = await Request.find({ status: 'pending' })
      .populate('orphanageId', 'name phone address email organizationName')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get My Requests (Orphanage)
app.get('/api/requests/my', authMiddleware, async (req, res) => {
  try {
    const requests = await Request.find({ orphanageId: req.userId })
      .populate('fulfilledBy', 'name phone address email organizationName')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Fulfill Request (Donor)
app.put('/api/requests/:id/fulfill', authMiddleware, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request already fulfilled' });
    }

    request.status = 'fulfilled';
    request.fulfilledBy = req.userId;
    await request.save();

    const donor = await User.findById(req.userId);
    
    const notification = new Notification({
      userId: request.orphanageId,
      message: `Your request for ${request.foodType} has been fulfilled!`,
      type: 'request_fulfilled',
      contactDetails: {
        name: donor.name,
        phone: donor.phone,
        address: donor.address,
        email: donor.email
      }
    });

    await notification.save();

    const updatedRequest = await Request.findById(req.params.id)
      .populate('fulfilledBy', 'name phone address email organizationName');

    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get Notifications
app.get('/api/notifications', authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.userId })
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark Notification as Read
app.put('/api/notifications/:id/read', authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit Feedback
app.post('/api/feedback', authMiddleware, async (req, res) => {
  try {
    const { rating, message } = req.body;
    
    const user = await User.findById(req.userId);
    
    const feedback = new Feedback({
      userId: req.userId,
      name: user.organizationName || user.name,
      email: user.email,
      userType: user.userType,
      rating,
      message
    });

    await feedback.save();
    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get All Feedback (public)
app.get('/api/feedback', async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get My Feedback
app.get('/api/feedback/my', authMiddleware, async (req, res) => {
  try {
    const feedback = await Feedback.find({ userId: req.userId })
      .sort({ createdAt: -1 });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});