import {defineConfig} from 'vitest/config'

export default defineConfig({
    test: {
        browser: {
            enabled: true,
            name: process.env.BROWSER || 'chrome',
            headless: false,
            provider: process.env.PROVIDER || 'webdriverio',
        },
        open: false,
        isolate: false,
    },
})
