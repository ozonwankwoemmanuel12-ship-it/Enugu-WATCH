import { Message } from './icons.jsx'
import { initials, timeAgo } from '../lib/format.js'

function Comment({ comment, isMine }) {
  return (
    <div className="comment">
      <span className="avatar" aria-hidden="true" style={{ width: 34, height: 34, fontSize: '0.8rem' }}>
        {initials(comment.userName || comment.author || '?')}
      </span>
      <div className="comment-body">
        <div className="comment-head">
          <span className="comment-author">{comment.userName || 'Community member'}</span>
          {comment.userRole && <span className="comment-role">{comment.userRole}</span>}
          {isMine && <span className="comment-role" style={{ background: 'var(--green-soft)', color: 'var(--green)' }}>You</span>}
          <span className="comment-time">{timeAgo(comment.createdAt)}</span>
        </div>
        <p className="comment-text">{comment.message}</p>
      </div>
    </div>
  )
}

export default function CommentList({ comments = [], currentUserId }) {
  if (!Array.isArray(comments) || comments.length === 0) {
    return (
      <div className="state" style={{ padding: '28px 16px' }}>
        <span className="state-ic" aria-hidden="true">
          <Message width={24} height={24} />
        </span>
        <div className="state-title">No comments yet</div>
        <div className="state-text">Be the first to add information to this report.</div>
      </div>
    )
  }
  return (
    <div>
      {comments.map((comment, index) => (
        <Comment key={comment.id || index} comment={comment} isMine={comment.userId === currentUserId} />
      ))}
    </div>
  )
}