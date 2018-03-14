/* eslint-env node */
const path = require('path');

const binPath = require.resolve('../bin/cli-runner.js');
const {spawn} = require('child_process');

function run(command, options) {
  const opts = {
    stdio: 'inherit',
    ...options,
  };
  const child = spawn('node', ['-e', command], opts);
  const stdoutLines = [];
  const stderrLines = [];
  const promise = new Promise((resolve, reject) => {
    child.stdout &&
      child.stdout.on('data', data => {
        stdoutLines.push(data.toString());
      });
    child.stderr &&
      child.stderr.on('data', data => {
        stderrLines.push(data.toString());
      });
    child.on('close', code => {
      const stdout = stdoutLines.join('\n');
      const stderr = stderrLines.join('\n');
      if (code === 0 || code === null) {
        resolve({stdout, stderr});
      } else {
        reject({stdout, stderr, code});
      }
    });
    child.on('error', e => {
      reject(e);
    });
  });
  promise.proc = child;
  return promise;
}

function withRunner(args) {
  return `require('${binPath}').run('${args}')`;
}

function cmd(args, options) {
  return run(withRunner(args), options);
}

const dir = path.resolve(__dirname, './example');
cmd(`build --dir=${dir} --production`).then(
  output => {
    console.log('Success! Output is:', output);
  },
  output => {
    console.log('Failure! Output is:', output);
  }
);

// Doing this instead DOES work, and will then prime cache appropriately.
// const builder = require('../commands/build.js');
// builder.run({dir, production: true});
