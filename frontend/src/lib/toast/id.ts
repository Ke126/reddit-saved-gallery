export function idGenerator(): () => number {
	let id = 0;
	return () => id++;
}
