class ProcessController {
  constructor() {
    this.cancelled = false;
  }

  cancel() {
    this.cancelled = true;
  }

  async processWithDelay(numbers, delay = 1000, onProgress) {
    if (
      !Array.isArray(numbers) ||
      !numbers.every((n) => typeof n === "number")
    ) {
      throw new Error("Invalid input: numbers must be an array of numbers");
    }

    if (numbers.length === 0) return Promise.resolve();

    for (let i = 0; i < numbers.length; i++) {
      if (this.cancelled) {
        console.log("Process cancelled.");
        return;
      }
      console.log(numbers[i]);
      if (onProgress) onProgress(i + 1, numbers.length);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

// Example Usage
const controller = new ProcessController();
controller.processWithDelay([1, 2, 3, 4, 5], 1000, (processed, total) => {
  console.log(`Progress: ${processed}/${total}`);
});

// To cancel the process (for example, after 2.5 seconds)
setTimeout(() => controller.cancel(), 2500);
