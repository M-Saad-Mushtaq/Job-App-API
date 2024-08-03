const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, 'Please Enter Company'],
        maxlength: 50
    },
    position: {
        type: String,
        required: [true, 'Please Enter Position'],
        maxlength: 100
    },
    status: {
        type: String,
        enum: ['pending', 'interview', 'declined'],
        default: 'pending'
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please Enter User']
    }
})

module.exports = new mongoose.model('Job', jobSchema);