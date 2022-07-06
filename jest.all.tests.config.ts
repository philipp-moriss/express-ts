import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
	verbose: true,
	preset: 'ts-jest',
	testRegex: ['e2e-spec.ts$', 'spec.ts$'],
};

export default config;
