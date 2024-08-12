import { createToast, upsertToast, deleteToast } from './store';
import type { Toast } from './type';

export const toast = {
	promise(
		promise: Promise<unknown>,
		stateStrings: { pending: string; fulfilled: string; rejected: string }
	) {
		const toast: Toast = {
			id: crypto.randomUUID(),
			message: stateStrings.pending,
			state: 'pending',
			timer: null
		};
		createToast(toast);
		promise
			.then(
				() => {
					toast.message = stateStrings.fulfilled;
					toast.state = 'fulfilled';
					upsertToast(toast);
				},
				() => {
					toast.message = stateStrings.rejected;
					toast.state = 'rejected';
					upsertToast(toast);
				}
			)
			.finally(() => {
				const timeout = setTimeout(() => deleteToast(toast), 3000);
				toast.timer = timeout;
				upsertToast(toast);
			});
	}
};
