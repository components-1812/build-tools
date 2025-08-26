import esbuild from "esbuild";
import path from 'node:path';
import fs from 'node:fs/promises';
import { minify } from 'html-minifier-terser';

export default function HtmlMinifier({svg = false} = {}) {

    const HTML_REGEX = /\/\*html\*\/\s*`([\s\S]*?)`/g;
    const SVG_REGEX = /\/\*svg\*\/\s*`([\s\S]*?)`/g;

    async function minifyContents(regex,contents) {

        const matchs = [...contents.matchAll(regex)];

        if(matchs.length === 0) return contents;

        for(const match of matchs) {
            
            const [_, html] = match;


            const minified = await minify(html, {
                removeComments: true,
                collapseWhitespace: true,
                collapseInlineTagWhitespace: true,
                removeAttributeQuotes: true,
                collapseBooleanAttributes: true,
            });

            contents = contents.replace('`' + html + '`', '`' + minified + '`');
        }

        return contents;
    }


    return {
        name: 'html-minifier',
        setup(build) {
            
            build.onLoad({ filter: /\.js$/ }, async (args) => {

                let contents = await fs.readFile(args.path, 'utf8');

                contents = await minifyContents(HTML_REGEX, contents);

                if(svg){

                    contents = await minifyContents(SVG_REGEX, contents);
                }

                return { contents, loader: 'default' }
            })
        }
    }
}