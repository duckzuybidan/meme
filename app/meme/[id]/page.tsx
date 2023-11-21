"use client"
import Comment from "@/components/Comment"
import {user, meme, comment} from "@/lib/types"
import { RootState } from "@/lib/redux/store"
import Link from "next/link"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { AiFillLike, AiOutlineLike } from "react-icons/ai"
import { MdDownload } from "react-icons/md"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { createComment, getComment } from "@/lib/redux/commentSlice"

export default function Page({params}: {params: {id:string}}) {
  const [meme, setMeme] = useState<meme | null>(null)
  const [userRef, setUserRef] = useState<user | null>(null)
  const [loading, setLoading] = useState(false)
  const [downloads, setDownloads] = useState(0)
  const [likes, setLikes] = useState(0)
  const [isLike, setIsLike] = useState(false)
  const { currentUser } = useSelector((state: RootState) => state.user)
  const { commentList } = useSelector((state: RootState) => state.comment)
  const [newComment, setNewComment] = useState({
    userId: '',
    memeId: '',
    body: ''
  })

  const dispatch = useDispatch()
  useEffect(() => {
    const fetchData = () => {
      setLoading(true)
      try {
        fetch(`/api/meme/getById/${params.id}`, {
          next:{
            revalidate: 5
          }
        })
        .then(res => res.json())
        .then(res => {
          setMeme(res.data as meme)
          return res.data as meme
        })
        .then(meme => {
          fetch(`/api/user/getById/${meme.userRef}`, {
            next:{
              revalidate: 5
            }
          })
          .then(res => res.json())
          .then(res => {
            setUserRef(res.data as user)
          })
          fetch(`/api/comment/getByMemeId/${meme._id}`, {
            next:{
              revalidate: 5
            }
          })
          .then(res => res.json())
          .then(res => {
            dispatch(getComment(res.data as comment[]))
          })
          setDownloads(meme.downloads)
          setLikes(meme.likes.length)
          setIsLike(meme.likes.includes(currentUser?._id as string))
          setLoading(false)
        })
      }
      catch (error) {
        setLoading(false)
        console.log(error)  
      }
    }
    fetchData()
  }, [currentUser, params.id, dispatch])
  const handleDownload = () => {
    fetch(meme?.url as string)
    .then(res => res.blob())
    .then(blob => {
      const url = URL.createObjectURL(blob)
      let aTag = document.createElement("a")
      aTag.href = url
      aTag.download = meme?.firebaseName as string
      document.body.append(aTag)
      aTag.click()
      aTag.remove()
      URL.revokeObjectURL(url)
    })
    .then(async () => {
      await fetch(`/api/meme/actions/download/${meme?._id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({downloads: downloads + 1})
      })
      setDownloads(downloads + 1)
    })
  }
  const handleLike = async () => {
    if(!currentUser){
      toast.error("You have to sign in to like this meme!")
      return
    }
    await fetch(`/api/meme/actions/like/${meme?._id}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({likeUserId: currentUser?._id})
    })
    setLikes(likes + 1)
    setIsLike(true)
  }
  const handleUnlike = async () => {
    await fetch(`/api/meme/actions/unlike/${meme?._id}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({unlikeUserId: currentUser?._id})
    })
    setLikes(likes - 1)
    setIsLike(false)
  }
  const handleComment = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    newComment.memeId = meme?._id as string
    newComment.userId = currentUser?._id as string
    fetch('/api/comment/create', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(newComment)
    })
    .then(res => res.json())
    .then(res => {
      dispatch(createComment(res.data as comment))
    })
    setNewComment({...newComment, body: ''})
  }
  return (
    <>
    {loading && <p className='text-center my-7 text-3xl font-bold'>Loading...</p>}
    {!loading && meme && userRef && commentList &&
    <div className="flex flex-col items-center gap-4 mt-11">
      {meme?.type === 'image' && <img src={meme.url} alt={meme.url} className="rounded-xl"/>}
      {meme?.type === 'video' && <video src={meme.url} controls  controlsList="nodownload" className="rounded-xl"/>}
      <h1 className="font-bold text-2xl">{meme?.title}</h1>
      <div className="flex justify-around items-center w-3/5 max-lg:flex-col max-lg:gap-y-3 max-sm:w-full">
        <div className="flex gap-3 items-center">
          <img
            src={userRef?.avatar}
            alt={userRef?.username}
            loading='lazy'
            className="rounded-full w-[48px] h-[48px]"
          />
          <h3 className="font-semibold text-lg">{userRef?.username}</h3>
        </div>
        <div className="flex items-center space-x-3">
        <div className="flex items-center p-3 bg-slate-200 rounded-lg font-semibold text-red-500">
            <p>{downloads} downloads</p> 
            <MdDownload className="ml-2 mb-1 scale-150 cursor-pointer hover:text-red-300" onClick={handleDownload}/>
          </div>
          <div className="flex items-center p-3 bg-slate-200 rounded-lg font-semibold text-blue-500">
            <p>{likes} likes</p> 
            {(isLike && currentUser) ? 
            <AiFillLike className="ml-2 mb-1 scale-150 cursor-pointer hover:text-blue-300" onClick={handleUnlike}/> 
              :
            <AiOutlineLike className="ml-2 mb-1 scale-150 cursor-pointer hover:text-blue-300" onClick={handleLike}/>
            }
          </div>
        </div>
      </div>
      <div className="p-5 pb-10 bg-slate-100 rounded-lg w-2/3 h-max">
      <h2 className="font-semibold text-lg text-center">DESCRIPTION</h2>
      <div className="flex space-x-2">
      {meme.tags.map((tag, i) => <Link key={i} className="text-sky-500 underline" href={`/hashtag/${tag}`}>#{tag}</Link>)}
      </div>
      <p className="break-words" dangerouslySetInnerHTML={{__html: meme.description.replace(/\n/g, '<br/>')}}/>
      </div>
      <div className="w-2/3 h-max space-y-5">
        <h2 className="font-bold text-2xl">Comments</h2>
        {currentUser ? (
        <form 
          className="flex item-center gap-5"
          onSubmit={handleComment}
        >
          <img
            src={currentUser?.avatar}
            alt={currentUser?.username}
            loading='lazy'
            className="rounded-full w-[36px] h-[36px]"
          />
            <div className="w-full">
              <textarea
                className="p-3 outline-none resize-none w-full border-2 border-gray-300 focus:border-gray-700"
                placeholder="Add a comment..."
                rows={3}
                required
                value={newComment.body}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewComment({...newComment, body: e.target.value})}
              />
              <button 
                className="bg-sky-300 p-2 px-4 rounded-xl font-semibold cursor-pointer hover:bg-sky-500"
                type="submit"
              >
                Comment
              </button>
            </div>
        </form>
        ) : (
          <h2 className="font-semibold text-2xl text-sky-500">You have to sign in to comment in this meme!</h2>
        )}
        <div className="w-full">
        {commentList?.length === 0 && <p className='text-center my-7 text-3xl font-bold'>This meme do not have any comments!</p>}
        {commentList?.length as number > 0 && (
          <div className="flex flex-col gap-5">
            {commentList?.filter((comment: comment) => comment.parentId === '').map((rootComment: comment) => 
              <Comment 
                key={rootComment._id}
                rootComment = {rootComment}
                replies={commentList.filter((comment: comment) => comment.parentId === rootComment._id)}
              />
            )}
          </div>
        )}
        </div>
      </div>
    </div>
    }
    </>
  )
}
