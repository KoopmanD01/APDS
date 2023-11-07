const mongoose = require('mongoose');
const Joi = require('joi');

//objects for the posts, schema blueprint
const postSchema = new mongoose.Schema({
    title: String,
    description: String,
    department: String,
    type: String
    
});

const Post = mongoose.model('Post', postSchema);

//validate user request to post, using joi to apply rules to data input, prevent sql injection
function validatePost(post){
    const schema = Joi.object({
        title: Joi.string().min(3).max(50).required(),
        description: Joi.string().min(3).max(50).required(),
        department: Joi.string().min(3).max(50).required(),   
        type: Joi.string().min(3).max(50).required()          
    });
    return schema.validate(post);

}
module.exports = {Post, validatePost};