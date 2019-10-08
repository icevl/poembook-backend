export default {
    user: ['id', 'name', 'avatar', 'avatar_url', 'login', 'is_verified'],
    comment: ['id', 'user_id', 'content', 'likes_count', 'created_at'],
    poem: [
        'id',
        'comments_count',
        'title',
        'content',
        'dedicate_to',
        'likes_count',
        'views_count',
        'created_at',
        'user_id'
    ]
};
