import esbuild from "esbuild";
import {resolve, extname} from 'node:path';
import fs from 'node:fs/promises';

export default function RawCSSLoader({ minify = true, bundle = true } = {}) {
    
    return {
        name: 'raw-loader',
        setup(build) {

            build.onResolve({ filter: /\.css\?raw$/  }, (args) => {

                const { path, resolveDir } = args;

                return {
                    path: resolve(resolveDir, path.replace('?raw','')),
                    namespace: 'raw-file'
                };
            });

            build.onLoad({ filter: /.*/, namespace: 'raw-file' }, async (args) => {

                const { path } = args;

                let content = (await fs.readFile(path, 'utf8')).trim();

                const ext = extname(path);

                // Minify the CSS using esbuild transform API
                if(ext === '.css'){

                    const result = await esbuild.build({
                        entryPoints: [path],
                        write: false,
                        loader: {
                            '.css': 'css'
                        },
                        bundle,
                        minify,
                    });
                    
                    content = result.outputFiles[0].text.trim();
                }
        
                return {
                    contents: `export default ${JSON.stringify(content)};`,
                    loader: 'js'
                };
            });
        }
    };
}