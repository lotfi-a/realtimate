import chalk from 'chalk';
import { execSync } from 'child_process';
import fs from 'fs';

execSync('npm install atlas-app-services-cli');

const appName = process.argv.pop();
const appDir = process.cwd() + '/apps/' + appName;
const sourceDir = process.cwd() + '/src/' + appName;

[appDir,sourceDir].forEach(dir => fs.mkdirSync(dir, {recursive: true}));

execSync(`npx appservices apps init -n ${appName}` , {cwd: appDir});
['root_config.json', '.mdb'].forEach(file => fs.rmSync(`${appDir}/${file}`, {recursive: true}));

fs.writeFileSync(
  `${process.cwd()}/src/${appName}/example.ts`,
  fs.readFileSync(`${__dirname}/assets/example.template.ts`)
);

// if github action, then update apps.json
let apps = [{ name: appName! }];
try {
  const jsonApps = fs.readFileSync(
    process.cwd() + '/.github/workflows/apps.json'
  );
  
  if (jsonApps) {
    apps = JSON.parse(jsonApps.toString());
    if (!apps.find(({ name }) => name === appName)) {
      apps.push({ name: appName! });
    }
  }
} catch(err) {
  //pass
}

fs.writeFileSync(
  process.cwd() + '/.github/workflows/apps.json',
  JSON.stringify(apps, null, 2)
);

execSync('npm remove atlas-app-services-cli');
console.log(chalk.redBright(`${appName} created 🚀 !`));
