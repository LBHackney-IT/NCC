// https://medium.com/@amcdnl/version-stamping-your-app-with-the-angular-cli-d563284bb94d
const { gitDescribeSync } = require('git-describe');
const { version } = require('../package.json');
const { resolve, relative } = require('path');
const { writeFileSync } = require('fs-extra');

const git_path = resolve(__dirname, '../..'); // as this is in a subfolder.
const gitInfo = gitDescribeSync(git_path, {
    dirtyMark: false,
    dirtySemver: false
});

gitInfo.version = version;
// note: this version number is read from package.json, which we can update manually.

const file = resolve(__dirname, '..', 'src', 'environments', 'version.ts');
writeFileSync(file,
`// DO NOT MANUALLY EDIT OR CHECKIN!
/* tslint:disable */
export const VERSION = ${JSON.stringify(gitInfo, null, 4)};
/* tslint:enable */
`, { encoding: 'utf-8' });

console.log(`Wrote version info ${gitInfo.raw} to ${relative(resolve(__dirname, '..'), file)}`);
