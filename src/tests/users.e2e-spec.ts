import { App } from '../app';
import { boot } from '../main';
import request from 'supertest';

let application: App;

beforeAll(async () => {
	const { app } = await boot;
	application = app;
});

describe('Users e2e', () => {
	it('Register - error', async () => {
		const res = await request(application.app).post('/users/register').send({
			email: 'test@gmail.com',
			password: '11111111',
		});

		expect(res.statusCode).toBe(422);
	});
});

afterAll(() => {
	application.close();
});
