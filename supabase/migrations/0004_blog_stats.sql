ALTER TABLE blog_posts
ADD COLUMN IF NOT EXISTS view_count BIGINT DEFAULT 0,
ADD COLUMN IF NOT EXISTS like_count BIGINT DEFAULT 0,
ADD COLUMN IF NOT EXISTS comment_count BIGINT DEFAULT 0;

CREATE TABLE IF NOT EXISTS blog_likes (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    liker_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(post_id, liker_id)
);

CREATE INDEX idx_blog_likes_post ON blog_likes(post_id);

CREATE TABLE IF NOT EXISTS blog_comments (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    author_email TEXT,
    body TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_blog_comments_post ON blog_comments(post_id);
CREATE INDEX idx_blog_comments_created ON blog_comments(created_at DESC);
