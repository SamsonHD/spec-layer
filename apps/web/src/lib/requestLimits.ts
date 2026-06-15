export class PayloadTooLargeError extends Error {
  readonly status = 413;

  constructor(message: string) {
    super(message);
    this.name = "PayloadTooLargeError";
  }
}

export function assertContentLength(headers: Headers, maxBytes: number): void {
  const raw = headers.get("content-length");
  if (!raw) return;
  const size = Number(raw);
  if (Number.isFinite(size) && size > maxBytes) {
    throw new PayloadTooLargeError(`Request body exceeds ${maxBytes} bytes`);
  }
}
