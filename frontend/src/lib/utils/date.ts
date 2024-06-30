export function timeSince(timestamp: number): string {
	const now = Date.now() / 1000;
	// sec.
	let elapsed = Math.max(0, now - timestamp);
	if (elapsed < 60) return Math.floor(elapsed) + ' sec. ago';
	// min.
	elapsed /= 60;
	if (elapsed < 60) return Math.floor(elapsed) + ' min. ago';
	// hr.
	elapsed /= 60;
	if (elapsed < 24) return Math.floor(elapsed) + ' hr. ago';
	// day/days
	elapsed /= 24;
	if (elapsed < 30)
		return Math.floor(elapsed) === 1
			? Math.floor(elapsed) + ' day ago'
			: Math.floor(elapsed) + ' days ago';
	// mo.
	elapsed /= 30;
	if (elapsed < 12) return Math.floor(elapsed) + ' mo. ago';
	// yr.
	elapsed /= 12;
	return Math.floor(elapsed) + ' yr. ago';
}

export function dateString(timestamp: number): string {
	// Monday, May 27, 2024 at 6:09:51 PM EDT
	// can cache an Intl.DateTimeFormat() object instead
	return new Date(timestamp * 1000).toLocaleString(undefined, {
		dateStyle: 'full',
		timeStyle: 'long'
	});
}
