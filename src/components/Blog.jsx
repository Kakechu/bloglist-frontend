import { useState } from "react"
import blogService from '../services/blogs'

const Blog = ({ blog, handleLike }) => {

  const [showBlog, setShowBlog] = useState(false)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const onLike = () => {

    const newBlog = {
      ...blog,
      likes: blog.likes + 1,
    }

    handleLike(blog.id, newBlog)

  }

  if (!showBlog) {
    return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={() => setShowBlog(true)}>
        view
      </button>
    </div>
    )  
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setShowBlog(false)}>
          hide
        </button>
      </div>
      <div>{blog.url}</div>
      <div>
        likes {blog.likes}
        <button onClick={() => onLike()}>
          like
        </button>
      </div>
      <div>{blog.user.name}</div>
      <div>{blog.user.id}</div>
    </div>
  )

}

export default Blog