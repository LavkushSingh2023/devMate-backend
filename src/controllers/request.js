const ConnectionRequest = require("../models/connectionRequest")
const user = require("../models/user")

const requestSendingController = async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const { status, toUserId } = req.params;

    const isAllowedStatus = ["requested", "ignored"];
    if (!isAllowedStatus.includes(status)) {
      throw new Error(`"${status}" status is not valid!`);
    }

    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId: fromUserId, toUserId: toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingConnectionRequest) {
      throw new Error("Connection request already exist!");
    }

    const toUser = await user.findOne({ _id: toUserId });
    if (!toUser) {
      throw new Error("User does not exist!");
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    const data = await connectionRequest.save();

    res.json({
      message: `${req.user.name} is ${status} in ${toUser.name}`,
      data,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};

const requestReviewController = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { status } = req.params;

    const isAllowedStatus = ["accepted", "rejected"];
    if (!isAllowedStatus.includes(status)) {
      throw new Error(`"${status}" is not a valid status!`);
    }

    const connectionRequest = await ConnectionRequest.findOne({
      toUserId: loggedInUser._id,
      status: "requested",
    });

    const sender = await user.findById(connectionRequest.fromUserId);

    if (!connectionRequest) {
      throw new Error(`Connection request not found!`);
    }

    connectionRequest.status = status;
    const data = await connectionRequest.save();

    res.send({
      message: `${loggedInUser.name} ${status} connection request of ${sender.name}`,
      data,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};

module.exports = {
  requestSendingController,
  requestReviewController,
};