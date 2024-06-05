import { describe, expect, test, vi, afterEach } from 'vitest';
import { controller } from '../controllers/posts.controller.js';
import { mockGoodFetch, mockLogger, mockNext, mockRes } from '../shared/mocks.js';
import type {Request, Response, NextFunction} from 'express';

afterEach(() => {
    vi.restoreAllMocks();
});

describe('GET /posts', () => {
    // const goodHandler = controller.get(mockLogger, mockGoodFetch);
    // test('should forward data from good fetch', () => {
    //     const req: Partial<Request> = {
    //         method: 'GET'
    //     }
    //     goodHandler(req as Request, mockRes as Response, mockNext);
    //     expect(mockLogger.http).toHaveBeenCalledWith(`Received ${req.method} request to ${req.path}`);
    //     expect(mockNext).toHaveBeenCalled();
    // });
});