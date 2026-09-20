const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../config.ts');
const dishesPath = path.join(__dirname, 'processed_dishes.json');

let configContent = fs.readFileSync(configPath, 'utf8');
const dishes = JSON.parse(fs.readFileSync(dishesPath, 'utf8'));

// 1. Update MenuItem interface
configContent = configContent.replace(
  /export interface MenuItem \{[\s\S]*?\n\}/,
  `export interface MenuItem {
  id: string;
  name: string;
  hindiName?: string;
  category: string;
  subCategory?: string;
  isVeg: boolean;
  price: number;
  description: string;
  spicyLevel: 1 | 2 | 3;
  isChefSpecial?: boolean;
  image: string;
  serves: string;
}`
);

// 2. Locate menu: [ ... ] as MenuItem[],
const menuStartPattern = '  menu: [\n';
const menuStartIndex = configContent.indexOf(menuStartPattern);
if (menuStartIndex === -1) {
  console.error('Could not find menu start pattern');
  process.exit(1);
}

const menuEndPattern = '] as MenuItem[],';
const menuEndIndex = configContent.indexOf(menuEndPattern, menuStartIndex);
if (menuEndIndex === -1) {
  console.error('Could not find menu end pattern');
  process.exit(1);
}

const newMenuJson = JSON.stringify(dishes, null, 4)
  .split('\n')
  .map(line => '  ' + line)
  .join('\n')
  .trim();

const beforeMenu = configContent.substring(0, menuStartIndex + '  menu: '.length);
const afterMenu = configContent.substring(menuEndIndex + menuEndPattern.length);

const updatedContent = `${beforeMenu}${newMenuJson} as MenuItem[],${afterMenu}`;

fs.writeFileSync(configPath, updatedContent, 'utf8');
console.log('Successfully updated config.ts with 159 official dishes!');
