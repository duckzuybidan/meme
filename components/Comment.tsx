import { useEffect, useState } from "react"
import { comment, user } from "@/lib/types"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/redux/store"
import { AiOutlineEdit , AiOutlineDelete } from "react-icons/ai"
import { useDispatch } from "react-redux"
import { createComment, deleteComment, editComment } from "@/lib/redux/commentSlice"
import { BiSolidDownArrow, BiSolidUpArrow } from "react-icons/bi";
export default function Comment({rootComment, replies}: {rootComment: comment, replies: comment[] | null}) {
  const [userRef, setUserRef] = useState<user | null>(null)
  const { currentUser } = useSelector((state: RootState) => state.user)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [showReplies, setShowReplies] = useState(false)
  const [onReply, setOnReply] = useState(false)
  const [newReply, setNewReply] = useState({
    userId: '',
    memeId: '',
    parentId: '',
    body: ''
  })
  const [editedComment, setEditedComment] = useState(rootComment.body)
  const dispatch = useDispatch()
  useEffect(() => {
    fetch(`/api/user/getById/${rootComment.userId}`)
    .then(res => res.json())
    .then(res => {
      setUserRef(res.data as user)
    })
  }, [rootComment.userId])
  const handleDelete = (e: React.SyntheticEvent<HTMLSpanElement>) => {
    e.stopPropagation()
    fetch(`/api/comment/delete/${rootComment._id}`, {
      method: 'DELETE',  
    })
    .then(res => res.json())
    .then(res => dispatch(deleteComment(res.data as string)))
  }
  const handleEdit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    fetch(`/api/comment/edit/${rootComment._id}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(editedComment)
    })
    .then(res => res.json())
    .then(res => {
      dispatch(editComment(res.data as comment))
      setEditMode(false)
    })
  }
  const handleReply = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    newReply.memeId = rootComment.memeId
    newReply.userId = currentUser?._id as string
    newReply.parentId = rootComment._id
    fetch('/api/comment/create', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(newReply)
    })
    .then(res => res.json())
    .then(res => {
      dispatch(createComment(res.data as comment))
    })
    setNewReply({...newReply, body: ''})
    setOnReply(false)
    setShowReplies(true)
  }
  return (
    <div className={`${replies === null ? 'scale-90 m-3' : ''}`}>
      <div className="flex gap-3 items-center">
        <img
          src={userRef?.avatar}
          alt={userRef?.username}
          loading='lazy'
          className="rounded-full w-[36px] h-[36px]"
        />
        <h4 className="font-semibold text-lg">{userRef?.username}</h4>
      </div>
      <div className="p-3 bg-slate-100 rounded-lg h-max mt-3 space-y-3">
        {editMode ? (
          <form
            onSubmit={handleEdit}
          >
          <textarea
            className="p-3 outline-none resize-none w-full border-2 border-gray-300 focus:border-gray-700"
            defaultValue={rootComment.body}
            rows={3}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditedComment(e.target.value)}
          />
          <button
            className="bg-sky-300 p-2 px-4 rounded-xl font-semibold cursor-pointer hover:bg-sky-500"
            type="submit"
          >
            Save
          </button>
          </form>
          ) : (
            <p className="break-words border-b border-slate-400" dangerouslySetInnerHTML={{__html: rootComment.body.replace(/\n/g, '<br/>')}}/>
          )
        }
        {currentUser?._id === rootComment.userId && 
        <div className="flex gap-5 items-center">
          <AiOutlineEdit className="scale-125 cursor-pointer hover:text-green-500" onClick={() => setEditMode(!editMode)}/>  
          <AiOutlineDelete className="scale-125 cursor-pointer hover:text-red-500" onClick={() => setConfirmDelete(true)}/>
          {confirmDelete && 
          <p className="max-sm:text-xs">Delete this comment? 
            <span className="ml-2 text-red-500 cursor-pointer max-sm:text-xs" onClick={handleDelete}>DELETE</span> 
            <span className="ml-2 text-blue-500 cursor-pointer max-sm:text-xs" onClick={() => setConfirmDelete(false)}>UNDO</span>
          </p>
          }
        </div>
        }
        {replies !== null &&
        <div className="flex gap-3 items-center">
        {currentUser && <button className="font-semibold" onClick={() => setOnReply(!onReply)}>Reply</button>}
        <button className="p-1 px-2 rounded-lg bg-green-300 flex items-center text-sm"
          onClick={() => setShowReplies(!showReplies)}
        >
          {showReplies ? <BiSolidUpArrow className="mr-1"/> : <BiSolidDownArrow className="mr-1"/>}
          Replies
        </button>
        </div>
        }
      </div>
        {onReply && 
        <form 
          className="flex item-center gap-5"
          onSubmit={handleReply}
        >
          <img
            src={currentUser?.avatar}
            alt={currentUser?.username}
            loading='lazy'
            className="rounded-full w-[36px] h-[36px]"
          />
          <div className="w-full">
            <textarea
              className="p-2 outline-none resize-none w-full border-2 border-gray-300 focus:border-gray-700"
              placeholder="Add a reply..."
              rows={2}
              required
              value={newReply.body}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewReply({...newReply, body: e.target.value})}
            />
            <div className="flex gap-3">
              <button 
                  className="bg-sky-300 p-2 px-4 rounded-xl font-semibold cursor-pointer hover:bg-sky-500"
                  onClick={(e : React.SyntheticEvent<HTMLButtonElement>) => {
                    e.preventDefault()
                    setOnReply(false)
                  }}
              >
                Cancel
              </button>
              <button 
                className="bg-sky-300 p-2 px-4 rounded-xl font-semibold cursor-pointer hover:bg-sky-500"
                type="submit"
              >
                Reply
              </button>
            </div>
          </div>
        </form>
        }
        {showReplies && replies !== null && 
          replies.map((reply: comment) => 
            <Comment 
              key={reply._id}
              rootComment = {reply}
              replies={null}
            />
          )
        }

    </div>
  )
}
