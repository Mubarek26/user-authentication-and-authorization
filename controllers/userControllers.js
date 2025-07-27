const express = require('express');
const AppError = require('../utils/indexError');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
// const { use } = require('react');
const router = express.Router();
// const fs = require('fs');
exports.createUser = (req, res) => {
  console.log(req.body);
  const newUser = Object.assign({ id: Date.now() }, req.body);
  // Here you would typically save the user to a database
  res.status(201).json({
    status: 'success',
    message: 'User created successfully',
  });
};
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    message: 'All users retrieved successfully',
    data: {
      users: users,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1. create error if user posts password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updatePassword.',
        400
      )
    );
  }
  // 2. Filter out unwanted fields names that are not allowed to be updated
  const filteredBody = {};
  const allowedFields = ['name','email', 'photo','role']; // Add any other fields
  Object.keys(req.body).forEach((el) => {
    if (allowedFields.includes(el)) filteredBody[el] = req.body[el];
  });
    
  // 3. update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,       // return the updated document
        runValidators: true,
    });

  res.status(200).json({
    status: 'success',
    data: {
      updatedUser: updatedUser,
    },
  });
});

// 2. delete user
exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id,{active: false});
    res.status(204).json({
        status: 'success',
        message: 'User deleted successfully',
    })
})


exports.getUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'User retrieved successfully',
  });
};

exports.updateUsers = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'User updated successfully',
  });
};
exports.deleteUsers = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'User deleted successfully',
  });
};
