class ProcessController {
  constructor() {
    this.cancelled = false;
  }

  async processWithDelay(numbers, delay = 1000, onProgress) {
    if (
      !Array.isArray(numbers) ||
      !numbers.every((n) => typeof n === "number")
    ) {
      console.error("Invalid input: numbers must be an array of numbers");
      return;
    }

    if (numbers.length === 0) {
      console.log("No numbers to process.");
      return Promise.resolve();
    }

    for (let i = 0; i < numbers.length; i++) {
      if (this.cancelled) {
        console.log("Process cancelled.");
        return Promise.resolve();
      }

      console.log(`Processing: ${numbers[i]}`);
      if (onProgress) onProgress(i + 1, numbers.length);

      await this.delay(delay);
    }

    console.log("Processing completed.");
    return Promise.resolve();
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  cancel() {
    this.cancelled = true;
  }
}

// ===== Example Usage =====
const test = new ProcessController();
test.processWithDelay([1, 2, 3, 4, 5], 1000, (processed, total) => {
  console.log(`Progress: ${processed}/${total}`);
});

setTimeout(() => test.cancel(), 3000);
