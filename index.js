import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

let posts = [
    { id: 1, title: 'Test Post', content: 'This is a test post', date: new Date() }
];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) => {
    const recentPosts = posts.slice(0, 3); // Get the 3 most recent posts
    console.log('Recent posts:', recentPosts); // Debugging log
    res.render("index.ejs", { recentPosts });
});

app.post('/publish', (req, res) => {
    const { title, content } = req.body;
    const newPost = {
        id: posts.length + 1,
        title,
        content,
        date: new Date()
    };
    posts.unshift(newPost); // Add new post to the beginning of the array
    console.log('New post added:', newPost);
    console.log('Total posts:', posts.length);
    res.redirect('/'); // Redirect to home page after publishing
});

app.delete('/delete/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const postIndex = posts.findIndex(post => post.id === postId);
    if (postIndex !== -1) {
        posts.splice(postIndex, 1);
        res.status(200).json({ message: 'Post deleted successfully' });
    } else { 
       res.status(404).json({ error: 'Post not found' });
    }
});

app.get('/post/:id', (req, res) => {
    const post = posts.find(p => p.id === parseInt(req.params.id));
    if (!post) return res.status(404).send('Post not found');
    res.render('post', { post });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
