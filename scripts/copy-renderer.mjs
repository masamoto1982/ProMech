import { cpSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const sourceDir = join(process.cwd(), 'src', 'renderer');
const targetDir = join(process.cwd(), 'dist', 'renderer');

mkdirSync(targetDir, { recursive: true });
cpSync(sourceDir, targetDir, { recursive: true });

console.log(`Copied renderer assets: ${sourceDir} -> ${targetDir}`);
