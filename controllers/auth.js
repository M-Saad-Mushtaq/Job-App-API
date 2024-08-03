const { StatusCodes } = require('http-status-codes');
const UserSchema = require('../models/User');
require('http-status-codes');
const {BadRequestError,UnauthenticatedError} = require('../errors')

const login = async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password) {
        throw new BadRequestError('Provide Email and Password!!');
    }

    const user = await UserSchema.findOne({email:email});

    if(!user) {
        throw new UnauthenticatedError('Invalid Credentials!!')
    }
    const passMatch = await user.comparePassword(password,user.password);

    if(!passMatch) {
        throw new UnauthenticatedError('Invalid Credentials!!');
    }

    const token = user.createJWT();

    res.status(StatusCodes.OK).json({user: {name: user.name}, token});

}

const register = async (req, res) => {
    const user = await User.create(req.body);
    
    const token = user.createJWT();

    res.status(StatusCodes.OK).json({ user :{name:user.name},token });
}

module.exports = {login, register}