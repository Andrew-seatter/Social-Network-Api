const {Schema, model} = require('mongoose')

const userSchema = new Schema(
    {
        username: {
            type: String,
            requried: true,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            requried: true,
            unique: true,
            match: [/.+@.+\..+/, "must be valid email"]
        },
        thoughts: [
            {
            type: Schema.Types.ObjectId,
            ref: "Thought"
            }
        ],
        friends: [
            {
            type: Schema.Types.ObjectId,
            ref: "User"

            }
        ]

    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false
    },
)

userSchema.virtual('friendCount').get(function () {
    return this.friends.length
})

const User = model('User', userSchema)

module.exports = User;