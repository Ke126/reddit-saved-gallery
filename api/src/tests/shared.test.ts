import { describe, expect, test, vi, afterEach } from 'vitest';
import { tryThriceWrapper } from '../shared/tryThrice.js';
import { mockLogger } from '../shared/mocks.js';
import type { ILogger } from '../shared/logger.models.js';

afterEach(() => {
    vi.restoreAllMocks();
});

describe('tryThriceWrapper', () => {
    test('should return when wrapping deterministic function', async () => {
        const toWrap = vi.fn((logger: ILogger, x: number) => Promise.resolve(x));
        const wrapped = tryThriceWrapper(mockLogger, toWrap);
        const result = await wrapped(123);
        expect(result).toEqual(123);
        expect(mockLogger.warn).toHaveBeenCalledTimes(0);
        expect(mockLogger.error).toHaveBeenCalledTimes(0);
    });
    test('should return when succeeding after 2 fails', async () => {
        const toWrap = (() => {
            let count = 0;
            return vi.fn((logger: ILogger, x: number) => ++count === 3 ? Promise.resolve(x) : Promise.reject(x));
        })();
        const wrapped = tryThriceWrapper(mockLogger, toWrap);
        const result = await wrapped(123);
        expect(result).toEqual(123);
        expect(mockLogger.warn).toHaveBeenCalledTimes(2);
        expect(mockLogger.error).toHaveBeenCalledTimes(0);
    });
    test('should throw when wrapping failing function', async () => {
        const toWrap = vi.fn((logger: ILogger, x: number) => Promise.reject(x));
        const wrapped = tryThriceWrapper(mockLogger, toWrap);
        await expect(() => wrapped(123)).rejects.toThrowError();
        expect(mockLogger.warn).toHaveBeenCalledTimes(2);
        expect(mockLogger.error).toHaveBeenCalledTimes(1);
    });
    test('should work when wrapping deterministic 2 argument function', async () => {
        const toWrap = vi.fn((logger: ILogger, x: number, y: string) => Promise.resolve(x + y));
        const wrapped = tryThriceWrapper(mockLogger, toWrap);
        const result = await wrapped(123, 'hello');
        expect(result).toEqual('123hello');
        expect(mockLogger.warn).toHaveBeenCalledTimes(0);
        expect(mockLogger.error).toHaveBeenCalledTimes(0);
    });
});