import { describe, expect, test, vi, afterEach } from 'vitest';
import { makeMiddleware } from "../shared/middleware.js";
import type { Request, Response } from 'express';
import { mockLogger, mockRes, mockNext } from '../shared/mocks.js'

const mw = makeMiddleware(mockLogger);

afterEach(() => {
    vi.restoreAllMocks();
});

describe('logRequest', () => {
    const log = mw.logRequest();
    test('should call next', () => {
        const req: Partial<Request> = {
            method: 'GET',
            path: '/',
        }
        log(req as Request, mockRes as Response, mockNext);
        expect(mockNext).toHaveBeenCalled();
    });
});

describe('checkAuthorization', () => {
    const auth = mw.checkAuthorization();
    test('should call next when request includes authorization header', () => {
        const req: Partial<Request> = {
            headers: {
                authorization: 'bearer 123'
            }
        };
        auth(req as Request, mockRes as Response, mockNext);
        expect(mockNext).toHaveBeenCalled();
    });
    test('should respond with 401 when request is missing authorization header', () => {
        const req: Partial<Request> = {};
        auth(req as Request, mockRes as Response, mockNext);
        expect(mockRes.status).toHaveBeenCalledWith(401);
    });
});

describe('validateBody', () => {
    const noSchema = mw.validateBody({});
    test('should call next with no schema', () => {
        const req: Partial<Request> = {
            body: {
                prop: 1,
                hello: 'world'
            }
        };
        noSchema(req as Request, mockRes as Response, mockNext);
        expect(mockNext).toHaveBeenCalled();
    });
    const schema1 = mw.validateBody({ 'a': 'string', 'b': 'object' });
    test('should call next with body exactly matching schema', () => {
        const req: Partial<Request> = {
            body: {
                a: 'hello',
                b: [1, 2, 3, 4, 5],
            }
        };
        schema1(req as Request, mockRes as Response, mockNext);
        expect(mockNext).toHaveBeenCalled();
    });
    test('should call next with body over-implementing schema', () => {
        const req: Partial<Request> = {
            body: {
                a: 'hello',
                b: { prop: 1 },
                c: 0
            }
        };
        schema1(req as Request, mockRes as Response, mockNext);
        expect(mockNext).toHaveBeenCalled();
    });
    test('should respond with 400 when body is missing properties of schema', () => {
        const req: Partial<Request> = {
            body: {
                a: 'hello',
            }
        };
        schema1(req as Request, mockRes as Response, mockNext);
        expect(mockRes.status).toHaveBeenCalledWith(400);
    });
    test('should respond with 400 when body type does not match schema', () => {
        const req: Partial<Request> = {
            body: {
                a: 'hello',
                b: 123
            }
        };
        schema1(req as Request, mockRes as Response, mockNext);
        expect(mockRes.status).toHaveBeenCalledWith(400);
    });
    const schema2 = mw.validateBody({ 'a': 'string', 'b': 'number', 'c': 'boolean', 'd': 'object' });
    test('should call next with request matching schema with falsey values', () => {
        const req: Partial<Request> = {
            body: {
                a: '',
                b: 0,
                c: false,
                d: {}
            }
        };
        schema2(req as Request, mockRes as Response, mockNext);
        expect(mockNext).toHaveBeenCalled();
    });
});

describe('notFoundHandler', () => {
    const notFound = mw.notFoundHandler();
    test('should respond with 404', () => {
        const req: Partial<Request> = {
            method: 'GET',
            path: '/',
        }
        notFound(req as Request, mockRes as Response, mockNext);
        expect(mockRes.status).toHaveBeenCalledWith(404);
    })
})

describe('errorHandler', () => {
    const errorHandler = mw.errorHandler();
    const error = new Error('This is an error');
    test('should respond with 500 when no headers sent', () => {
        const req: Partial<Request> = {};
        errorHandler(error, req as Request, mockRes as Response, mockNext);
        expect(mockRes.status).toHaveBeenCalledWith(500);
    });
    test('should do nothing when headers already sent', () => {
        mockRes.headersSent = true;
        const req: Partial<Request> = {};
        errorHandler(error, req as Request, mockRes as Response, mockNext);
        expect(mockNext).toHaveBeenCalledTimes(0);
        expect(mockRes.status).toHaveBeenCalledTimes(0);
    });
});