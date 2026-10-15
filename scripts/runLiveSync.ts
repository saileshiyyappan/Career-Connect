import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
} from 'firebase/firestore';
import { NewsParser } from '../functions/src/news/parser';
import { NewsNormalizer } from '../functions/src/news/normalizer';
import { JobParser } from '../functions/src/jobs/parser';
import { JobNormalizer } from '../functions/src/jobs/normalizer';
import { DEFAULT_NEWS_SOURCES } from '../functions/src/repositories/NewsSourceRepository';
import { DEFAULT_JOB_SOURCES } from '../functions/src/repositories/JobSourceRepository';
import * as dotenv from 'dotenv';
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'careerconnect-2525',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function removeUndefined<T>(obj: T): T {
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(removeUndefined) as unknown as T;
  }
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      result[key] = removeUndefined(value);
    }
  }
  return result as T;
}

async function syncNews() {
  console.log('\n--- STARTING REAL CAREER NEWS SYNCHRONIZATION ---');
  let totalArticles = 0;

  for (const source of DEFAULT_NEWS_SOURCES) {
    try {
      console.log(`Fetching feed: ${source.name} (${source.feedUrl})...`);
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);

      const response = await fetch(source.feedUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) CareerConnect-News-Aggregator/2.0',
          'Accept': 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*',
        },
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!response.ok) {
        console.error(`  Failed to fetch ${source.name}: HTTP ${response.status}`);
        continue;
      }

      const xml = await response.text();
      const rawArticles = NewsParser.parseXmlFeed(xml);
      console.log(`  Discovered ${rawArticles.length} raw articles.`);

      let saved = 0;
      for (const raw of rawArticles) {
        const parsed = NewsParser.parseRawArticle(raw, source.feedUrl);
        if (!parsed) continue;

        const normalized = NewsNormalizer.normalize(parsed, {
          sourceId: source.id,
          sourceName: source.name,
          defaultSourceUrl: source.feedUrl,
          defaultCategory: source.categories[0] || 'career_advice',
        });

        const cleanDoc = removeUndefined(normalized);
        await setDoc(doc(db, 'career_news', cleanDoc.id), cleanDoc, { merge: true });
        saved++;
      }

      console.log(`  ✅ Saved ${saved} articles for ${source.name}`);
      totalArticles += saved;

      // Update news_source doc
      const cleanSource = removeUndefined({
        ...source,
        lastSuccessfulSync: new Date().toISOString(),
        lastAttemptedSync: new Date().toISOString(),
        status: 'active',
        articlesCount: saved,
      });
      await setDoc(doc(db, 'news_sources', source.id), cleanSource, { merge: true });

    } catch (err: any) {
      console.error(`  ❌ Error syncing ${source.name}:`, err.message);
    }
  }

  console.log(`Total real news articles synchronized: ${totalArticles}`);
}

async function syncJobs() {
  console.log('\n--- STARTING REAL EXTERNAL JOB SYNCHRONIZATION ---');
  let totalJobs = 0;

  for (const source of DEFAULT_JOB_SOURCES) {
    if (!source.enabled) continue;
    try {
      console.log(`Fetching jobs from: ${source.name} (${source.baseUrl})...`);
      const isHimalayas = source.id === 'himalayas' || (source.baseUrl && source.baseUrl.includes('himalayas.app'));

      if (isHimalayas) {
        let cursor: string | undefined = undefined;
        let pagesToFetch = 4; // Fetch 4 pages (~80 real jobs)
        let saved = 0;

        for (let page = 0; page < pagesToFetch; page++) {
          const url = new URL(source.baseUrl);
          if (cursor) {
            url.searchParams.set('cursor', cursor);
          } else if (page > 0) {
            url.searchParams.set('offset', String(page * 20));
          }

          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 25000);

          const response = await fetch(url.toString(), {
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'CareerConnect-Aggregator/2.0 (+https://careerconnect.app)',
            },
            signal: controller.signal,
          });
          clearTimeout(timeout);

          if (!response.ok) {
            console.error(`  HTTP error ${response.status}: ${response.statusText}`);
            break;
          }

          const data = (await response.json()) as { jobs?: any[]; nextCursor?: string };
          const rawJobs = data?.jobs || [];
          console.log(`  Page ${page + 1}: Discovered ${rawJobs.length} raw jobs.`);

          for (const raw of rawJobs) {
            const parsed = JobParser.parse(raw, source.baseUrl);
            if (!parsed) continue;

            const normalized = JobNormalizer.normalize(parsed, {
              sourceId: source.id,
              sourceName: source.name,
              defaultSourceUrl: source.baseUrl,
            });

            const cleanDoc = removeUndefined(normalized);
            await setDoc(doc(db, 'external_jobs', cleanDoc.id), cleanDoc, { merge: true });
            saved++;
          }

          cursor = data?.nextCursor;
          if (!cursor && rawJobs.length < 20) break;
        }

        console.log(`  ✅ Saved ${saved} jobs for ${source.name}`);
        totalJobs += saved;

        // Update job_sources doc
        const cleanSource = removeUndefined({
          ...source,
          lastSuccessfulSync: new Date().toISOString(),
          lastAttemptedSync: new Date().toISOString(),
          status: 'active',
          jobsCount: saved,
        });
        await setDoc(doc(db, 'job_sources', source.id), cleanSource, { merge: true });
      }
    } catch (err: any) {
      console.error(`  ❌ Error syncing ${source.name}:`, err.message);
    }
  }

  console.log(`Total real external jobs synchronized: ${totalJobs}`);
}

async function run() {
  await syncNews();
  await syncJobs();

  // Create sync log
  const logId = `sync_${Date.now()}`;
  await setDoc(doc(db, 'sync_logs', logId), {
    id: logId,
    timestamp: new Date().toISOString(),
    status: 'success',
    type: 'initial_pmt3_live_sync',
  });

  console.log('\n--- SYNCHRONIZATION RUN FINISHED ---');
  process.exit(0);
}

run().catch(err => {
  console.error('Fatal sync error:', err);
  process.exit(1);
});
