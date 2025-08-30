import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JobForm from "./components/JobForm";
import JobList from "./components/JobList";
import Dashboard from "./components/Dashboard";
import SearchFilter from "./components/SearchFilter";
import {
  addJob,
  updateJob,
  deleteJob,
  getJobsByFilter,
  syncJobs,
  pushJobs,
} from "./services/db";
import { initAuth } from "./services/firebase";

function App() {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Initialize Firebase auth on mount
  useEffect(() => {
    initAuth().catch((err) =>
      toast.error("Firebase auth failed: " + err.message)
    );
    loadJobs();
  }, []);

  // Update online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.info("Back online");
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast.warn("Offline - changes saved locally");
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Load jobs when filters change
  useEffect(() => {
    loadJobs();
  }, [searchTerm, startDate, endDate]);

  // Load jobs from IndexedDB
  const loadJobs = async () => {
    try {
      const filteredJobs = await getJobsByFilter(
        searchTerm,
        startDate,
        endDate
      );
      setJobs(filteredJobs);
    } catch (err) {
      toast.error("Failed to load jobs: " + err.message);
    }
  };

  // Add new job
  const handleAddJob = async (job) => {
    try {
      await addJob(job);
      await loadJobs();
      setIsFormOpen(false);
      if (!isOnline) {
        toast.warn("Saved offline - push when back online");
      } else {
        toast.success("Job added");
      }
    } catch (err) {
      toast.error("Failed to add job: " + err.message);
    }
  };

  // Edit job
  const handleEditJob = async (updatedJob) => {
    try {
      await updateJob(updatedJob);
      await loadJobs();
      setIsFormOpen(false);
      setEditingJob(null);
      if (!isOnline) {
        toast.warn("Saved offline - push when back online");
      } else {
        toast.success("Job updated");
      }
    } catch (err) {
      toast.error("Failed to update job: " + err.message);
    }
  };

  // Delete job
  const handleDeleteJob = async (id) => {
    try {
      await deleteJob(id);
      await loadJobs();
      if (!isOnline) {
        toast.warn("Deleted offline - push when back online");
      } else {
        toast.success("Job deleted");
      }
    } catch (err) {
      toast.error("Failed to delete job: " + err.message);
    }
  };

  // Handle push to Firebase
  const handlePush = async () => {
    if (!isOnline) {
      toast.warn("Offline - cannot push to Firebase");
      return;
    }
    try {
      const pushed = await pushJobs();
      await loadJobs();
      if (pushed) {
        toast.success("Pushed to Firebase");
      } else {
        toast.info("No changes to push");
      }
    } catch (err) {
      toast.error("Push failed: " + err.message);
    }
  };

  // Handle sync with Firebase
  const handleSync = async () => {
    if (!isOnline) {
      toast.warn("Offline - cannot sync");
      return;
    }
    try {
      await syncJobs();
      await loadJobs();
      toast.success("Synced with Firebase");
    } catch (err) {
      const message = err.message.startsWith("Unsynced jobs")
        ? `Kindly push these documents: ${
            err.message.replace("Unsynced jobs: ", "").split(" | ")[0] || "None"
          }`
        : "Sync failed: " + err.message;
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent mb-2">
            Job Application Tracker
          </h1>
          <p className="text-gray-400 text-lg">
            Manage your career journey with ease
          </p>
        </div>

        {/* Dashboard */}
        <div className="mb-8">
          <Dashboard jobs={jobs} />
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <SearchFilter
            setSearchTerm={setSearchTerm}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
          />
        </div>

        {/* Action Buttons */}
        <div className="mb-8 flex flex-wrap gap-3">
          <button
            className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            onClick={() => {
              setEditingJob(null);
              setIsFormOpen(true);
            }}
          >
            <span className="relative z-10 flex items-center space-x-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>Add Job</span>
            </span>
          </button>

          <button
            className="group relative overflow-hidden bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            onClick={handlePush}
          >
            <span className="relative z-10 flex items-center space-x-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16l-4-4m0 0l4-4m-4 4h18"
                />
              </svg>
              <span>Push</span>
            </span>
          </button>

          <button
            className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            onClick={handleSync}
          >
            <span className="relative z-10 flex items-center space-x-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>Sync</span>
            </span>
          </button>
        </div>

        {/* Job List */}
        <div className="mb-8">
          <JobList
            jobs={jobs}
            onEdit={(job) => {
              setEditingJob(job);
              setIsFormOpen(true);
            }}
            onDelete={handleDeleteJob}
          />
        </div>

        {/* Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div className="relative max-w-2xl w-full mx-4">
              <JobForm
                onSubmit={editingJob ? handleEditJob : handleAddJob}
                onClose={() => {
                  setIsFormOpen(false);
                  setEditingJob(null);
                }}
                initialData={editingJob}
              />
            </div>
          </div>
        )}

        <ToastContainer />
      </div>
    </div>
  );
}

export default App;
