function Dashboard({ jobs }) {
  // Calculate weekly stats (jobs from last 7 days)
  const today = new Date();
  const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const weeklyJobs = jobs.filter((job) => new Date(job.day) >= oneWeekAgo);
  const totalApplications = weeklyJobs.length;

  const responseBreakdown = weeklyJobs.reduce((acc, job) => {
    acc[job.response] = (acc[job.response] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-700/50 backdrop-blur-sm">
      <div className="flex items-center space-x-3 mb-6">
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
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white">Weekly Analytics</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Stat Card */}
        <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-xl p-5 border border-purple-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-300 text-sm font-medium uppercase tracking-wide">
                Total Applications
              </p>
              <p className="text-3xl font-bold text-white mt-1">
                {totalApplications}
              </p>
            </div>
            <div className="p-3 bg-purple-600/30 rounded-lg">
              <svg
                className="w-8 h-8 text-purple-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Response Breakdown */}
        <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
          <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-indigo-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
              />
            </svg>
            Response Breakdown
          </h3>

          <div className="space-y-3">
            {Object.entries(responseBreakdown).map(([response, count]) => {
              const getResponseColor = (status) => {
                switch (status.toLowerCase()) {
                  case "accepted":
                  case "hired":
                  case "offer":
                    return "from-emerald-500 to-green-500";
                  case "interviewed":
                  case "callback":
                    return "from-blue-500 to-indigo-500";
                  case "rejected":
                  case "declined":
                    return "from-red-500 to-pink-500";
                  case "pending":
                  case "applied":
                    return "from-yellow-500 to-orange-500";
                  default:
                    return "from-gray-500 to-gray-600";
                }
              };

              const percentage =
                totalApplications > 0
                  ? ((count / totalApplications) * 100).toFixed(1)
                  : 0;

              return (
                <div
                  key={response}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full bg-gradient-to-r ${getResponseColor(
                        response
                      )}`}
                    ></div>
                    <span className="text-gray-300 capitalize font-medium">
                      {response}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-400 text-sm">{percentage}%</span>
                    <span className="text-white font-semibold min-w-[2rem] text-right">
                      {count}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
