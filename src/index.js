import esbuild from "esbuild";
import path from 'node:path';
import fs from 'node:fs/promises';

export default async function build(config = {}){

    const {
        source, 
        output,
        entries = []
    } = config;

    const outFolders = new Set([output]);

    //Resolve paths
    const BUILD_ENTRIES = entries.map(entry => {

        const aux = structuredClone(entry);

        //Resolve entry paths
        aux.options.entryPoints = entry.options.entryPoints.map(entryPoint => {

            return path.resolve(source, entryPoint);
        });

        //Resolve output path
        aux.options.outfile = path.resolve(output, entry.options.outfile);

        //Add output folder
        outFolders.add(path.dirname(aux.options.outfile));

        return aux;
    });

    console.log(outFolders);
    console.log(BUILD_ENTRIES);

    for(const folder of outFolders) {

        // if(!fs.existsSync(folder)){
            
        //     fs.mkdirSync(folder);
        // }
    }

    for(const {name, options} of BUILD_ENTRIES) {
    
        // try {
        //     await esbuild.build(options);

        //     console.log(`Build success: ${name}`);
        // } 
        // catch (error) {

        //     console.log(`Build error: ${name}`);
        //     console.error(error);
        // }
    }
}