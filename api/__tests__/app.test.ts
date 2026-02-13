import request from 'supertest'
import app from '../app'

describe('Security & Rate Limit', () => {
  it('should have security headers via helmet', async () => {
    const res = await request(app).get('/api/health')
    expect(res.status).toBe(200)
    expect(res.headers['x-dns-prefetch-control']).toBe('off')
    expect(res.headers['x-frame-options']).toBe('SAMEORIGIN')
  })

  it('should respond under rate limit', async () => {
    for (let i = 0; i < 10; i++) {
      const res = await request(app).get('/api/health')
      expect(res.status).toBe(200)
    }
  })
})
