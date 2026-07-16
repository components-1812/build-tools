import RawLoader from "../src/plugins/esbuild/RawCSSLoader.js";
import TemplateStringMinifier from "../src/plugins/esbuild/TemplateStringMinifier.js";


export default {
    source: './test/src',
    output: './test/dist',
    entries: [
        {
            name: 'index.js',
            outfile: 'index.min.js',
            description: 'index entry file',

            //esbuild options
            sourcemap: true,
            alias: {
                '#utils': './test/src/utils',
            }
        },
    ],
    defaults: {
        '.js': {
            format: 'esm',
            minify: true,
            bundle: true,
            target: 'es2022',
            plugins: [
                TemplateStringMinifier({
                    html: true,
                    css: true,
                    svg: true
                }),
                //RawLoader()
            ]
        }
    }
}