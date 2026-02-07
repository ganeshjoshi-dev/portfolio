export interface HttpStatusEntry {
  code: number;
  name: string;
  description: string;
  useCase?: string;
}

export const HTTP_STATUS_CODES: HttpStatusEntry[] = [
  { code: 100, name: 'Continue', description: 'Client should continue the request or ignore if already finished.' },
  { code: 101, name: 'Switching Protocols', description: 'Server is switching protocol (e.g. to WebSocket).' },
  { code: 102, name: 'Processing', description: 'Request received; processing continues (WebDAV).' },
  { code: 103, name: 'Early Hints', description: 'Used with Link header to allow preloading resources.' },

  { code: 200, name: 'OK', description: 'Request succeeded.', useCase: 'Standard success for GET, PUT, PATCH.' },
  { code: 201, name: 'Created', description: 'Resource created successfully.', useCase: 'After POST creating a new resource.' },
  { code: 202, name: 'Accepted', description: 'Request accepted for processing; not yet completed.', useCase: 'Async processing, batch jobs.' },
  { code: 204, name: 'No Content', description: 'Request succeeded; no body to return.', useCase: 'DELETE success, or POST when no response body needed.' },
  { code: 206, name: 'Partial Content', description: 'Server is returning partial content (range request).', useCase: 'Video streaming, resume downloads.' },

  { code: 300, name: 'Multiple Choices', description: 'Multiple possible responses; client or user should choose.' },
  { code: 301, name: 'Moved Permanently', description: 'Resource permanently moved to a new URL.', useCase: 'SEO: use for permanent redirects.' },
  { code: 302, name: 'Found', description: 'Resource temporarily at a different URI.', useCase: 'Temporary redirect.' },
  { code: 303, name: 'See Other', description: 'Redirect to another resource (usually via GET).' },
  { code: 304, name: 'Not Modified', description: 'Cached response is still valid.', useCase: 'Conditional GET; no body returned.' },
  { code: 307, name: 'Temporary Redirect', description: 'Temporary redirect; method and body must not change.' },
  { code: 308, name: 'Permanent Redirect', description: 'Permanent redirect; method and body must not change.' },

  { code: 400, name: 'Bad Request', description: 'Request has invalid syntax or cannot be understood.', useCase: 'Validation errors, malformed JSON.' },
  { code: 401, name: 'Unauthorized', description: 'Authentication required or failed.', useCase: 'Missing or invalid credentials.' },
  { code: 403, name: 'Forbidden', description: 'Server understood request but refuses to authorize.', useCase: 'Valid user but insufficient permissions.' },
  { code: 404, name: 'Not Found', description: 'Resource not found.', useCase: 'Wrong URL, deleted resource.' },
  { code: 405, name: 'Method Not Allowed', description: 'HTTP method not allowed for this resource.', useCase: 'e.g. POST not allowed on read-only endpoint.' },
  { code: 408, name: 'Request Timeout', description: 'Server timed out waiting for the request.' },
  { code: 409, name: 'Conflict', description: 'Request conflicts with current state (e.g. version conflict).', useCase: 'Duplicate create, optimistic locking.' },
  { code: 410, name: 'Gone', description: 'Resource no longer available and will not be again.' },
  { code: 413, name: 'Payload Too Large', description: 'Request body larger than server allows.' },
  { code: 415, name: 'Unsupported Media Type', description: 'Request payload format not supported.', useCase: 'Wrong Content-Type.' },
  { code: 422, name: 'Unprocessable Entity', description: 'Syntax valid but semantic errors.', useCase: 'Validation errors (e.g. REST API).' },
  { code: 429, name: 'Too Many Requests', description: 'Rate limit exceeded.', useCase: 'Throttling.' },

  { code: 500, name: 'Internal Server Error', description: 'Unexpected server error.', useCase: 'Unhandled exception, bug.' },
  { code: 501, name: 'Not Implemented', description: 'Server does not support the functionality.' },
  { code: 502, name: 'Bad Gateway', description: 'Invalid response from upstream server.', useCase: 'Proxy/load balancer; upstream down or error.' },
  { code: 503, name: 'Service Unavailable', description: 'Server temporarily unable to handle request.', useCase: 'Overloaded, maintenance.' },
  { code: 504, name: 'Gateway Timeout', description: 'Upstream server did not respond in time.', useCase: 'Proxy timeout.' },
];

export function searchStatusCodes(query: string): HttpStatusEntry[] {
  const q = query.toLowerCase().trim();
  if (!q) return HTTP_STATUS_CODES;
  return HTTP_STATUS_CODES.filter(
    (entry) =>
      String(entry.code).includes(q) ||
      entry.name.toLowerCase().includes(q) ||
      entry.description.toLowerCase().includes(q) ||
      (entry.useCase && entry.useCase.toLowerCase().includes(q))
  );
}
