export interface Toast {
	id: number;
	message: string;
	state: 'pending' | 'fulfilled' | 'rejected';
	timer: null | NodeJS.Timeout;
}
