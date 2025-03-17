const mongoose = require("mongoose")

const connectionRequestSchema = mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignored", "rejected", "accepted", "requested"],
            message: `{VALUE} is incorrect status type`
        }
    }
},
{timestamsps: true}
)

connectionRequestSchema.index({fromUserId: 1, toUserId: 1})

connectionRequestSchema.pre("save", function(next){
    const connectionRequest = this

    if(connectionRequest.toUserId.equals(connectionRequest.fromUserId)){
        throw new Error("Can not send connection request to yourself!")
    }

    next()
})

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema)