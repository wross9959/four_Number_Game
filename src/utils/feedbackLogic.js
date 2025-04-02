export function checkGuess(secret, guess) {
  const result = Array(4).fill("none"); // default to not in number

  const secretArr = secret.split("");
  const guessArr = guess.split("");

  const usedSecret = Array(4).fill(false);

  // First pass: check for correct positions
  for (let i = 0; i < 4; i++) {
    if (guessArr[i] === secretArr[i]) {
      result[i] = "correct"; // green
      usedSecret[i] = true;
    }
  }

  // Second pass: correct digits, wrong position
  for (let i = 0; i < 4; i++) {
    if (result[i] === "none") {
      for (let j = 0; j < 4; j++) {
        if (!usedSecret[j] && guessArr[i] === secretArr[j]) {
          result[i] = "present"; // yellow
          usedSecret[j] = true;
          break;
        }
      }
    }
  }

  return result; // ["correct", "none", "present", "none"]
}
