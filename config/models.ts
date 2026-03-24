/**
 * Centralized Groq Model Configuration
 * All model IDs verified as active on Groq API as of March 2025.
 */
export const GROQ_MODELS = {
  // Fast, lightweight vision model (Llama 4 Scout) — replaces llama-3.2-11b-vision-preview
  VISION: "meta-llama/llama-4-scout-17b-16e-instruct",

  // High-performance vision model (Llama 4 Maverick) — replaces llama-3.2-90b-vision-preview
  VISION_PRO: "meta-llama/llama-4-maverick-17b-128e-instruct",

  // Stable production text model — llama-3.3-70b-versatile
  TEXT: "llama-3.3-70b-versatile",
};

export default GROQ_MODELS;
