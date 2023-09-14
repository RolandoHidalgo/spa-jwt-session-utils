import {describe, expect, test} from 'vitest'
import {getTokens, saveTokens} from "../dist";



test('adds 1 + 2 to equal 3', () => {
    expect(1 + 2).toBe(3)
})


describe('saveTokens', () => {
    test('should be null', () => {
        expect(getTokens().accessToken).toBeNull();
    })
    test('should not be null', () => {
        saveTokens({accessToken:"asd",refreshToken:"asd"})
        expect(getTokens().accessToken).not.toBeNull();
    })

})
