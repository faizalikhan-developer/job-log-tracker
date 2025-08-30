import { addJob, updateJob, deleteJob, getJobs, getJobsByFilter } from '../services/db';
import Dexie from 'dexie';

describe('Database Operations', () => {
  let db;

  beforeEach(async () => {
    db = new Dexie('JobLogTrackerTest');
    db.version(1).stores({
      jobs: 'id, company, day, mailDelivered, resumeFormat, mailStatus, response, platforms, createdAt, updatedAt, synced',
      deletedJobs: 'id'
    });
    await db.delete();
    await db.open();
    jest.spyOn(window, 'crypto', 'get').mockReturnValue({ randomUUID: () => 'test-id' });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should add a job', async () => {
    const job = {
      company: 'Test Corp',
      day: '2025-08-30',
      mailDelivered: false,
      resumeFormat: ['ATS Friendly'],
      mailStatus: 'Pending',
      response: 'No Response',
      platforms: ['LinkedIn']
    };
    await addJob(job);
    const jobs = await getJobs();
    expect(jobs).toHaveLength(1);
    expect(jobs[0]).toMatchObject({ ...job, id: 'test-id', synced: false });
  });

  test('should update a job', async () => {
    const job = {
      id: 'test-id',
      company: 'Test Corp',
      day: '2025-08-30',
      mailDelivered: false,
      resumeFormat: ['ATS Friendly'],
      mailStatus: 'Pending',
      response: 'No Response',
      platforms: ['LinkedIn'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      synced: false
    };
    await addJob(job);
    await updateJob({ ...job, company: 'Updated Corp' });
    const jobs = await getJobs();
    expect(jobs[0].company).toBe('Updated Corp');
    expect(jobs[0].synced).toBe(false);
  });

  test('should delete a job', async () => {
    const job = {
      company: 'Test Corp',
      day: '2025-08-30',
      mailDelivered: false,
      resumeFormat: ['ATS Friendly'],
      mailStatus: 'Pending',
      response: 'No Response',
      platforms: ['LinkedIn']
    };
    await addJob(job);
    await deleteJob('test-id');
    const jobs = await getJobs();
    const deletedJobs = await db.deletedJobs.toArray();
    expect(jobs).toHaveLength(0);
    expect(deletedJobs).toEqual([{ id: 'test-id' }]);
  });

  test('should filter jobs by company', async () => {
    const job1 = { company: 'Test Corp', day: '2025-08-30', resumeFormat: [], platforms: [] };
    const job2 = { company: 'Other Corp', day: '2025-08-30', resumeFormat: [], platforms: [] };
    await addJob(job1);
    await addJob(job2);
    const jobs = await getJobsByFilter('Test', '');
    expect(jobs).toHaveLength(1);
    expect(jobs[0].company).toBe('Test Corp');
  });
});