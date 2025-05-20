import { useState } from "react"

const Blog = ({ blog, handleLike, handleRemove, user }) => {

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

  const onRemove = () => {
    if (confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      handleRemove(blog)
    }
    
  }

  const blogDetails = () => (
    <div>
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
    </div>
  )

  const removeButton = () => (
    <div>
      <button 
        style={{ backgroundColor: '#24A0ED' }}
        onClick={() => onRemove()}
      >
        remove
      </button>  
    </div>

  )

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

  if (user.username === blog.user?.username) {  return (
    <div style={blogStyle}>
    {blogDetails()}
    {removeButton()}
    </div> 
  )}

  return (
    <div style={blogStyle}>
      {blogDetails()}
    </div>
  )

  

}

export default Blog