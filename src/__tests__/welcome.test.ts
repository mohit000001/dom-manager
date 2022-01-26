import { welcome } from "../../lib";

test('welcome test', ()=>{
    expect(welcome('mohit')).toBe('Hello mohit');
})