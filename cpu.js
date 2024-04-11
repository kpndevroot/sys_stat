const os = require("os");
const clear = require("clear"); // For clearing the terminal (optional)
const { cpuLoad } = require("os-toolbox");
const sentMail = require("./helper/mailer.js");

let cpuTriggerCount = 0;
let ramTriggerCount = 0;
const threshold = 50; // CPU and RAM usage threshold (adjustable)
const triggerDuration = 5000; // Minimum duration above threshold (milliseconds)

async function monitorSystem() {
  try {
    // Get CPU usage information
    const usage = await cpuLoad();

    // Get free and total RAM in MB
    const freeMem = os.freemem() / 1024 / 1024;
    const totalMem = os.totalmem() / 1024 / 1024;

    // Calculate RAM usage percentage
    const ramUsage = ((totalMem - freeMem) / totalMem) * 100;

    // Clear the terminal for a clean display (optional)
    clear();

    // Display CPU and RAM usage in a user-friendly format, limiting to 100%
    console.log(`CPU Usage: ${Math.min(usage.toFixed(2), 100)}%`);
    console.log(`RAM Usage: ${ramUsage.toFixed(2)}%`);

    // Track CPU usage above threshold
    if (usage > threshold) {
      cpuTriggerCount++; // Increment counter if above threshold
    } else {
      cpuTriggerCount = 0; // Reset counter if below threshold
    }

    // Track RAM usage above threshold
    if (ramUsage > threshold) {
      ramTriggerCount++;
    } else {
      ramTriggerCount = 0;
    }

    // Trigger functions if usage is high for a minimum duration
    if (cpuTriggerCount * 2000 >= triggerDuration) {
      cpuTrigger();
      cpuTriggerCount = 0; // Reset counter after trigger
    }
    if (ramTriggerCount * 2000 >= triggerDuration) {
      ramTrigger();
      ramTriggerCount = 0; // Reset counter after trigger
    }
  } catch (error) {
    console.error("Error retrieving system information:", error);
  }
}

// Implement your cpuTrigger function here
function cpuTrigger() {
  console.log("CPU Usage Above 50% for 3 seconds!");
  sentMail("cpu usage", "cpu usage is above 50% for 5 seconds");
}

// Implement your ramTrigger function here
function ramTrigger() {
  console.log("RAM Usage Above 50% for 3 seconds!");
}

// Monitor system usage every 2 seconds (adjust interval as needed)
setInterval(monitorSystem, 2000);
