import esbuild from "esbuild";
import path from 'node:path';
import fs from 'node:fs/promises';

export default function RawCSSLoader() {
    
    return {
        name: 'raw-css-loader',
        setup(build) {

            build.onResolve({ filter: /\.css\?raw$/  }, (args) => {

                return {
                    path: path.resolve(args.resolveDir, args.path.replace('?raw','')),
                    namespace: 'raw-file'
                };
            });

            build.onLoad({ filter: /.*/, namespace: 'raw-file' }, async (args) => {

                const content = await fs.readFile(args.path, 'utf8');

                // Minify the CSS using esbuild transform API
                const { code } = await esbuild.transform(content, {
                    loader: "css",
                    minify: true,
                });

                return {
                    contents: `export default ${JSON.stringify(code.trim())};`,
                    loader: 'js'
                };
            });
        }
    };
}