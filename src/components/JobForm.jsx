import { useForm } from "react-hook-form";
import { useEffect } from "react";

function JobForm({ onSubmit, onClose, initialData }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {
      company: "",
      day: "",
      mailDelivered: false,
      resumeFormat: [],
      mailStatus: "Pending",
      response: "No Response",
      platforms: [],
    },
  });

  useEffect(() => {
    if (initialData) reset(initialData);
  }, [initialData, reset]);

  const submitHandler = (data) => {
    onSubmit({
      ...data,
      id: initialData?.id || crypto.randomUUID(),
      resumeFormat: Array.isArray(data.resumeFormat)
        ? data.resumeFormat
        : [data.resumeFormat].filter(Boolean),
      platforms: Array.isArray(data.platforms)
        ? data.platforms
        : [data.platforms].filter(Boolean),
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all duration-300 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-lg overflow-y-auto max-h-[90vh] border border-gray-700/50 backdrop-blur-sm transform transition-all duration-300 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
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
                d={
                  initialData
                    ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    : "M12 6v6m0 0v6m0-6h6m-6 0H6"
                }
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">
            {initialData ? "Edit Job Application" : "Add Job Application"}
          </h2>
        </div>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2 uppercase tracking-wide">
              Company
            </label>
            <input
              type="text"
              {...register("company", {
                required: "Company is required",
                minLength: {
                  value: 2,
                  message: "Company name must be at least 2 characters",
                },
              })}
              className="w-full px-4 py-3 bg-gray-800/60 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 hover:border-gray-500/50"
              placeholder="Enter company name..."
              aria-invalid={errors.company ? "true" : "false"}
            />
            {errors.company && (
              <p className="text-red-400 text-sm mt-1 flex items-center">
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
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {errors.company.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2 uppercase tracking-wide">
              Application Date
            </label>
            <input
              type="date"
              {...register("day", { required: "Date is required" })}
              className="w-full px-4 py-3 bg-gray-800/60 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 hover:border-gray-500/50 [color-scheme:dark]"
            />
            {errors.day && (
              <p className="text-red-400 text-sm mt-1 flex items-center">
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
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {errors.day.message}
              </p>
            )}
          </div>

          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                {...register("mailDelivered")}
                className="w-5 h-5 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2 mr-3"
              />
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-purple-400 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-white font-medium group-hover:text-purple-300 transition-colors">
                  Mail Delivered
                </span>
              </div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-300 mb-3 uppercase tracking-wide">
              Resume Format
            </label>
            <div className="space-y-2">
              {["ATS Friendly", "Human Friendly"].map((option) => (
                <label
                  key={option}
                  className="flex items-center p-3 bg-gray-800/30 rounded-lg border border-gray-700/50 hover:border-gray-600/50 cursor-pointer transition-colors group"
                >
                  <input
                    type="checkbox"
                    value={option}
                    {...register("resumeFormat")}
                    className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2 mr-3"
                  />
                  <span className="text-gray-300 group-hover:text-white transition-colors">
                    {option}
                  </span>
                </label>
              ))}
            </div>
            {errors.resumeFormat && (
              <p className="text-red-400 text-sm mt-1 flex items-center">
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
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {errors.resumeFormat.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2 uppercase tracking-wide">
              Mail Status
            </label>
            <div className="relative">
              <select
                {...register("mailStatus")}
                className="w-full px-4 py-3 bg-gray-800/60 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 hover:border-gray-500/50 appearance-none"
              >
                <option value="Pending">Pending</option>
                <option value="Sent">Sent</option>
                <option value="Failed">Failed</option>
              </select>
              <svg
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2 uppercase tracking-wide">
              Response Status
            </label>
            <div className="relative">
              <select
                {...register("response")}
                className="w-full px-4 py-3 bg-gray-800/60 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 hover:border-gray-500/50 appearance-none"
              >
                <option value="No Response">No Response</option>
                <option value="Rejected">Rejected</option>
                <option value="Interview Scheduled">Interview Scheduled</option>
                <option value="Offer Received">Offer Received</option>
              </select>
              <svg
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-300 mb-3 uppercase tracking-wide">
              Application Platforms
            </label>
            <div className="space-y-2">
              {["LinkedIn", "Indeed", "Company Website", "Email", "Other"].map(
                (option) => (
                  <label
                    key={option}
                    className="flex items-center p-3 bg-gray-800/30 rounded-lg border border-gray-700/50 hover:border-gray-600/50 cursor-pointer transition-colors group"
                  >
                    <input
                      type="checkbox"
                      value={option}
                      {...register("platforms")}
                      className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2 mr-3"
                    />
                    <span className="text-gray-300 group-hover:text-white transition-colors">
                      {option}
                    </span>
                  </label>
                )
              )}
            </div>
            {errors.platforms && (
              <p className="text-red-400 text-sm mt-1 flex items-center">
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
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {errors.platforms.message}
              </p>
            )}
          </div>

          {/* MOVED BUTTONS INSIDE THE FORM */}
          <div className="sticky bottom-0 bg-gradient-to-r from-gray-800 to-gray-900 pt-6 flex justify-end space-x-4 border-t border-gray-700/50 -mx-6 px-6 -mb-6 pb-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-700/50 hover:bg-gray-700/70 text-gray-300 hover:text-white rounded-xl border border-gray-600/50 hover:border-gray-500/50 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-200 font-medium flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    initialData
                      ? "M5 13l4 4L19 7"
                      : "M12 6v6m0 0v6m0-6h6m-6 0H6"
                  }
                />
              </svg>
              {initialData ? "Update" : "Add"}
            </button>
          </div>
        </form>

        <style jsx>{`
          @keyframes fade-in {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes scale-in {
            from {
              opacity: 0;
              transform: scale(0.95) translateY(-10px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }

          .animate-fade-in {
            animation: fade-in 0.3s ease-out;
          }

          .animate-scale-in {
            animation: scale-in 0.3s ease-out;
          }
        `}</style>
      </div>
    </div>
  );
}

export default JobForm;
