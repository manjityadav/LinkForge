import User from "../models/user.model.js";
import Profile from '../models/profile.model.js'
import Connection from "../models/connections.model.js"; 
import bcrypt from "bcrypt";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import fs from "fs";

const convertuserDataToPDF = async (userData) => {

  const doc = new PDFDocument();

  const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
  const stream = fs.createWriteStream("uploads/" + outputPath);

  doc.pipe(stream);

  /* IMAGE SAFE LOAD */

  try {

    const imagePath = `uploads/${userData.userId.profilePicture}`;

    if (fs.existsSync(imagePath)) {
      doc.image(imagePath, { width: 100, align: "center" });
    }

  } catch (err) {
    console.log("Image skipped:", err.message);
  }

  doc.moveDown();

  doc.fontSize(14).text(`Name: ${userData.userId.name}`);
  doc.fontSize(14).text(`Username: ${userData.userId.username}`);
  doc.fontSize(14).text(`Email: ${userData.userId.email}`);
  doc.fontSize(14).text(`Bio: ${userData.bio}`);

  doc.moveDown();

  doc.fontSize(16).text("Experience:");

  if (userData.experience?.length > 0) {
    userData.experience.forEach((work, index) => {
      doc.text(`${index + 1}. ${work.role} - ${work.company} (${work.duration})`);
    });
  }

  doc.moveDown();

  doc.fontSize(16).text("Education:");

  if (userData.education?.length > 0) {
    userData.education.forEach((edu, index) => {
      doc.text(`${index + 1}. ${edu.degree} - ${edu.college} (${edu.year})`);
    });
  }

  doc.end();

  return outputPath;
};

export const register = async (req, res) => {
  try {
    console.log("REGISTER HIT");
    const { name, email, username, password } = req.body;

    if (!name || !email || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      username,
      password: hashedPassword,
    });

    await newUser.save();

    console.log(newUser)

    const newProfile = new Profile({
      userId: newUser._id,
    });

    await newProfile.save();

    return res.json({ message: "User created successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    await User.updateOne({ _id: user._id }, { token });

    res.json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
export const uploadProfilePicture = async (req, res) => {
  const { token } = req.body;

  try {
     console.log("FILE:", req.file);
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    user.profilePicture = req.file.filename;

    await user.save();

    return res.status(200).json({
      message: "Profile picture updated",
      profilePicture: req.file.filename
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { token, ...newUserData } = req.body;

    const user = await User.findOne({ token });

    if (!user) return res.status(404).json({ message: "user not found" });

    const { username, email } = newUserData;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      if (existingUser || String(existingUser._id) !== String(user._id)) {
        return res.status(400).json({ message: "User already taken" });
      }
    }

    Object.assign(user, newUserData);

    await user.save();

    return res.json({ message: "user updated" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getUserAndProfile = async (req, res) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({ token: token });

    if (!user) {
      return res.json({ message: "user not found" });
    }

    const userProfile = await Profile
      .findOne({ userId: user._id })
      .populate("userId", "name email username profilePicture");


    return res.json(userProfile);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const updateProfileData = async (req, res) => {
  try {
    const { token, ...userProfileData } = req.body;
    const userProfile = await User.findOne({ token });

    if (!userProfile) {
      return res.json({ message: "user not found" });
    }

    const profile = await Profile.findOne({ userId: userProfile._id });

    Object.assign(profile, userProfileData);

    await profile.save();

    return res.json({ message: "profile updated" });
  } catch (err) {
    return res.json({ message: err.message });
  }
};

export const getAllUserProfile = async (req, res) => {
  try {
    const profiles = await Profile
      .find()
      .populate("userId", "email username name email profilePicture");
    return res.json(profiles);
  } catch (err) {
    return res.json({ message: err.message });
  }
};

export const downloadProfile = async (req, res) => {
  try {
    const user_id = req.query.id;

    const userProfile = await Profile
      .findOne({ userId: user_id })
      .populate("userId", "email username name profilePicture");

    let outputPath = await convertuserDataToPDF(userProfile);

    return res.json({ message: outputPath });
  } catch (err) {
    return res.json({ message: err.message });
  }
};

export const sendConnectionRequest=async(req,res)=>{
  const{token,connectionId}=req.body;

  try{

    const user=await User.findOne({token})
    if(!user){
      res.status(404).json({message:"user not found"})
    }

    const connectionUser=await User.findOne({_id:connectionId})
    if(!connectionUser){
      return res.status(404).json({message:"connection not found"})
    }

    const existingUser=await Connection.findOne({
      userId:user._id,
      connectionId:connectionUser._id
    })

    if(existingUser){
      return res.json({message:"request already sent"})
    }

    const request=new Connection({
      userId:user._id,
      connectionId:connectionUser._id
    })

    await request.save();
    return res.json({message:"request send"})
    
  }catch(err){
    return res.json({err:err.message})
  }
}

export const getMyConnections = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ token });
    if (!user) return res.status(404).json({ message: "User not found" });

    const connections = await Connection.find({
      userId: user._id,
    }).populate("connectionId", "name username email profilePicture");

    return res.json({ connections });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
export const whatAreMyconnections = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ token });
    if (!user) return res.status(404).json({ message: "User not found" });

    const connections = await Connection.find({
      connectionId: user._id,
    }).populate("userId", "name username profilePicture");

    return res.json(connections );
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
export const acceptConnection = async (req, res) => {
  const { token, connectionId, action_type } = req.body;

  try {
    const user = await User.findOne({ token });
    if (!user) return res.status(404).json({ message: "User not found" });

    const conn = await Connection.findById(connectionId);
    if (!conn) return res.status(404).json({ message: "Connection not found" });

    if (action_type === "accept") {
      conn.status = true;
    } else {
      conn.status = false;
    }

    await conn.save();

    return res.json({ message: "Request updated", conn });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
export const getUserProfileAndUserBasedOnUserName=async(req,res)=>{
  const {username}=req.query;
  try{
    const user=await User.findOne({
      username
    })

    if(!user){
      return res.status(500).json({message:"user not found"})
    }

    const userProfile=await Profile.findOne({userId:user._id})
    .populate("userId","profilePicture username name email")

    return res.json({"profile":userProfile})

  }catch(err){
    return res.status(404).json({message:err.message})
  }
}

export const addEducation = async (req, res) => {
  try {

    const { token, degree, college, year } = req.body;

    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const profile = await Profile.findOne({ userId: user._id });

    profile.education.push({
      degree,
      college,
      year
    });

    await profile.save();

    return res.json({ message: "Education added", profile });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const addExperience = async (req, res) => {
  try {

    const { token, role, company, duration } = req.body;

    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const profile = await Profile.findOne({ userId: user._id });

    profile.experience.push({
      role,
      company,
      duration
    });

    await profile.save();

    return res.json({ message: "Experience added", profile });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};