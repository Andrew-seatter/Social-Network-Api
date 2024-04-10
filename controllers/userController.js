const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

const headCount = async () => {
    const numberOfUsers = await User.aggregate()
      .count('userCount');
    return numberOfUsers;
  }

module.exports = {
    // Get all users
    async getUsers(req, res) {
        try {
          const allUsers = await User.find().select("-__v");
          res.status(200).json(allUsers);
        } catch (error) {
          res.status(500).json();
        }
      },
  
    async getOneUser(req, res) {
        try {
          const oneUser = await User.findOne({ _id: req.params.userId })
            .select("-__v")
            .populate("friends")
            .populate("thoughts");
          res.status(200).json(oneUser);
        } catch (error) {
          res.status(500).json();
        }
      },

    async createUser(req, res) {
      try {
        const user = await User.create(req.body);
        res.json(user);
      } catch (err) {
        res.status(500).json(err);
      }
    },
    
    async deleteUser(req, res) {
      try {
        const user = await User.findOneAndRemove({ _id: req.params.UserId });
  
        if (!user) {
          return res.status(404).json({ message: 'No such user exists' });
        }
  
        Thought.deleteMany({ _id: {$in: user.thoughts}});
  
        res.json({ message: 'User successfully deleted' });
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    },
  
   
    async addFriend(req, res) {
      console.log('You are adding a friend');
      console.log(req.body);
  
      try {
        const user = await User.findOneAndUpdate(
          { _id: req.params.userId },
          { $addToSet: { assignments: req.params.friendId } },
          { runValidators: true, new: true }
        );
  
        if (!user) {
          return res
            .status(404)
            .json({ message: 'No user found with that ID :(' });
        }
  
        res.json(user);
      } catch (err) {
        res.status(500).json(err);
      }
    },
    
    async deleteFriend(req, res) {
        try {
          const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
            { runValidators: true, new: true }
          );
    
          if (!user) {
            return res.status(404).json({ message: "No user found" });
          }
          res.status(200).json(user)
        } catch (error) {
          res.status(500).json();
        }
      },
    };
    
  