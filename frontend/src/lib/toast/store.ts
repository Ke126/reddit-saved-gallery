import { writable } from 'svelte/store';
import type { Toast } from './type';

export const toasts = writable<Toast[]>([]);

export function createToast(toast: Toast) {
    toasts.update(prev => [toast, ...prev]);
}

export function upsertToast(toast: Toast) {
    toasts.update(prev => (prev[prev.findIndex(_toast => _toast.id === toast.id)] = toast, prev))
}

export function deleteToast(toast: Toast) {
    if (toast.timer) clearTimeout(toast.timer);
    toasts.update(prev => prev.filter(elem => toast.id !== elem.id));
}