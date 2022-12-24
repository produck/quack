import fs from 'node:fs/promises';

import * as Quack from '../src/index.mjs';

const meta = { label: 'foo', time: new Date(), level: 'info' };

describe('Quack::Appender', function () {
	describe('::Console', function () {
		it('should ok.', function () {
			const logger = new Quack.Logger({
				appenders: [Quack.Appender.Console()],
			});

			logger.log(meta, 'bar');
		});
	});

	describe('::Stdout', function () {
		it('should ok.', function () {
			const logger = new Quack.Logger({
				appenders: [Quack.Appender.Stdout()],
			});

			logger.log(meta, 'bar');
		});
	});

	describe('::Stderr', function () {
		it('should ok.', function () {
			const logger = new Quack.Logger({
				appenders: [Quack.Appender.Stderr()],
			});

			logger.log(meta, 'bar');
		});
	});

	describe('::RollingFile', function () {
		this.beforeEach(async () => {
			try {
				await fs.unlink('f00.log');
			} catch {
				'donw';
			}
		});

		it('should create a appender by default.', async function () {
			Quack.Appender.RollingFile({
				pathname: './foo.log',
			});
		});

		it('should create a appender by specific options.', async function () {
			Quack.Appender.RollingFile({
				pathname: './foo.log',
				size: 100000,
				number: 10,
				encoding: 'utf-8',
				mode: 0o600,
				flags: 'a',
				keepFileExt: false,
				compress: true,
			});
		});

		it('should write ok.', async function () {
			const logger = new Quack.Logger({
				appenders: [
					Quack.Appender.RollingFile({
						pathname: 'foo.log',
					}),
				],
			});

			await logger.log(meta, 'bar');
			await new Promise(resolve => setTimeout(resolve, 2000));
			await fs.access('foo.log');
		});
	});
});
