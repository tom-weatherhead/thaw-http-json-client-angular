// thaw-http-json-client-angular/rollup.config.js

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { terser } = require('rollup-plugin-terser');

export default [
	{
		input: './dist/types/main.js',
		output: [
			{
				file: 'dist/thaw-http-json-client-angular.cjs.js',
				format: 'cjs',
				exports: 'named'
			},
			{
				file: 'dist/thaw-http-json-client-angular.esm.js',
				format: 'es',
				compact: true,
				plugins: [terser()]
			},
			{
				file: 'dist/thaw-http-json-client-angular.js',
				name: 'thaw-http-json-client-angular',
				format: 'umd',
				compact: true,
				plugins: [terser()]
			}
		]
	}
];
