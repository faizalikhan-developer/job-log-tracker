import { useState } from 'react';

function Dashboard({ jobs = [] }) {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  
  // Constants
  const DAILY_TARGET = 30;
  
  // Calculate date ranges
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  // Filter jobs based on selected period
  const getFilteredJobs = () => {
    switch (selectedPeriod) {
      case 'today':
        return jobs.filter(job => new Date(job.day) >= startOfToday);
      case 'week':
        return jobs.filter(job => new Date(job.day) >= oneWeekAgo);
      case 'month':
        return jobs.filter(job => new Date(job.day) >= oneMonthAgo);
      default:
        return jobs.filter(job => new Date(job.day) >= oneWeekAgo);
    }
  };
  
  const filteredJobs = getFilteredJobs();
  const todayJobs = jobs.filter(job => new Date(job.day) >= startOfToday);
  
  // Calculate stats
  const totalApplications = filteredJobs.length;
  const todayApplications = todayJobs.length;
  const dailyProgress = Math.min((todayApplications / DAILY_TARGET) * 100, 100);
  
  // Enhanced response breakdown
  const responseBreakdown = filteredJobs.reduce((acc, job) => {
    const status = job.response?.toLowerCase() || 'pending';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
  
  // Calculate success metrics
  const positiveResponses = ['accepted', 'hired', 'offer', 'interviewed', 'callback'].reduce(
    (sum, status) => sum + (responseBreakdown[status] || 0), 0
  );
  const successRate = totalApplications > 0 ? (positiveResponses / totalApplications * 100).toFixed(1) : 0;
  
  // Response configuration with more detailed categories
  const responseConfig = {
    'accepted': { color: 'from-emerald-500 to-green-500', icon: '✓', priority: 1 },
    'hired': { color: 'from-emerald-600 to-green-600', icon: '🎉', priority: 1 },
    'offer': { color: 'from-emerald-400 to-green-400', icon: '💼', priority: 1 },
    'interviewed': { color: 'from-blue-500 to-indigo-500', icon: '🗣️', priority: 2 },
    'callback': { color: 'from-blue-400 to-indigo-400', icon: '📞', priority: 2 },
    'under review': { color: 'from-yellow-500 to-orange-500', icon: '👀', priority: 3 },
    'pending': { color: 'from-yellow-400 to-orange-400', icon: '⏳', priority: 3 },
    'applied': { color: 'from-yellow-600 to-orange-600', icon: '📝', priority: 3 },
    'rejected': { color: 'from-red-500 to-pink-500', icon: '❌', priority: 4 },
    'declined': { color: 'from-red-400 to-pink-400', icon: '🚫', priority: 4 },
    'no response': { color: 'from-gray-500 to-gray-600', icon: '📭', priority: 5 },
  };
  
  // Sort responses by priority and count
  const sortedResponses = Object.entries(responseBreakdown)
    .sort(([a, countA], [b, countB]) => {
      const priorityA = responseConfig[a]?.priority || 6;
      const priorityB = responseConfig[b]?.priority || 6;
      if (priorityA !== priorityB) return priorityA - priorityB;
      return countB - countA;
    });

  const CircularProgress = ({ percentage, size = 120, strokeWidth = 8 }) => {
    // Make progress circle responsive
    const responsiveSize = typeof window !== 'undefined' && window.innerWidth < 640 ? 100 : size;
    const radius = (responsiveSize - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = `${circumference} ${circumference}`;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg width={responsiveSize} height={responsiveSize} className="transform -rotate-90">
          <circle
            cx={responsiveSize / 2}
            cy={responsiveSize / 2}
            r={radius}
            stroke="rgba(75, 85, 99, 0.3)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={responsiveSize / 2}
            cy={responsiveSize / 2}
            r={radius}
            stroke="url(#progressGradient)"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-in-out"
          />
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">{todayApplications}</div>
            <div className="text-xs text-gray-400">of {DAILY_TARGET}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 sm:p-6 shadow-2xl border border-gray-700/50 backdrop-blur-sm w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex-shrink-0">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white truncate">Job Application Analytics</h2>
        </div>
        
        {/* Period Selector - Fixed mobile layout */}
        <div className="flex bg-gray-800/50 rounded-lg p-1 border border-gray-700/50 w-full sm:w-auto max-w-xs">
          {['today', 'week', 'month'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`flex-1 px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap ${
                selectedPeriod === period
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Grid - Improved mobile layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Daily Target Meter */}
        <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-xl p-4 sm:p-6 border border-purple-500/20 lg:col-span-1">
          <div className="text-center">
            <h3 className="text-base sm:text-lg font-semibold text-purple-300 mb-4 flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Daily Target
            </h3>
            <CircularProgress percentage={dailyProgress} />
            <div className="mt-4">
              <p className="text-sm text-gray-400">Progress: {dailyProgress.toFixed(1)}%</p>
              <p className="text-xs text-gray-500 mt-1">
                {DAILY_TARGET - todayApplications > 0 
                  ? `${DAILY_TARGET - todayApplications} more to go!` 
                  : 'Target achieved! 🎉'}
              </p>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="bg-gray-800/50 rounded-xl p-4 sm:p-6 border border-gray-700/50 lg:col-span-1">
          <h3 className="text-base sm:text-lg font-semibold text-gray-200 mb-4 flex items-center">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="truncate">Summary Stats</span>
          </h3>
          
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
              <span className="text-gray-300 font-medium text-sm sm:text-base">Total Applications</span>
              <span className="text-xl sm:text-2xl font-bold text-white">{totalApplications}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
              <span className="text-gray-300 font-medium text-sm sm:text-base">Success Rate</span>
              <span className="text-lg sm:text-xl font-bold text-emerald-400">{successRate}%</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
              <span className="text-gray-300 font-medium text-sm sm:text-base">Positive Responses</span>
              <span className="text-lg sm:text-xl font-bold text-blue-400">{positiveResponses}</span>
            </div>
          </div>
        </div>

        {/* Detailed Response Breakdown */}
        <div className="bg-gray-800/50 rounded-xl p-4 sm:p-6 border border-gray-700/50 lg:col-span-2 xl:col-span-1">
          <h3 className="text-base sm:text-lg font-semibold text-gray-200 mb-4 flex items-center">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
            <span className="truncate">Response Breakdown</span>
          </h3>

          <div className="space-y-2 max-h-60 sm:max-h-80 overflow-y-auto">
            {sortedResponses.map(([response, count]) => {
              const config = responseConfig[response] || responseConfig['no response'];
              const percentage = totalApplications > 0 ? ((count / totalApplications) * 100).toFixed(1) : 0;

              return (
                <div key={response} className="flex items-center justify-between p-2 sm:p-3 bg-gray-700/20 rounded-lg hover:bg-gray-700/40 transition-colors duration-200">
                  <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${config.color} flex-shrink-0`}></div>
                    <span className="text-base sm:text-lg mr-1 sm:mr-2 flex-shrink-0">{config.icon}</span>
                    <span className="text-gray-300 capitalize font-medium text-sm sm:text-base truncate">
                      {response.replace(/([a-z])([A-Z])/g, '$1 $2')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                    <div className="text-right">
                      <div className="text-white font-semibold text-sm sm:text-base">{count}</div>
                      <div className="text-gray-400 text-xs">{percentage}%</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {sortedResponses.length === 0 && (
            <div className="text-center py-6 sm:py-8 text-gray-500">
              <svg className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-sm sm:text-base">No applications found for this period</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;