import request from 'supertest';
import { app } from '../src/index';

describe('GET /joke/:type', () => {
  it('should fetch a joke and save it to the database', async () => {
    const response = await request(app).get('/joke/Programming');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('category');
    expect(response.body).toHaveProperty('joke');
    expect(response.body).toHaveProperty('safe');
  });

  it('should return 500 if joke type is invalid', async () => {
    const response = await request(app).get('/joke/NonExistentType');
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty(
      'message',
      'An error occurred while fetching or saving the joke.'
    );
  });

  it('should handle server errors gracefully', async () => {
    // Simulate an error by providing an invalid URL or causing Axios to throw an error
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const response = await request(app).get('/joke/ErrorTest');
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty(
      'message',
      'An error occurred while fetching or saving the joke.'
    );
  });
});
