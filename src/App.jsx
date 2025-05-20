import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [notificationMessage, setNotificationMessage] = useState(null)

  const blogFormRef = useRef()


  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs( blogs ))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])


  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()

    try {
      const returnedBlog = await blogService.create(blogObject)

      const returnedBlogWithUser = {
        ...returnedBlog,
        user: user
      }

      setBlogs(blogs.concat(returnedBlogWithUser))
      showNotification(`a new blog ${blogObject.title} by ${blogObject.author} added`, 'success')

    } catch (exception) {
      console.log('error creating blog', exception)
    }
  }

  const handleLike = async ( blogId, newBlog ) => {

    const original = blogs.find(b => b.id === blogId)

    try {
      const returnedBlog = await blogService.update(blogId, newBlog)

      const blogWithUser = {
        ...returnedBlog,
        user: original.user
      }

      setBlogs(blogs.map(b => b.id !== blogId ? b : blogWithUser))
    } catch (exception) {
      console.log('error liking', exception)
    }
  }

  const handleRemove = async (blog) => {

    try {
      await blogService.removeBlog(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
      showNotification(`blog ${blog.title} removed`, 'success')

    } catch (exception) {
      console.log('error in deletion', exception)
      showNotification(`cannot remove blog ${blog.title} `, 'error')
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log('wrong credentials')
      showNotification('wrong username or password', 'error')
    }
  }

  const handleLogOut = async (event) => {
    setUser(null)
    window.localStorage.removeItem('loggedBlogappUser')
  }

  const showNotification = (message, type) => {
    setNotificationMessage({ text: message, type: type })
    setTimeout(() => {
      setNotificationMessage(null)
    }, 4000)
  }

  const sortedBlogs = [...blogs].sort(function(a, b){return b.likes - a.likes})

  const loginForm = () => (
    <div>
      <h2>Log in to application</h2>
      <Notification message={notificationMessage}/>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )


  if (user === null) {
    return (
      loginForm()
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notificationMessage}/>
      <p>{user.name} logged in <button onClick={handleLogOut}>logout</button></p>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog}/>
      </Togglable>
      {sortedBlogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          handleLike={handleLike}
          handleRemove={handleRemove}
          user={user}
        />
      )}
    </div>
  )
}

export default App