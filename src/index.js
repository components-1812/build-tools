import esbuild from "esbuild";
import {resolve, dirname, extname} from 'node:path';
import fs from 'node:fs/promises';

export default async function build(config = {}){

    const {
        source, 
        output,
        entries = [],
        defaults = {}
    } = config;

    const OutputDirs = new Set([output]);

    //Resolve paths
    const BUILD_ENTRIES = entries.map(entry => {

        const {name, description, outfile, ...options} = entry;

        const extension = extname(name);
     
        const result = {
            name, 
            description,
            esbuild: Object.assign({}, defaults[extension], options, {
                entryPoints: [
                    resolve(source, name)
                ],
                outfile: resolve(output, outfile)
            })
        }

        console.log(result.esbuild);

        //Add output folder
        OutputDirs.add(dirname(result.esbuild.outfile));

        return result;
    });


    //Create output dirs
    for(const folder of OutputDirs) {

        await fs.mkdir(folder, {recursive: true});
    }

    //Start building each entry
    for(const {name, esbuild:options} of BUILD_ENTRIES) {
    
        try {
            await esbuild.build(options);

            console.log(`✅ Build success: ${name}`);
        } 
        catch (error) {

            console.log(`❌ Build error: ${name}`);
            console.error(error);
        }
    }
}