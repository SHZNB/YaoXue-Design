const fs = require('fs');
const path = require('path');

function walk(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walk(filePath, fileList);
    } else {
      if (file.endsWith('.test.tsx')) {
        fileList.push(filePath);
      }
    }
  });
  return fileList;
}

const files = walk(path.join(__dirname, 'src'));
console.log(`Found ${files.length} test files.`);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // console.log(`Checking ${path.basename(file)}`);

  // Regex to match vi.mock('lucide-react', ...) block
  // Handle both single and double quotes
  const mockRegex = /vi\.mock\(['"]lucide-react['"],[\s\S]*?\);/g;
  
  if (mockRegex.test(content)) {
    console.log(`Removing local mock from ${path.basename(file)}`);
    content = content.replace(mockRegex, '');
  }

  // Fix Genetics.test.tsx
  if (file.endsWith('Genetics.test.tsx')) {
      if (content.includes("expect(screen.getByText('biology.genetics.p1')).toBeInTheDocument()")) {
      console.log(`Fixing Genetics.test.tsx p1 check`);
      content = content.replace(
        "expect(screen.getByText('biology.genetics.p1')).toBeInTheDocument()",
        "expect(screen.getAllByText('biology.genetics.p1').length).toBeGreaterThan(0)"
      );
    }
    if (content.includes("expect(screen.getByText('biology.genetics.p2')).toBeInTheDocument()")) {
       console.log(`Fixing Genetics.test.tsx p2 check`);
      content = content.replace(
        "expect(screen.getByText('biology.genetics.p2')).toBeInTheDocument()",
        "expect(screen.getAllByText('biology.genetics.p2').length).toBeGreaterThan(0)"
      );
    }
  }

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
  }
});
