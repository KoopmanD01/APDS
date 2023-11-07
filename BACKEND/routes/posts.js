const router = require('express').Router();
const auth = require('../middleware/auth');
const { Post, validatePost} = require('../models/posts');


//get all post
router.get('/', auth, async (req, res) => {
    // Inactive token error
    if (res.statusCode === 401) {
      return res.send({ error: 'Token is inactive or invalid' });
    }
  
    const posts = await Post.find();
    res.send(posts);
  });

//create new post
router.post('/', auth, async (req, res) => {   
    //validate user input according to post schema
    const { error } = validatePost(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    //new post object
    const post = new Post(req.body);
    try {
        await post.save();
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create post.' });
    }
});

//get single post
router.get('/:id', auth, async (req, res) => {
    const post = await Post.findById(req.params.id);
    if(post) return res.send(post);
    res.sendStatus(404);
     // Handle inactive token error
  if (res.statusCode === 401) {
    return res.json({ error: 'Token is inactive or invalid' });
  }
});

//delete a single post
router.delete('/:id', auth, async (req, res) => {
    const result = await Post.deleteOne({_id: req.params.id});
    res.send(result);
     // Handle inactive token error
  if (res.statusCode === 401) {
    return res.json({ error: 'Token is inactive or invalid' });
  }
});

module.exports = router;