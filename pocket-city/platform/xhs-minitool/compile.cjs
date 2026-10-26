const fs = require('fs'), path = require('path'), esbuild = require('esbuild');
const base = __dirname, stage = path.join(base,'.staging'), out=path.join(base,'dist','assets');
const names = JSON.parse(fs.readFileSync(path.join(stage,'three-symbols.json'),'utf8'));
const three=path.join(base,'node_modules','three','src','Three.js');
const entry=`import {${names.join(',')}} from ${JSON.stringify(three)}; window.THREE={${names.join(',')}};`;
const xrStub={name:'offline-no-xr',setup(build){build.onLoad({filter:/\.glsl\.js$/},args=>({contents:fs.readFileSync(args.path,'utf8').replace(/\/\/[^\r\n]*/g,''),loader:'js',resolveDir:path.dirname(args.path)}));build.onLoad({filter:/[/\\]webxr[/\\]WebXRManager\.js$/},args=>({contents:`import {EventDispatcher} from '../../core/EventDispatcher.js'; export class WebXRManager extends EventDispatcher { constructor(){super();this.enabled=false;this.isPresenting=false;this.cameraAutoUpdate=true;} setAnimationLoop(){} dispose(){} getSession(){return null;} getEnvironmentBlendMode(){return undefined;} getCamera(camera){return camera;} }`,loader:'js',resolveDir:path.dirname(args.path)}));}};
const common={target:['es2017','chrome61'],minify:true,legalComments:'none',charset:'utf8',logLevel:'warning'};
(async()=>{
 await esbuild.build({...common,stdin:{contents:entry,resolveDir:base,sourcefile:'engine-entry.js'},outfile:path.join(out,'engine.js'),bundle:true,format:'iife',plugins:[xrStub]});
 const license=fs.readFileSync(path.join(base,'node_modules','three','LICENSE'),'utf8');
 let engine=fs.readFileSync(path.join(out,'engine.js'),'utf8');
 engine=engine.replace(/https?:\/\/[^\s"'<>)}]+/g,url=>['http://www.w3.org/1999/xhtml','http://www.w3.org/2000/svg','http://www.w3.org/1999/xlink'].includes(url)?url:'offline-documentation');
 fs.writeFileSync(path.join(out,'engine.js'),'/*! '+license.replace(/\*\//g,'* /')+' */\n'+engine);
 for(const [input,name] of [['game-source.js','game.js'],['bridge-source.js','bridge.js'],['loader-source.js','loader.js']]) {
  const source=fs.readFileSync(path.join(stage,input),'utf8');
  const result=await esbuild.transform(source,common);fs.writeFileSync(path.join(out,name),result.code);
 }
})();
