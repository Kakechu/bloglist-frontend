const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Kaisa Leinonen',
        username: 'kaisal',
        password: 'salainen'
      }
    })

    
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkaien',
        username: 'mluukkai',
        password: 'salainen'
      }
    })


    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = await page.getByText('Log in to application')
    await expect(locator).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'kaisal', 'salainen')
      await expect(page.getByText('Kaisa Leinonen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'kaisal', 'wrong')

      const errorDiv = await page.locator('.error')
      await expect(errorDiv).toContainText('wrong username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
    })

  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'kaisal', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(
        page,
        'Blog Title',
        'Author',
        'www.example.com')
      await expect(page.getByText('a new blog Blog Title by Author added')).toBeVisible()
      await expect(page.getByText('Blog Title Authorview')).toBeVisible()
    })

    describe('and blogs exist', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'First Title', 'First Author', 'www.example.com')
        await createBlog(page, 'Second Title', 'Second Author', 'www.example.com')
        await createBlog(page, 'Third Title', 'Third Author', 'www.example.com')
      })

      test('a blog can be liked', async ({ page }) => {

        const blog = await page.locator('.blog', { hasText: 'Second Title Second Author' })
        await blog.getByRole('button', { name: 'view' }).click()
        
        await expect(blog.getByText('likes')).toBeVisible()
        await expect(blog.getByText('likes 0')).toBeVisible()
        
        await blog.getByRole('button', { name: 'like' }).click()

        await expect(blog.getByText('likes 1')).toBeVisible()
        await blog.getByRole('button', { name: 'like' }).click()

        await expect(blog.getByText('likes 2')).toBeVisible()
        
      })


      test('a blog can be removed', async ({ page }) => {
        const blog = await page.locator('.blog', { hasText: 'Third Title Third Author' })

        await blog.getByRole('button', { name: 'view' }).click()

        await expect(blog.getByRole('button', { name: 'remove' })).toBeVisible()
        page.on('dialog', dialog => dialog.accept())
        await blog.getByRole('button', { name: 'remove' }).click()

        await expect(page.locator('.blog', { hasText: 'Third Title Third Author' })).toHaveCount(0)
      })
    })

  })

})