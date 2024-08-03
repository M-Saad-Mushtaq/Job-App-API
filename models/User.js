const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please Provide Name'],
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: [true, 'Please Provide Email'],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please Provide Email'
        ],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please Provide Password'],
        minlength: 6
    }
})

userSchema.pre('save', async function ()  {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password,salt);
})

userSchema.methods.createJWT = function () {
    
    return jwt.sign(
        {userId: this._id,name: this.name},
        process.env.JWT_SECRET,
        {expiresIn : process.env.JWT_LIFETIME}
    )
}

userSchema.methods.comparePassword = async function (candidate,hashed) {
    return await bcryptjs.compare(candidate, hashed); 
}

module.exports = mongoose.model('User', userSchema);