const record = Symbol("record");


type FieldOrFnMock<T> = T extends (...args: any[]) => infer R ? Mock<R> : Mock<T>;
type ObjMock<T> = { [K in keyof T]: Mock<T>; }

type Mock<T> = T & {
    [record]: (cb: () => T) => void
} & {
    [K in keyof T]: FieldOrFnMock<T[K]>
}

export function mock<T extends object>(): Mock<T> {
    return new Proxy<T>({} as any, new MockRecorder<T>([])) as Mock<T>
}

export function when<T>(mock: Mock<T>): MockSetup<T> {
    return {
        thenReturn(value: T) {
            mock[record](() => value)
        }
    }
}

interface MockSetup<T> {
    thenReturn(value: T): void;
}

interface Invoke {
    type: 'invoke';
    args: any[];
}
type MockPathElement = string | number | symbol | Invoke;
type MockPath = MockPathElement[];



class MockRecorder<T extends object> implements ProxyHandler<T> {
    #proxies: Map<any, any>;

    constructor(private readonly path: MockPath, ) {
        this.#proxies = new Map();
    }

    get(target: T, property: string | number | symbol, receiver: any): any {
        if (this.#proxies.has(property)) {
            return this.#proxies.get(property);
        }

        const proxy = new Proxy({} as any, new MockRecorder([...this.path, property]));
        this.#proxies.set(property, proxy);
        return proxy;
    }

    set(target: T, property: string | number | symbol, value: any): boolean {
        this.#proxies.set(property, value);
        return true;
    }
}
