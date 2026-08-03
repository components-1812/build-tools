
import fs from 'node:fs/promises';
import { minify } from 'html-minifier-terser';
import CleanCSS from 'clean-css'; // internal deps of "html-minifier-terser"

export default function TemplateStringMinifier({svg = false, html = false, css = false} = {}) {

    const HTML_REGEX = /\/\*html\*\/\s*`([\s\S]*?)`/g;
    const SVG_REGEX = /\/\*svg\*\/\s*`([\s\S]*?)`/g;
    const CSS_REGEX = /\/\*css\*\/\s*`([\s\S]*?)`/g;

    async function minifyHTML(regex, contents) {

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
                minifyCSS: true,
                minifyJS: true,
            });

            contents = contents.replace('`' + html + '`', () => '`' + minified + '`');
        }

        return contents;
    }

    async function minifySVG(regex, contents) {

        const matchs = [...contents.matchAll(regex)];

        if(matchs.length === 0) return contents;

        for(const match of matchs) {
            
            const [_, svg] = match;

            const minified = await minify(svg, {
                collapseWhitespace: true,
                removeComments: true,
                removeAttributeQuotes: false,
                collapseBooleanAttributes: false,
            });

            contents = contents.replace('`' + svg + '`', () => '`' + minified + '`');
        }

        return contents;
    }

    // Inicializamos CleanCSS una sola vez
    const cleanCSS = new CleanCSS();

    function minifyCSS(regex, contents) {

        const matchs = [...contents.matchAll(regex)];

        if(matchs.length === 0) return contents;

        for(const match of matchs) {

            const [_, cssContent] = match;

            const result = cleanCSS.minify(cssContent);

            const minified = result.styles; 

            contents = contents.replace('`' + cssContent + '`', () => '`' + minified + '`');
        }

        return contents;
    }

    return {
        name: 'template-string-minifier',
        setup(build) {
            
            build.onLoad({ filter: /\.js$/ }, async (args) => {

                let contents = await fs.readFile(args.path, 'utf8');

                if(html) contents = await minifyHTML(HTML_REGEX, contents);
                if(svg) contents = await minifySVG(SVG_REGEX, contents);
                if(css) contents = await minifyCSS(CSS_REGEX, contents);
  
                return { 
                    contents, 
                    loader: 'default' 
                }
            })
        }
    }
}