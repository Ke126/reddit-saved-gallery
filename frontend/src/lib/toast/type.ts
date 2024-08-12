export interface Toast {
	id: string;
	message: string;
	state: 'pending' | 'fulfilled' | 'rejected';
	timer: null | NodeJS.Timeout;
}
