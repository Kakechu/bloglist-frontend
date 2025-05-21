import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import { beforeEach, describe, expect } from 'vitest'
import userEvent from '@testing-library/user-event'


describe('<Blog />', () => {
  let container

  const blog = {
    title: 'Test Blog',
    author: 'Author',
    url: 'www.example.com',
    likes: 0,
    user: {
      username: 'testuser',
      name: 'Test User'
    }
  }

  const user = {
    username: 'testuser',
    name: 'Test User'
  }

  const mockHandleLike = vi.fn()
  const mockHandleRemove = vi.fn()


  beforeEach(() => {
    vi.clearAllMocks()
    container = render(
      <Blog
        blog={blog}
        handleLike={mockHandleLike}
        handleRemove={mockHandleRemove}
        user={user}
      />
    ).container
  })

  test('renders title and author but not url or likes', () => {
    const div = container.querySelector('.blog')
    expect(div).toHaveTextContent('Test Blog Author')
    expect(div).not.toHaveTextContent(blog.url)
    expect(div).not.toHaveTextContent(blog.likes)
  })

  test('after clicking the view button, url, likes and user are displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const div = container.querySelector('.blogDetails')
    expect(div).toHaveTextContent(blog.url)
    expect(div).toHaveTextContent(blog.likes)
    expect(div).toHaveTextContent(blog.user.name)
  })

  test('calls like handler twice when like button clicked twice', async () => {
    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')

    await user.click(likeButton)
    await user.click(likeButton)
    expect(mockHandleLike.mock.calls).toHaveLength(2)

  })

})