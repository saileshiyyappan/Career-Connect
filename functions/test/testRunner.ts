import { runJobNormalizationTests } from './jobNormalization.test';
import { runNewsNormalizationTests } from './newsNormalization.test';
import { runContentHashingTests } from './contentHashing.test';
import { runSyncExecutionTests } from './syncExecution.test';
import { runHimalayasTests } from './himalayas.test';
import { runLiveNewsSyncTests } from './liveNewsSync.test';

export async function runAllTests() {
  console.log('==============================================');
  console.log('  CAREERCONNECT BACKEND FOUNDATION TEST RUNNER');
  console.log('==============================================\n');

  const liveNewsResults = await runLiveNewsSyncTests();

  const allResults = [
    ...runHimalayasTests(),
    ...runJobNormalizationTests(),
    ...runNewsNormalizationTests(),
    ...liveNewsResults,
    ...runContentHashingTests(),
    ...runSyncExecutionTests(),
  ];

  let passed = 0;
  let failed = 0;

  for (const res of allResults) {
    if (res.passed) {
      console.log(`  ✅ PASS: ${res.name}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${res.name}`);
      console.error(`     Error: ${res.error}`);
      failed++;
    }
  }

  console.log('\n----------------------------------------------');
  console.log(`Total: ${allResults.length} | Passed: ${passed} | Failed: ${failed}`);
  console.log('----------------------------------------------\n');

  if (failed > 0) {
    process.exit(1);
  }
}

if (require.main === module) {
  runAllTests().catch((e) => {
    console.error('Fatal test error:', e);
    process.exit(1);
  });
}


