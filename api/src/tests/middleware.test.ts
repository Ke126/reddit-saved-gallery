import { describe, expect, test, vi, afterEach } from 'vitest';
import { logIncomingRequest, checkAuthorization, validateBody, sendError } from "../shared/middleware.js";
import type { Request, Response } from 'express';
import { mockLogger, mockRes, mockNext } from '../shared/mocks.js'

afterEach(() => {
    vi.restoreAllMocks();
});

describe('logIncomingRequest', () => {
    const mw = logIncomingRequest(mockLogger);
    test('should log incoming request', () => {
        const req: Partial<Request> = {
            method: 'GET',
            path: '/',
        }
        mw(req as Request, mockRes as Response, mockNext);
        expect(mockLogger.http).toHaveBeenCalledWith(`Received ${req.method} request to ${req.path}`);
        expect(mockNext).toHaveBeenCalled();
    });
});

describe('checkAuthorization', () => {
    const mw = checkAuthorization(mockLogger);
    test('should succeed with authorization header', () => {
        const req: Partial<Request> = {
            headers: {
                authorization: 'bearer 123'
            }
        };
        mw(req as Request, mockRes as Response, mockNext);
        expect(mockNext).toHaveBeenCalled();
    });
    test('should fail with missing authorization header', () => {
        const req: Partial<Request> = {};
        mw(req as Request, mockRes as Response, mockNext);
        expect(mockLogger.warn).toHaveBeenCalledWith('Not authorized');
        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'Not authorized' });
    });
});

describe('validateBody', () => {
    const mw1 = validateBody(mockLogger, {});
    test('should succeed with no schema', () => {
        const req: Partial<Request> = {
            body: {
                prop: 1,
                hello: 'world'
            }
        };
        mw1(req as Request, mockRes as Response, mockNext);
        expect(mockNext).toHaveBeenCalled();
    });
    const mw2 = validateBody(mockLogger, { 'a': 'string', 'b': 'object' });
    test('should succeed with request matching schema', () => {
        const req: Partial<Request> = {
            body: {
                a: 'hello',
                b: [1, 2, 3, 4, 5],
                c: 0
            }
        };
        mw2(req as Request, mockRes as Response, mockNext);
        expect(mockNext).toHaveBeenCalled();
    });
    test('should fail with request missing properties of schema', () => {
        const req: Partial<Request> = {
            body: {
                a: 'hello',
                b: undefined,
                c: 0
            }
        };
        mw2(req as Request, mockRes as Response, mockNext);
        expect(mockLogger.warn).toHaveBeenCalledWith('Bad request body');
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'Bad request body' });
    });
    test('should fail with request having incorrect typing of schema', () => {
        const req: Partial<Request> = {
            body: {
                a: 'hello',
                b: 123
            }
        };
        mw2(req as Request, mockRes as Response, mockNext);
        expect(mockLogger.warn).toHaveBeenCalledWith('Bad request body');
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'Bad request body' });
    });
    const mw3 = validateBody(mockLogger, { 'a': 'string', 'b': 'number', 'c': 'boolean', 'd': 'object' });
    test('should succeed with request matching schema with falsey values', () => {
        const req: Partial<Request> = {
            body: {
                a: '',
                b: 0,
                c: false,
                d: {}
            }
        };
        mw3(req as Request, mockRes as Response, mockNext);
        expect(mockNext).toHaveBeenCalled();
    });
});

describe('sendError', () => {
    const mw = sendError(mockLogger);
    const error = new Error('This is an error');
    test('should send error when no headers sent', () => {
        const req: Partial<Request> = {};
        mw(error, req as Request, mockRes as Response, mockNext);
        expect(mockLogger.error).toHaveBeenCalledWith('This is an error');
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
    test('should do nothing when headers already sent', () => {
        mockRes.headersSent = true;
        const req: Partial<Request> = {};
        mw(error, req as Request, mockRes as Response, mockNext);
        expect(mockRes.status).toHaveBeenCalledTimes(0);
        expect(mockRes.json).toHaveBeenCalledTimes(0);
    });
});