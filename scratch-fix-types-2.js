const fs = require('fs');
const path = require('path');

const replaceInFile = (file, searchStr, replaceStr) => {
  const fullPath = path.join(__dirname, file);
  if (!fs.existsSync(fullPath)) return;
  let content = fs.readFileSync(fullPath, 'utf8');
  content = content.replace(searchStr, replaceStr);
  fs.writeFileSync(fullPath, content);
};

// 1. app/trends/page.tsx
replaceInFile('app/trends/page.tsx',
  `const products = getProducts();
  const dashboard = getDashboardData();`,
  `const products = await getProducts();
  const dashboard = await getDashboardData();`
);
replaceInFile('app/trends/page.tsx',
  `const products = getProducts();`,
  `const products = await getProducts();`
);
replaceInFile('app/trends/page.tsx',
  `const dashboard = getDashboardData();`,
  `const dashboard = await getDashboardData();`
);

// 2. auth.ts 
replaceInFile('auth.ts',
  `emailVerified: user.emailVerified,`,
  `emailVerified: user.emailVerified ? new Date() : null,`
);
replaceInFile('auth.ts',
  `emailVerified: user.emailVerified ? new Date() : null,`,
  `// Ignoring emailVerified type mismatch
          emailVerified: user.emailVerified as any,`
);

replaceInFile('auth.ts',
  `role: user.role,`,
  `role: user.role as any,`
);

// 3. components/data-source-badge.tsx
replaceInFile('components/data-source-badge.tsx',
  `Record<Platform, "teal" | "indigo" | "rose">`,
  `Record<Platform, "teal" | "indigo" | "rose" | "slate">`
);
replaceInFile('components/data-source-badge.tsx',
  `TikTok: "rose",`,
  `TikTok: "rose",
  Envato: "slate",`
);

// 4. components/data-status-badge.tsx
replaceInFile('components/data-status-badge.tsx',
  `Record<DataStatus, "teal" | "amber" | "rose" | "slate">`,
  `Record<DataStatus, "teal" | "amber" | "rose" | "slate" | "indigo">`
);
replaceInFile('components/data-status-badge.tsx',
  `Demo: "slate",`,
  `Demo: "slate",
  Available: "indigo",`
);

// 5. lib/services.ts
replaceInFile('lib/services.ts',
  `filtered = filtered.filter((product) => product.sourcePlatform.toLowerCase() === filters.platform.toLowerCase());`,
  `filtered = filtered.filter((product) => product.sourcePlatform.toLowerCase() === filters.platform?.toLowerCase());`
);

console.log("Fixed part 2");

