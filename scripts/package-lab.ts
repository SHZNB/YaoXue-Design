import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist-lab');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

const experimentsDir = path.join(rootDir, 'src', 'experiments');
const experiments = fs.readdirSync(experimentsDir)
  .filter(file => file.endsWith('.tsx') && !file.includes('test'));

console.log(`📦 Packaging ${experiments.length} experiments...`);

experiments.forEach(exp => {
  const name = path.basename(exp, '.tsx');
  const srcPath = path.join(experimentsDir, exp);
  const destPath = path.join(distDir, name);
  
  // Create temp directory for component
  if (!fs.existsSync(destPath)) fs.mkdirSync(destPath);
  
  // Copy source
  fs.copyFileSync(srcPath, path.join(destPath, 'index.tsx'));
  
  // Create package.json
  const pkgJson = {
    name: `@yaoxue-lab/${name.toLowerCase()}`,
    version: '1.0.0',
    main: 'index.tsx',
    peerDependencies: {
      "react": "^18.0.0",
      "@react-three/fiber": "^8.0.0"
    }
  };
  fs.writeFileSync(path.join(destPath, 'package.json'), JSON.stringify(pkgJson, null, 2));
  
  // Pack
  try {
    execSync(`npm pack`, { cwd: destPath, stdio: 'inherit' });
    console.log(`✅ Packed ${name}`);
  } catch (err) {
    console.error(`❌ Failed to pack ${name}`, err);
  }
});

console.log(`\n🎉 All experiments packaged in ${distDir}`);
