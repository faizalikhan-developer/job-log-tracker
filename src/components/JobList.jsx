import { Download } from "lucide-react";
import { useState } from "react";
import * as XLSX from "xlsx";

function JobList({ jobs, onEdit, onDelete, currentPage, setCurrentPage }) {
  const jobsPerPage = 5;

  const sortedJobs = [...jobs].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const totalPages = Math.ceil(sortedJobs.length / jobsPerPage);

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = sortedJobs.slice(indexOfFirstJob, indexOfLastJob);

  const paginate = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages = [];
    const delta = 2; // how many pages to show around current
    const range = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range.unshift("...");
    }
    if (currentPage + delta < totalPages - 1) {
      range.push("...");
    }

    range.unshift(1);
    if (totalPages > 1) range.push(totalPages);

    return range;
  };

  const downloadExcel = () => {
    const data = jobs.map((job) => ({
      Company: job.company,
      Date: job.day,
      "Mail Delivered": job.mailDelivered ? "Yes" : "No",
      "Resume Format": Array.isArray(job.resumeFormat)
        ? job.resumeFormat.join(", ")
        : [job.atsResume, job.humanResume].filter(Boolean).join(", "),
      "Mail Status": job.mailStatus || "-",
      Response: job.response || "Pending",
      Platforms: Array.isArray(job.platforms)
        ? job.platforms.join(", ")
        : job.platforms || "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Jobs");
    XLSX.writeFile(workbook, "jobs_list.xlsx");
  };

  // console.log(jobs);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
      case "hired":
      case "offer":
        return "bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 border-emerald-500/30";
      case "interviewed":
      case "callback":
        return "bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-300 border-blue-500/30";
      case "rejected":
      case "declined":
        return "bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300 border-red-500/30";
      case "pending":
      case "applied":
        return "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border-yellow-500/30";
      default:
        return "bg-gradient-to-r from-gray-500/20 to-gray-600/20 text-gray-300 border-gray-500/30";
    }
  };

  const getMailStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
      case "sent":
        return "text-emerald-300";
      case "failed":
      case "bounced":
        return "text-red-300";
      case "pending":
        return "text-yellow-300";
      default:
        return "text-gray-300";
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-700/50 backdrop-blur-sm">
      {/* Header + Download Button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">Job Applications</h2>
        </div>

        <button
          onClick={downloadExcel}
          className="flex items-center space-x-2 px-4 py-2 
             bg-emerald-600/20 hover:bg-emerald-600/30 
             text-emerald-300 border border-emerald-500/30 
             rounded-lg transition-colors duration-200 
             text-sm font-medium"
          title="Download Excel"
        >
          <Download className="w-5 h-5" /> {/* ✅ Lightweight icon */}
          <span className="hidden sm:inline">Download Excel</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <div className="w-max bg-gray-800/30 rounded-xl border border-gray-700/50">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-700/50 to-gray-800/50 border-b border-gray-600/50">
                <th className="px-4 py-4 text-left text-sm font-semibold text-purple-300 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-purple-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-purple-300 uppercase tracking-wider">
                  Mail Delivered
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-purple-300 uppercase tracking-wider">
                  Resume Format
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-purple-300 uppercase tracking-wider">
                  Mail Status
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-purple-300 uppercase tracking-wider">
                  Response
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-purple-300 uppercase tracking-wider">
                  Platforms
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-purple-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {currentJobs.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <svg
                        className="w-12 h-12 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                      </svg>
                      <p className="text-gray-400 font-medium">
                        No job applications yet
                      </p>
                      <p className="text-gray-500 text-sm">
                        Start adding your job applications to track your
                        progress
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentJobs.map((job, index) => {
                  // ✅ Migration: convert old ats/human fields to new resumeFormat array
                  const resumeFormat = Array.isArray(job.resumeFormat)
                    ? job.resumeFormat
                    : [job.atsResume, job.humanResume].filter(Boolean);

                  const platforms = Array.isArray(job.platforms)
                    ? job.platforms
                    : job.platforms
                    ? [job.platforms]
                    : [];

                  return (
                    <tr
                      key={job.id}
                      className={`hover:bg-gray-700/20 transition-colors duration-150 ${
                        index % 2 === 0 ? "bg-gray-800/20" : "bg-gray-800/10"
                      }`}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">
                              {job.company?.charAt(0)?.toUpperCase() || "C"}
                            </span>
                          </div>
                          <span className="text-white font-medium whitespace-nowrap">
                            {job.company}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-300 font-medium whitespace-nowrap">
                        {job.day}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-2">
                          {job.mailDelivered ? (
                            <>
                              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                              <span className="text-emerald-300 font-medium">
                                Yes
                              </span>
                            </>
                          ) : (
                            <>
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <span className="text-red-300 font-medium">
                                No
                              </span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {resumeFormat.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {resumeFormat.map((format, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-indigo-600/30 text-indigo-300 text-xs rounded-md border border-indigo-500/30 whitespace-nowrap"
                              >
                                {format}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`font-medium ${getMailStatusColor(
                            job.mailStatus
                          )}`}
                        >
                          {job.mailStatus || "-"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${getStatusColor(
                            job.response
                          )}`}
                        >
                          {job.response || "Pending"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {platforms.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {platforms.map((platform, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-purple-600/30 text-purple-300 text-xs rounded-md border border-purple-500/30 whitespace-nowrap"
                              >
                                {platform}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => onEdit(job)}
                            className="inline-flex items-center px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-lg transition-colors duration-200 text-sm font-medium"
                            aria-label={`Edit job ${job.company}`}
                          >
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => onDelete(job.id)}
                            className="inline-flex items-center px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 rounded-lg transition-colors duration-200 text-sm font-medium"
                            aria-label={`Delete job ${job.company}`}
                          >
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-2">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-40"
          >
            Prev
          </button>

          {getPageNumbers().map((page, i) =>
            page === "..." ? (
              <span key={i} className="px-3 py-1.5 text-gray-400">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => paginate(page)}
                className={`px-3 py-1.5 rounded-lg ${
                  currentPage === page
                    ? "bg-purple-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {page}
              </button>
            )
          )}

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default JobList;
