import { db } from '../config/firebase.js';

// Get all posts
export const getAllPosts = async (req, res) => {
    try {
        const snapshot = await db.ref('community/posts').once('value');
        const posts = [];

        snapshot.forEach((childSnapshot) => {
            posts.push({
                id: childSnapshot.key,
                ...childSnapshot.val(),
            });
        });

        // Sort by timestamp (newest first)
        posts.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

        res.status(200).json({ posts });
    } catch (error) {
        console.error('Get posts error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Create new post
export const createPost = async (req, res) => {
    try {
        const { title, content, imageUrl } = req.body;
        const userId = req.user.uid;
        const userEmail = req.user.email;

        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content are required' });
        }

        const newPostRef = db.ref('community/posts').push();
        const postData = {
            title,
            content,
            imageUrl: imageUrl || null,
            author: userEmail.split('@')[0],
            authorId: userId,
            timestamp: Date.now(),
            likes: 0,
            likedBy: {},
            comments: {},
        };

        await newPostRef.set(postData);

        res.status(201).json({
            message: 'Post created successfully',
            post: {
                id: newPostRef.key,
                ...postData,
            },
        });
    } catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Update post
export const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, imageUrl } = req.body;
        const userId = req.user.uid;

        const postRef = db.ref(`community/posts/${id}`);
        const snapshot = await postRef.once('value');
        const post = snapshot.val();

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post.authorId !== userId) {
            return res.status(403).json({ error: 'Not authorized to update this post' });
        }

        const updates = {
            ...(title && { title }),
            ...(content && { content }),
            ...(imageUrl !== undefined && { imageUrl }),
            updatedAt: Date.now(),
        };

        await postRef.update(updates);

        res.status(200).json({ message: 'Post updated successfully' });
    } catch (error) {
        console.error('Update post error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Delete post
export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.uid;

        const postRef = db.ref(`community/posts/${id}`);
        const snapshot = await postRef.once('value');
        const post = snapshot.val();

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post.authorId !== userId && req.user.role !== 'government') {
            return res.status(403).json({ error: 'Not authorized to delete this post' });
        }

        await postRef.remove();

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Delete post error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Like/Unlike post
export const toggleLike = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.uid;

        const postRef = db.ref(`community/posts/${id}`);
        const snapshot = await postRef.once('value');
        const post = snapshot.val();

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const likedBy = post.likedBy || {};
        const hasLiked = likedBy[userId];

        if (hasLiked) {
            // Unlike
            delete likedBy[userId];
            await postRef.update({
                likes: (post.likes || 1) - 1,
                likedBy,
            });
            res.status(200).json({ message: 'Post unliked', liked: false });
        } else {
            // Like
            likedBy[userId] = true;
            await postRef.update({
                likes: (post.likes || 0) + 1,
                likedBy,
            });
            res.status(200).json({ message: 'Post liked', liked: true });
        }
    } catch (error) {
        console.error('Toggle like error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Add comment
export const addComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;
        const userId = req.user.uid;
        const userEmail = req.user.email;

        if (!text) {
            return res.status(400).json({ error: 'Comment text is required' });
        }

        const postRef = db.ref(`community/posts/${id}`);
        const snapshot = await postRef.once('value');
        const post = snapshot.val();

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const commentRef = postRef.child('comments').push();
        const commentData = {
            text,
            author: userEmail.split('@')[0],
            authorId: userId,
            timestamp: Date.now(),
        };

        await commentRef.set(commentData);

        res.status(201).json({
            message: 'Comment added successfully',
            comment: {
                id: commentRef.key,
                ...commentData,
            },
        });
    } catch (error) {
        console.error('Add comment error:', error);
        res.status(500).json({ error: error.message });
    }
};
