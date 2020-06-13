import { mock, when } from "../index";

interface MockedObject {
    field: string;
    field2: {
        field: string;
    }
    call(): MockedObject;
}

describe('Recording Mode', () => {
    it('should allow you to provide values for fields', () => {
        const obj = mock<MockedObject>();

        when(obj.field).thenReturn('test');

        expect(obj.field).toEqual('test');
    });

    it('should allow you to provide values for nested fields', () => {
        const obj = mock<MockedObject>();
        when(obj.field2.field).thenReturn('test2');

        expect(obj.field2.field).toEqual('test2');
    });

    it('should allow you to override methods', () => {
        const obj = mock<MockedObject>();

        when(obj.call().field).thenReturn('test');

        expect(obj.call().field).toEqual('test');
    })

    it('should allow you to override deep values for methods', () => {

    })
});