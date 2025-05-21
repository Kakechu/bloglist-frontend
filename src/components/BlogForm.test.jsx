import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import { beforeEach, describe, expect } from 'vitest'
import userEvent from '@testing-library/user-event'

describe('<BlogForm />', () => {

  test('calls handler with the right input', async () => {
    const user = userEvent.setup()
    const createBlog = vi.fn()

    const { container } = render(<BlogForm createBlog={createBlog} />)

    const titleInput = container.querySelector('#title-input')
    const authorInput = container.querySelector('#author-input')
    const urlInput = container.querySelector('#url-input')
    const createButton = screen.getByText('create')

    await user.type(titleInput, 'Blog Title')
    await user.type(authorInput, 'Author Authorson')
    await user.type(urlInput, 'www.example.com')
    await user.click(createButton)

    expect(createBlog).toHaveBeenCalledTimes(1)
    const mockCall = createBlog.mock.calls[0][0]
    expect(mockCall.title).toBe('Blog Title')
    expect(mockCall.author).toBe('Author Authorson')
    expect(mockCall.url).toBe('www.example.com')


  })

})