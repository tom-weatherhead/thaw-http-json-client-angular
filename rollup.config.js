// thaw-http-json-client-angular/rollup.config.js

/**
 * Copyright (c) Tom Weatherhead. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in
 * the LICENSE file in the root directory of this source tree.
 */

'use strict';

// import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

export default {
	input: './dist/types/main.js',
	output: [
		// {
		// 	file: 'dist/thaw-http-json-client-angular.cjs.js',
		// 	format: 'cjs',
		// 	exports: 'named'
		// },
		{
			file: 'dist/thaw-http-json-client-angular.esm.js',
			format: 'es',
			esModule: true,
			compact: true // ,
			// plugins: [terser()]
		} // ,
		// {
		// 	file: 'dist/thaw-http-json-client-angular.js',
		// 	name: 'thaw-http-json-client-angular',
		// 	format: 'umd',
		// 	compact: true // ,
		// 	// plugins: [terser()]
		// }
	],
	context: 'this',
	// See https://rollupjs.org/guide/en/#warning-treating-module-as-external-dependency :
	external: ['@angular/common/http', 'rxjs', 'rxjs/operators'],
	// plugins: [nodeResolve(), terser()]
	plugins: [terser()]
};
