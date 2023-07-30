export interface ConnectionLike {
	Disconnect(): void;
}

export interface SignalLike {
	Connect?(cb: Callback): ConnectionLike;
	connect?(cb: Callback): ConnectionLike;
}

export type InferSignalParameters<S> = S extends SignalLike
	? Parameters<
			Parameters<
				S["Connect"] extends Callback ? S["Connect"] : S["connect"] extends Callback ? S["connect"] : never
			>
	  >
	: never;

export function connect<T extends SignalLike>(
	event: T,
	callback: (...signalArguments: InferSignalParameters<T>) => void,
) {
	if ("Connect" in event) {
		assert(typeIs(event.Connect, "function"), "not a function");
		return event.Connect(callback);
	} else if ("connect" in event) {
		assert(typeIs(event.connect, "function"), "not a function");
		return event.connect(callback);
	} else return { Disconnect() {} };
}
