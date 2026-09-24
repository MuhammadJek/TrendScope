const fs = require('fs');
const path = require('path');

const replaceInFile = (file, searchStr, replaceStr) => {
  const fullPath = path.join(__dirname, file);
  if (!fs.existsSync(fullPath)) return;
  let content = fs.readFileSync(fullPath, 'utf8');
  content = content.replace(searchStr, replaceStr);
  fs.writeFileSync(fullPath, content);
};

// 1. types.ts
replaceInFile('lib/types.ts',
  `export type Platform = "Digital Marketplace" | "E-Commerce" | "TikTok";`,
  `export type Platform = "Digital Marketplace" | "E-Commerce" | "TikTok" | "Envato";`
);
replaceInFile('lib/types.ts',
  `export type DataStatus = "Observed" | "Estimated" | "Unavailable" | "Demo";`,
  `export type DataStatus = "Observed" | "Estimated" | "Unavailable" | "Demo" | "Available";`
);
replaceInFile('lib/types.ts',
  `export type MetricType = "Rank" | "Price" | "Engagement" | "Freshness";`,
  `export type MetricType = "Rank" | "Price" | "Engagement" | "Freshness" | "Sales";`
);

// 2. services.ts (add missing properties)
replaceInFile('lib/services.ts',
  `          author: "Envato Author",
          url: p.url ?? undefined,
        }));`,
  `          author: "Envato Author",
          externalUrl: p.url ?? "",
          metricName: "Sales / Reviews",
          metricUnit: "sales",
          sourceReference: "Envato API",
          description: "Live data from Envato Market",
          change: null,
          color: "teal"
        }));`
);
replaceInFile('lib/services.ts',
  `if (filters.platform && filters.platform !== "all") {`,
  `if (filters.platform && filters.platform !== "all" && typeof filters.platform === "string") {`
);

// 3. app/page.tsx
replaceInFile('app/page.tsx',
  `const dashboard = getDashboardData();`,
  `const dashboard = await getDashboardData();`
);

// 4. app/trends/page.tsx
replaceInFile('app/trends/page.tsx',
  `const products = getProducts();
  const dashboard = getDashboardData();`,
  `const products = await getProducts();
  const dashboard = await getDashboardData();`
);

// 5. app/dzakiganteng/integrations/integration-cards.tsx
replaceInFile('app/dzakiganteng/integrations/integration-cards.tsx',
  `variant="destructive"`,
  `variant="default"`
);

console.log("Types fixed!");

