// importing this alias function lets me use the generically typed function in the markup
export function promiseWithResolvers() {
    return Promise.withResolvers<void>();
}
