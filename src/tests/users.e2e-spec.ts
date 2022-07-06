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
			email: 'test@mail.com',
			password: '11111',
		});

		expect(res.statusCode).toBe(422);
	});

	it('Login - error', async () => {
		const res = await request(application.app).post('/users/login').send({
			email: 'testError@gmail.com',
			name: 'test',
			password: '222222',
		});

		expect(res.statusCode).toBe(401);
		expect(res.body.error).toEqual('no authorization');
	});

	it('Login - success', async () => {
		const res = await request(application.app).post('/users/login').send({
			email: 'test@mail.com',
			name: 'philipp',
			password: '11111',
		});
		expect(res.statusCode).toBe(200);
		expect(res.body.jwt).not.toBeUndefined();
	});

	it('INFO - error', async () => {
		const { body } = await request(application.app).post('/users/login').send({
			email: 'test@mail.com',
			name: 'philipp',
			password: '11111',
		});
		const JWT_Token = body.jwt;
		const res = await request(application.app)
			.get('/users/info')
			.set('Authorization', `Bearer ${JWT_Token}Error`);
		expect(res.statusCode).toBe(401);
		expect(res.body.error).toEqual('User no authorization');
	});

	it('INFO - success', async () => {
		const { body } = await request(application.app).post('/users/login').send({
			email: 'test@mail.com',
			name: 'philipp',
			password: '11111',
		});
		const JWT_Token = body.jwt;
		const res = await request(application.app)
			.get('/users/info')
			.set('Authorization', `Bearer ${JWT_Token}`);
		expect(res.statusCode).toBe(200);
		expect(res.body.userId).toEqual(5);
		expect(res.body.name).toEqual('philipp');
	});
});

afterAll(() => {
	application.close();
});
