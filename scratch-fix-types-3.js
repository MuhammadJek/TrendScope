const fs = require('fs');
const path = require('path');

const replaceInFile = (file, searchStr, replaceStr) => {
  const fullPath = path.join(__dirname, file);
  if (!fs.existsSync(fullPath)) return;
  let content = fs.readFileSync(fullPath, 'utf8');
  content = content.replace(searchStr, replaceStr);
  fs.writeFileSync(fullPath, content);
};

let content = fs.readFileSync(path.join(__dirname, 'app/trends/page.tsx'), 'utf8');
content = content.replace(/const products = getProducts\(\);/g, 'const products = await getProducts();');
content = content.replace(/const dashboard = getDashboardData\(\);/g, 'const dashboard = await getDashboardData();');
fs.writeFileSync(path.join(__dirname, 'app/trends/page.tsx'), content);

replaceInFile('auth.ts',
  `emailVerified: user.emailVerified ? new Date() : null,`,
  `emailVerified: (user.emailVerified ? new Date().toISOString() : null) as any,`
);

replaceInFile('components/data-source-badge.tsx',
  `Envato: "slate",`,
  `"Envato": "slate",`
);

let dsContent = fs.readFileSync(path.join(__dirname, 'components/data-source-badge.tsx'), 'utf8');
dsContent = dsContent.replace(/Record<Platform, "teal" \| "indigo" \| "rose">/g, 'Record<Platform, "teal" | "indigo" | "rose" | "slate">');
fs.writeFileSync(path.join(__dirname, 'components/data-source-badge.tsx'), dsContent);


console.log("Fixed part 3");

