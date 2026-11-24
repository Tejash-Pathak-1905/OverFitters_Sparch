const recognition = globalThis.SpeechRecognition ?? globalThis.webkitSpeechRecognition;

export function listen(onResult, onError) {
  if (!recognition) {
    onError("Voice input is unavailable. Type your command.");
    return;
  }
  try {
    const session = new recognition();
    session.lang = "en-IN";
    session.onresult = (event) => onResult(event.results[0][0].transcript);
    session.onerror = (event) => onError("Microphone: " + event.error);
    session.onnomatch = () => onError("No command recognized. Try again or type your command.");
    session.onend = () => onError("");
    session.start();
  } catch {
    onError("Microphone unavailable. Type your command.");
  }
}

export function speak(text) {
  if (!globalThis.speechSynthesis || !globalThis.SpeechSynthesisUtterance) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-IN";
  speechSynthesis.speak(utterance);
}

export function silence() {
  globalThis.speechSynthesis?.cancel();
}
