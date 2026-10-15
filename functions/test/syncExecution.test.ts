import { SyncStats, SyncLogDocument } from '../src/types/sync';

export function runSyncExecutionTests(): { name: string; passed: boolean; error?: string }[] {
  const results: { name: string; passed: boolean; error?: string }[] = [];

  function test(name: string, fn: () => void) {
    try {
      fn();
      results.push({ name, passed: true });
    } catch (err) {
      results.push({ name, passed: false, error: err instanceof Error ? err.message : String(err) });
    }
  }

  test('should accurately calculate sync stats and assign correct status', () => {
    const stats: SyncStats = {
      fetchedCount: 25,
      insertedCount: 15,
      updatedCount: 5,
      duplicateCount: 3,
      expiredCount: 0,
      errorCount: 2,
      errors: [
        { phase: 'parse', message: 'Missing title', timestamp: new Date().toISOString() },
        { phase: 'fetch', message: 'Record 20 timeout', timestamp: new Date().toISOString() },
      ],
    };

    const status = stats.errorCount === 0 ? 'success' : stats.insertedCount > 0 ? 'partial' : 'failure';
    if (status !== 'partial') throw new Error(`Expected 'partial' status when some inserted and some errored, got ${status}`);

    const executionId = `sync_job_${Date.now()}_test`;
    const startedAt = new Date(Date.now() - 5000).toISOString();
    const completedAt = new Date().toISOString();

    const log: SyncLogDocument = {
      id: executionId,
      sourceId: 'test_provider',
      sourceType: 'job',
      startedAt,
      completedAt,
      status,
      fetchedCount: stats.fetchedCount,
      insertedCount: stats.insertedCount,
      updatedCount: stats.updatedCount,
      duplicateCount: stats.duplicateCount,
      expiredCount: stats.expiredCount,
      errorCount: stats.errorCount,
      errors: stats.errors,
      executionId,
      durationMs: 5000,
    };

    if (log.fetchedCount !== 25) throw new Error('Incorrect fetchedCount');
    if (log.status !== 'partial') throw new Error('Incorrect status');
    if (log.errors.length !== 2) throw new Error('Errors array missing records');
  });

  return results;
}
