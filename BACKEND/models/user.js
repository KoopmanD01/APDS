const mongoose = require('mongoose');
const Joi = require('joi');

//objects for the user profile, schema blueprint
const userSchema = new mongoose.Schema({

    username: { type: String, unique: true },
    firstName: String,
    lastName: String,
    age: Number,
    dateOfBirth: String,
    role: String,
    password: String
    
});

const User = mongoose.model('User', userSchema);
//validate user request to register, using joi to apply rules to data input, prevent sql injection
function validateUser(user) {
    const schema = Joi.object({
        username: Joi.string().min(3).max(50).required(),
        firstName: Joi.string().min(3).max(50).required(),
        lastName: Joi.string().min(3).max(50).required(), 
        age: Joi.number().integer().min(0).required(),
        dateOfBirth: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).message('Date must be YYYY-MM-DD').required(),
        role: Joi.string().required(),
        password: Joi.string()
            .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
            .message('Password must have at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character')
            .required()
    });

    return schema.validate(user);
}


module.exports = {User, validateUser};