import assert from 'node:assert/strict';
import http from 'node:http';

import supertest from 'supertest';

import * as Quack from '../src/index.mjs';

const meta = { label: 'foo', time: new Date(0), level: 'info' };

describe('Quack::Format', function () {
	describe('::Error', function () {
		it('should format a error.', async function () {
			const flag = [];

			const logger = new Quack.Logger({
				format: Quack.Format.Error.format,
				assert: Quack.Format.Error.assert,
				appenders: [(message) => flag.push(message)],
			});

			await logger.log(meta, new Error('bar'));
			assert.equal(flag[0], '[1970-01-01T00:00:00.000Z] [INFO] [foo]: bar');
		});

		it('should throw if bad message.', async function () {
			const logger = new Quack.Logger({
				format: Quack.Format.Error.format,
				assert: Quack.Format.Error.assert,
			});

			await assert.rejects(() => logger.log(meta), {
				name: 'TypeError',
				message: 'Invalid "message", one "error" expected.',
			});
		});
	});

	describe('::General', function () {
		it('should format a string.', async function () {
			const flag = [];

			const logger = new Quack.Logger({
				format: Quack.Format.General.format,
				assert: Quack.Format.General.assert,
				appenders: [(message) => flag.push(message)],
			});

			await logger.log(meta, 'bar');
			assert.equal(flag[0], '[1970-01-01T00:00:00.000Z] [INFO] [foo]: bar');
		});

		it('should throw if bad message.', async function () {
			const logger = new Quack.Logger({
				format: Quack.Format.General.format,
				assert: Quack.Format.General.assert,
			});

			await assert.rejects(() => logger.log(meta), {
				name: 'TypeError',
				message: 'Invalid "message", one "string" expected.',
			});
		});
	});

	describe('::JSON', function () {
		it('should format any value.', async function () {
			const flag = [];

			const logger = new Quack.Logger({
				format: Quack.Format.JSON.format,
				assert: Quack.Format.JSON.assert,
				appenders: [(message) => flag.push(message)],
			});

			await logger.log(meta, 'bar');
			assert.equal(flag[0], '{"meta":{"label":"foo","time":"1970-01-01T00:00:00.000Z","level":"info"},"value":"bar"}');
		});
	});

	describe('::Apache', function () {
		it('should throw if bad message.', async function () {
			const logger = new Quack.Logger({
				format: Quack.Format.Apache.Preset.CLF,
				assert: Quack.Format.Apache.assert,
			});

			await assert.rejects(() => logger.log(meta), {
				name: 'TypeError',
				message: 'Invalid "message", one "apache log object" expected.',
			});
		});

		const listener = (req, res) => {
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify({ data: 'Hello World!' }));
		};

		const HttpAdapter = Quack.Format.Apache.HttpAdapter;

		describe('::HttpAdapter', function () {
			it('should throw if bad callback.', function () {
				assert.throws(() => HttpAdapter(() => {}), {
					name: 'TypeError',
					message: 'Invalid "callback", one "function" expected.',
				});
			});
		});

		describe('::LogObject', function () {
			it('should create from a http server.', async function () {
				const listenerProxy = HttpAdapter(listener, log => {
					assert.ok(log instanceof Quack.Format.Apache.LogObject);
				});

				const server = http.createServer(listenerProxy);
				const client = supertest('http://127.0.0.1:8080');

				server.listen(8080, '127.0.0.1');
				await client.get('/').expect(200);
				server.close();
			});
		});

		describe('::Preset', function () {
			describe('::CLF', function () {
				it('should get a log.', async function () {
					const flag = [];

					const logger = new Quack.Logger({
						format: Quack.Format.Apache.Preset.CLF,
						assert: Quack.Format.Apache.assert,
						appenders: [(message) => flag.push(message)],
					});

					const listenerProxy = HttpAdapter(listener, msg => {
						logger.log(meta, msg);
					});

					const server = http.createServer(listenerProxy);
					const client = supertest('http://127.0.0.1:8080');

					server.listen(8080, '127.0.0.1');
					await client.get('/').expect(200);
					server.close();
					assert.ok(typeof flag[0] === 'string');
				});
			});

			describe('::Combined', function () {
				it('should get a log.', async function () {
					const flag = [];

					const logger = new Quack.Logger({
						format: Quack.Format.Apache.Preset.Combined,
						assert: Quack.Format.Apache.assert,
						appenders: [(message) => flag.push(message)],
					});

					const listenerProxy = HttpAdapter(listener, msg => {
						logger.log(meta, msg);
					});

					const server = http.createServer(listenerProxy);
					const client = supertest('http://127.0.0.1:8080');

					server.listen(8080, '127.0.0.1');
					await client.get('/').expect(200);
					server.close();
					assert.ok(typeof flag[0] === 'string');
				});
			});
		});
	});
});
