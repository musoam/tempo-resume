/**
 * This patch prevents DataCloneError with PerformanceServerTiming objects
 * by disabling the PostHog performance observer that causes the issue.
 */
export function applyPerformancePatch() {
  if (typeof window !== "undefined") {
    // Store the original PerformanceObserver constructor
    const OriginalPerformanceObserver = window.PerformanceObserver;

    // Override the PerformanceObserver constructor
    window.PerformanceObserver = function (callback) {
      // Create a wrapper callback that filters out server timing entries
      const wrappedCallback = (list, observer) => {
        // Filter out problematic entries before passing to the original callback
        const safeList = {
          getEntries: () => {
            const entries = list.getEntries();
            return entries.filter((entry) => {
              // Filter out entries with serverTiming that cause DataCloneError
              return !entry.serverTiming;
            });
          },
          getEntriesByName: (name, type) => {
            const entries = list.getEntriesByName(name, type);
            return entries.filter((entry) => !entry.serverTiming);
          },
          getEntriesByType: (type) => {
            const entries = list.getEntriesByType(type);
            return entries.filter((entry) => !entry.serverTiming);
          },
        };

        // Call the original callback with our filtered list
        callback(safeList, observer);
      };

      // Create a new PerformanceObserver with our wrapped callback
      return new OriginalPerformanceObserver(wrappedCallback);
    };

    // Copy over prototype and properties
    window.PerformanceObserver.prototype =
      OriginalPerformanceObserver.prototype;
    window.PerformanceObserver.supportedEntryTypes =
      OriginalPerformanceObserver.supportedEntryTypes;
  }
}
