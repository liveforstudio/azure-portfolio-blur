#!/usr/bin/env node
import { execSync } from 'child_process';
import { readdirSync } from 'fs';
function run(cmd){
  console.log('\n> ' + cmd + '\n');
  execSync(cmd, { stdio: 'inherit' });
}

try{
  run('node -v');
  run('npm -v');
  console.log('\n> cwd\n', process.cwd());
  console.log('\n> files\n', readdirSync(process.cwd()).join('\n'));
  run('npm ci');
  run('npm run build');
}catch(e){
  console.error('\nBuild debug script failed:', e.message);
  process.exit(2);
}
