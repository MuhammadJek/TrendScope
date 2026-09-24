const fs = require('fs');
const path = require('path');

const replaceInFile = (file, searchStr, replaceStr) => {
  const fullPath = path.join(__dirname, file);
  let content = fs.readFileSync(fullPath, 'utf8');
  content = content.replace(searchStr, replaceStr);
  fs.writeFileSync(fullPath, content);
};

// Fix dashboard
replaceInFile('app/dashboard/page.tsx',
  `  const dashboard = getDashboardData(platform);
  const dashboard = await getDashboardData(platform);`,
  `  const dashboard = await getDashboardData(platform);`
);

// Fix rankings
replaceInFile('app/rankings/page.tsx',
  `  const products = getRankedProducts(platform, category);
  const products = await getRankedProducts(platform, category);`,
  `  const products = await getRankedProducts(platform, category);`
);

// Fix products
replaceInFile('app/products/page.tsx',
  `  const result = filterProducts(filters);
  const result = await filterProducts(filters);`,
  `  const result = await filterProducts(filters);`
);

// Fix products/[slug]
replaceInFile('app/products/[slug]/page.tsx',
  `export function generateStaticParams() {
  return getProducts().map((product) => ({ slug: product.slug }));
export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}`,
  `export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}`
);

// Fix products/[slug] part 2
replaceInFile('app/products/[slug]/page.tsx',
  `  const product = getProductBySlug(slug);
  const product = await getProductBySlug(slug);`,
  `  const product = await getProductBySlug(slug);`
);

replaceInFile('app/products/[slug]/page.tsx',
  `  const related = getRelatedProducts(product);
  const related = await getRelatedProducts(product);`,
  `  const related = await getRelatedProducts(product);`
);

console.log("Fixed files!");

