import { vi } from 'vitest';
import type { ILogger } from './logger.models.js';
import type { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express';

export const mockLogger: ILogger = {
    error: vi.fn((msg: string) => { }),
    warn: vi.fn((msg: string) => { }),
    info: vi.fn((msg: string) => { }),
    http: vi.fn((msg: string) => { }),
    verbose: vi.fn((msg: string) => { }),
    debug: vi.fn((msg: string) => { }),
    silly: vi.fn((msg: string) => { }),
};

export const mockRes: Partial<ExpressResponse> = {
    status: vi.fn((status: number) => mockRes as ExpressResponse),
    json: vi.fn((json: Record<string, string>) => mockRes as ExpressResponse),
    headersSent: false
};

export const mockNext = vi.fn();

export const mockGoodFetch = vi.fn((arg: Request) => Promise.resolve(new Response(JSON.stringify({ msg: 'OK' }), { status: 200 })));

export const mockBadFetch = vi.fn((arg: Request) => Promise.reject(new Response(JSON.stringify({ msg: 'BAD' }), { status: 500 })));