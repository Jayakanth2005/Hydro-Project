import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/common/Sidebar';
import './Community.css';

function Community() {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            // TODO: Fetch posts from API
            // For now, using dummy data
            setPosts([
                {
                    id: 1,
                    author: 'John Doe',
                    content: 'Water quality seems to be improving in our area!',
                    timestamp: new Date().toISOString(),
                    likes: 5,
                    comments: []
                }
            ]);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitPost = async (e) => {
        e.preventDefault();
        if (!newPost.trim()) return;

        try {
            // TODO: Submit post to API
            console.log('Submitting post:', newPost);
            setNewPost('');
            fetchPosts();
        } catch (error) {
            console.error('Error submitting post:', error);
        }
    };

    return (
        <div className="community-page">
            <Sidebar />
            <div className="community-content">
                <div className="community-header">
                    <h1>Community Forum</h1>
                    <p>Share and discuss water management topics</p>
                </div>

                <div className="new-post-section">
                    <form onSubmit={handleSubmitPost}>
                        <textarea
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                            placeholder="Share your thoughts..."
                            rows="4"
                        />
                        <button type="submit" className="submit-btn">Post</button>
                    </form>
                </div>

                <div className="posts-section">
                    {loading ? (
                        <p>Loading posts...</p>
                    ) : (
                        posts.map(post => (
                            <div key={post.id} className="post-card">
                                <div className="post-header">
                                    <strong>{post.author}</strong>
                                    <span className="post-time">
                                        {new Date(post.timestamp).toLocaleString()}
                                    </span>
                                </div>
                                <p className="post-content">{post.content}</p>
                                <div className="post-actions">
                                    <button className="like-btn">👍 {post.likes}</button>
                                    <button className="comment-btn">💬 Comment</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default Community;
