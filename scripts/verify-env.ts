import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// ESM compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load env vars
// In CI, these might be set directly in the environment, so we also check process.env
// But for local check, we try to load .env.local or .env
const envFiles = ['.env.local', '.env'];
for (const file of envFiles) {
  const envPath = path.join(rootDir, file);
  if (fs.existsSync(envPath)) {
    console.log(`Loading environment from ${file}...`);
    dotenv.config({ path: envPath });
  }
}

interface ValidationRule {
  key: string;
  required: boolean;
  validate?: (value: string) => string | null; // returns error message or null
}

const rules: ValidationRule[] = [
  {
    key: 'VITE_SUPABASE_URL',
    required: true,
    validate: (val) => {
      if (!val.startsWith('https://')) return 'Must start with https://';
      if (val.includes('example.com')) return 'Cannot use example.com';
      return null;
    }
  },
  {
    key: 'VITE_SUPABASE_ANON_KEY',
    required: true,
    validate: (val) => {
      if (val === 'your-anon-key-here') return 'Cannot use placeholder value';
      if (val.length < 20) return 'Key seems too short';
      return null;
    }
  },
  {
    key: 'VITE_PRODUCTION_URL',
    required: process.env.NODE_ENV === 'production', // Only required in prod
    validate: (val) => {
      if (!val) return null;
      if (!val.startsWith('https://')) return 'Must start with https://';
      if (val.includes('localhost')) return 'Cannot use localhost in production';
      return null;
    }
  }
];

console.log('🔍 Starting Environment Variable Verification...');

let errorCount = 0;

for (const rule of rules) {
  const value = process.env[rule.key];

  if (!value) {
    if (rule.required) {
      console.error(`❌ Missing required variable: ${rule.key}`);
      errorCount++;
    } else {
      console.warn(`⚠️  Missing optional variable: ${rule.key}`);
    }
    continue;
  }

  if (rule.validate) {
    const error = rule.validate(value);
    if (error) {
      console.error(`❌ Invalid value for ${rule.key}: ${error}`);
      errorCount++;
    } else {
      console.log(`✅ ${rule.key} is valid.`);
    }
  } else {
    console.log(`✅ ${rule.key} is present.`);
  }
}

if (errorCount > 0) {
  console.error(`\n💥 Verification failed with ${errorCount} errors.`);
  console.error('Please update your .env file or CI/CD secrets with real production values.');
  process.exit(1);
} else {
  console.log('\n✨ All environment variables verified successfully.');
  process.exit(0);
}
