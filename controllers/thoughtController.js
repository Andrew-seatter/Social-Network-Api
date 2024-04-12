const { Thought, User } = require("../models");

module.exports = {
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find({});

      res.json(thoughts);
    } catch (error) {
      res.status(404).json(err);
    }
  },

  async getOneThought(req, res) {
    try {
      const thought = await Thought.findOne({
        _id: req.params.thoughtId,
      }).select("-__v");

      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }

      res.status(200).json(thought);

    } catch (error) {
      res.status(500).JSON();
    }
  },

  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);

      const user = await User.findOneAndUpdate(
        { username: req.body.username },
        { $push: { thoughts: thought } },
        { new: true }
      );

      res.json(thought);
    } catch (error) {
      res.status(500).json();
    }
  },

  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndDelete({
        _id: req.params.thoughtId,
      });

      const user = await User.findOneAndUpdate(
        { thoughts: req.params.thoughtId },
        { $pull: { thoughts: req.params.thoughtId } },
        { runValidators: true, new: true }
      );
    res.json(thought);

    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  },

  async updateThought(req, res) {
    try {

      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      res.status(200).json(thought);

    } catch (error) {
      res.status(500).json();
    }
  },

  async createReaction(req, res) {
    try {
      const reaction = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );

      if (!reaction) {
        return res.status(404).json({ message: "Thought does not exist" });
      };

      res.status(200).json(reaction);
    } catch (error) {
      res.status(500).json();
    }
  },

  async deleteReaction(req, res) {
    try {

      const reaction = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      );


      if (!reaction) {
        return res
          .status(404)
          .json({ message: "Thought does not exist" });
      };

      res.status(200).json(reaction);


    } catch (error) {
      console.error(error);
      res.status(500).json();
    }
  },
};

