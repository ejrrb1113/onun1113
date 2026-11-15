import type { IncomingMessage, ServerResponse } from 'node:http';
export function serveEvents(req: IncomingMessage, res: ServerResponse, key?: string): Promise<void>;
