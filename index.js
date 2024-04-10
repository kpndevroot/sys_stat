const os = require("os");
const { exec } = require("child_process");

// Function to format bytes to human-readable format
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

// Function to monitor CPU, RAM, and trigger action if CPU usage exceeds 50% for more than 2 seconds
function monitorUsage(interval) {
  let aboveThreshold = false; // Flag to track if CPU usage is consistently above threshold
  let aboveThresholdStart = null; // Timestamp when CPU usage crosses threshold

  const monitor = setInterval(() => {
    // Get CPU usage
    const cpuUsage = os.loadavg()[0].toFixed(2); // Current CPU usage in percentage

    // Check if CPU usage is above 50%
    if (cpuUsage > 50) {
      if (!aboveThreshold) {
        // If CPU usage just crossed the threshold, set the start time
        aboveThreshold = true;
        aboveThresholdStart = Date.now();
      } else {
        // If CPU usage has been consistently above threshold for more than 2 seconds, trigger action
        if (Date.now() - aboveThresholdStart > 2000) {
          triggerAction();
        }
      }
    } else {
      // If CPU usage drops below 50%, reset the flags
      aboveThreshold = false;
      aboveThresholdStart = null;
    }

    // Get memory usage
    const totalMemory = formatBytes(os.totalmem()); // Total memory in bytes
    const freeMemory = formatBytes(os.freemem()); // Free memory in bytes

    // Move the cursor to the beginning of the line and clear it
    process.stdout.write("\x1B[0f\x1B[0J");

    // Print monitored data without new line
    process.stdout.write(
      `CPU Usage: ${cpuUsage}%  |  Total Memory: ${totalMemory}  |  Free Memory: ${freeMemory}`
    );
  }, interval);

  // Stop monitoring after 1 minute (for demonstration purposes)
  setTimeout(() => {
    clearInterval(monitor);
    console.log("\nMonitoring stopped.");
  }, 60000); // 1 minute
}

// Function to trigger action when CPU usage exceeds 50%
function triggerAction() {
  console.log("CPU usage is above 50% for more than 2 seconds.");
  // Add your desired action here
}

// Get the interval from the command line arguments or set a default value
const interval = process.argv[2] ? parseInt(process.argv[2]) : 1000; // Default interval is 1 second

// Start monitoring with the specified interval
monitorUsage(interval);
