import { useState } from "react"

const Blog = ({ blog }) => {
  const [showBlog, setShowBlog] = useState(false)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
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
        <button>like</button>
      </div>
      <div>{blog.user.name}</div>
    </div>
  )

}

export default Blog