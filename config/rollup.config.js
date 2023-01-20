import resolve from '@rollup/plugin-node-resolve'; // locate and bundle dependencies in node_modules (mandatory)
import babel   from 'rollup-plugin-babel';
import injectProcessEnv from 'rollup-plugin-inject-process-env';




const getBabelOptions = ({ useESModules }) => ({
  exclude       : '**/node_modules/**',
  runtimeHelpers: true,
});

export default {
    input  : 'src/main.js',
    output : [
        {
            format: 'umd',
            name  : 'Ritual',
            file  : 'build/bundle.js',
            inlineDynamicImports: true,
        }
    ],
    plugins: [
        resolve(),
        babel(getBabelOptions({ useESModules: true })),
        injectProcessEnv({
          NODE_ENV: process.env.NODE_ENV,
        }),
    ]
};
