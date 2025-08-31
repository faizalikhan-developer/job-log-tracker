import Dexie from "dexie";
import { pushToFirebase, pullFromFirebase } from "./firebase";
import { collection, doc, deleteDoc } from "firebase/firestore";
import firestoreDb from "./firebase";

const db = new Dexie("JobLogTracker");
db.version(1).stores({
  jobs: "id, company, day, mailDelivered, resumeFormat, mailStatus, response, platforms, createdAt, updatedAt, synced",
  deletedJobs: "id",
});

export async function addJob(job) {
  return db.jobs.add({
    ...job,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    synced: false,
  });
}

export async function updateJob(job) {
  return db.jobs.update(job.id, {
    ...job,
    updatedAt: new Date().toISOString(),
    synced: false,
  });
}

export async function deleteJob(id) {
  await db.jobs.delete(id);
  await db.deletedJobs.add({ id });
}

export async function getJobs() {
  return db.jobs.toArray();
}

export async function getJobsByFilter(searchTerm, startDate, endDate) {
  let query = db.jobs;
  if (searchTerm) {
    query = query.filter((job) =>
      job.company.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  if (startDate) {
    query = query.filter((job) => job.day >= startDate);
  }
  if (endDate) {
    query = query.filter((job) => job.day <= endDate);
  }
  return query.toArray();
}

export async function pushJobs() {
  let pushed = false;
  // Push unsynced jobs
  const unsyncedJobs = await db.jobs.filter((job) => !job.synced).toArray();
  if (unsyncedJobs.length > 0) {
    await pushToFirebase(unsyncedJobs);
    for (const job of unsyncedJobs) {
      await db.jobs.update(job.id, { synced: true });
    }
    pushed = true;
  }
  // Delete jobs marked for deletion
  const deletedJobIds = await db.deletedJobs.toArray();
  if (deletedJobIds.length > 0) {
    const jobsRef = collection(firestoreDb, "jobs");
    for (const { id } of deletedJobIds) {
      try {
        await deleteDoc(doc(jobsRef, id));
      } catch (err) {
        console.error(`Failed to delete job ${id} from Firebase:`, err);
      }
    }
    await db.deletedJobs.clear();
    pushed = true;
  }
  return pushed;
}

export async function syncJobs() {
  // Check for unsynced jobs or deletions
  const unsyncedJobs = await db.jobs.filter((job) => !job.synced).toArray();
  const deletedJobIds = await db.deletedJobs.toArray();
  if (unsyncedJobs.length > 0 || deletedJobIds.length > 0) {
    const unsyncedIds = unsyncedJobs.map((job) => job.id);
    const deletedIds = deletedJobIds.map(({ id }) => id);
    throw new Error(
      `Unsynced jobs: ${unsyncedIds.join(", ")} | Deletions: ${deletedIds.join(
        ", "
      )}`
    );
  }

  // Pull from Firebase
  const firebaseJobs = await pullFromFirebase();

  // FIXED: Always clear local DB and replace with Firebase data
  // This ensures that deleted jobs are removed from local storage
  await db.jobs.clear();

  // Add Firebase jobs back (if any exist)
  if (firebaseJobs.length > 0) {
    await db.jobs.bulkAdd(firebaseJobs);
  }

  // Also clear any lingering deleted jobs records since we've synced
  await db.deletedJobs.clear();
}
