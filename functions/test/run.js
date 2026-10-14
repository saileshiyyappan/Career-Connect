// Invokes compiled test runner
const path = require('path');
const runnerPath = path.resolve(__dirname, '../dist/test/testRunner.js');

try {
  const { runAllTests } = require(runnerPath);
  runAllTests();
} catch (err) {
  console.error('Failed to execute test runner:', err);
  process.exit(1);
}
