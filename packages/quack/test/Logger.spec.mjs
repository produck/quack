import assert from 'node:assert/strict';
import * as Quack from '../src/index.mjs';

const meta = { label: 'foo', time: new Date(), level: 'info' };

describe('Quack::Logger', function () {
	describe('constructor()', function () {
		it('should create a Logger.', function () {
			new Quack.Logger();
		});
	});

	describe('.log()', function () {
		it('should write a log.', async function () {
			const flag = [];

			const logger = new Quack.Logger({
				format: (meta, message) => ([meta, message], ''),
				appenders: [(message) => flag.push(message)],
			});

			await logger.log(meta, 'bar');
			assert.deepEqual(flag, ['']);
		});

		it('should throw if bad meta.', async function () {
			const logger = new Quack.Logger();

			await assert.rejects(() => logger.log(), {
				name: 'TypeError',
				message: 'Invalid "", one "meta object" expected.',
			});
		});

		it('should throw if bad message.', async function () {
			const logger = new Quack.Logger();

			await assert.rejects(() => logger.log({
				label: 'foo',
				time: new Date(),
				level: 'info',
			}), {
				name: 'TypeError',
				message: 'Invalid "message", one "string" expected.',
			});
		});

		it('should throw if bad `format() => message`.', async function () {
			const logger = new Quack.Logger({
				format: () => null,
			});

			await assert.rejects(() => logger.log(meta, ''), {
				name: 'TypeError',
				message: 'Invalid "format() => message", one "string" expected.',
			});
		});
	});
});
