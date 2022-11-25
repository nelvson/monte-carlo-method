declare global {
	export type Nullable<T> = T | null;
	type ObjectKey<T = *> = { [key: string]: T };
}

export { };