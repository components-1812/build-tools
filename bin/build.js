#!/usr/bin/env node

import { parseArgs } from "node:util";
import { resolve } from "node:path";
import { existsSync } from "node:fs";
import build from "../src/index.js";

//Config
const DEFAULT_CONFIG = {
    source: 'src',
    output: 'dist',
    entries: [],
    defaults: {}
};

const args = parseArgs({
    args: process.argv.slice(2),
    options: {},
    allowPositionals: true
})

const [configSrc = 'build.config.js'] = args.positionals;

const configFilePath = resolve(process.cwd(), configSrc);

if(!existsSync(configFilePath)) throw new Error("Build config not found: " + configFilePath);


//Load config
const configFile =  Object.assign({}, DEFAULT_CONFIG, (await import(`file://${configFilePath}`)).default);

const CONFIG = {
    source: resolve(process.cwd(), configFile.source),
    output: resolve(process.cwd(), configFile.output),
    entries: configFile.entries,
    defaults: configFile.defaults
};


await build(CONFIG);