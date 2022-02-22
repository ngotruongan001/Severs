const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
    {
        token: {
            type: String,
            require: true,
        },
        title: {
            type: String,
            require: true,
        },
        content: {
            type: String,
            require: true,
        },
    },
    { timestamps: true },
)

module.exports = mongoose.model('Notification', notificationSchema);