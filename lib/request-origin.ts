/**
 * The public origin of a request.
 *
 * `request.url` reflects the connection the runtime actually served, which
 * behind a TLS-terminating reverse proxy is plain HTTP on an internal port.
 * The forwarded headers carry what the visitor asked for, so they win.
 */
export function requestOrigin(request: Request) {
  const url = new URL(request.url);
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? url.host;
  const protocol =
    request.headers.get("x-forwarded-proto") ??
    (host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : url.protocol.slice(0, -1));

  return `${protocol}://${host}`;
}
