import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const reportPath = path.join(rootDir, 'test-results.json');
const outputPath = path.join(rootDir, 'docs', 'test_report.md');

// Generate test report
async function generateReport() {
  console.log('Generating test report...');

  if (!fs.existsSync(reportPath)) {
    console.error('No test results found. Please run "npm run test:json" first.');
    process.exit(1);
  }

  const results = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
  const date = new Date().toLocaleString();

  let md = `# Test Report\n\n`;
  md += `**Date:** ${date}\n`;
  md += `**Total Tests:** ${results.numTotalTests}\n`;
  md += `**Passed:** ${results.numPassedTests}\n`;
  md += `**Failed:** ${results.numFailedTests}\n`;
  md += `**Duration:** ${(results.testResults[0]?.endTime - results.testResults[0]?.startTime) / 1000}s\n\n`;

  md += `## Test Suites\n\n`;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  results.testResults.forEach((suite: any) => {
    const fileName = path.relative(rootDir, suite.name);
    const statusIcon = suite.status === 'passed' ? '✅' : '❌';
    
    md += `### ${statusIcon} ${fileName}\n\n`;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    suite.assertionResults.forEach((test: any) => {
      const testIcon = test.status === 'passed' ? '✔' : '✖';
      md += `- ${testIcon} **${test.title}** (${test.duration}ms)\n`;
      
      if (test.status === 'failed') {
        md += `  \`\`\`\n  ${test.failureMessages.join('\n')}\n  \`\`\`\n`;
      }
    });
    md += '\n';
  });

  if (!fs.existsSync(path.join(rootDir, 'docs'))) {
    fs.mkdirSync(path.join(rootDir, 'docs'));
  }

  fs.writeFileSync(outputPath, md);
  console.log(`Test report generated at: ${outputPath}`);
}

generateReport();
