// Temporary JSX type shim for offline dev to silence IntrinsicElements errors.
// Remove this once TypeScript/Next config is finalized.
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any
  }
}
