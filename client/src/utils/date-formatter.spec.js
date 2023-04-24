import { formatSinceDate } from "./date-formatter"

describe("date-formatter", () => {
    describe("duration equal to zero", () => {
        let duration = 0
        it("should return 'Just now'", () => {
            let result = formatSinceDate(duration)

            expect(result).toBe('Just now')
        })
    })
    describe("duration equal to 30 seconds", () => {
        let duration = 30
        it("should return 'Just now'", () => {
            let result = formatSinceDate(duration)

            expect(result).toBe('Just now')
        })
    })
    describe("duration equal to 1 minute", () => {
        let duration = 60
        it("should return '1 minute ago'", () => {
            let result = formatSinceDate(duration)

            expect(result).toBe('1 minute ago')
        })
    })
    describe("duration equal to 2.4 minutes", () => {
        let duration = 144
        it("should return '2 minutes ago'", () => {
            let result = formatSinceDate(duration)

            expect(result).toBe('2 minutes ago')
        })
    })
    describe("duration equal to 2.5 minutes", () => {
        let duration = 150
        it("should return '2 minutes ago'", () => {
            let result = formatSinceDate(duration)

            expect(result).toBe('2 minutes ago')
        })
    })
    describe("duration equal to 1 hour", () => {
        let duration = 3600
        it("should return '1 hour ago'", () => {
            let result = formatSinceDate(duration)

            expect(result).toBe('1 hour ago')
        })
    })
    describe("duration equal to 23.9 hours", () => {
        let duration = 86040
        it("should return '23 hours ago'", () => {
            let result = formatSinceDate(duration)

            expect(result).toBe('23 hours ago')
        })
    })
    describe("duration equal to 1 day", () => {
        let duration = 86400
        it("should return '1 day ago'", () => {
            let result = formatSinceDate(duration)

            expect(result).toBe('1 day ago')
        })
    })
    describe("duration equal to 10.5 days", () => {
        let duration = 86400 * 10.5
        it("should return '10 days ago'", () => {
            let result = formatSinceDate(duration)

            expect(result).toBe('10 days ago')
        })
    })
    describe("duration equal to 1 month", () => {
        let duration = 86400 * 30
        it("should return '1 month ago'", () => {
            let result = formatSinceDate(duration)

            expect(result).toBe('1 month ago')
        })
    })
    describe("duration equal to 9.5 months", () => {
        let duration = 86400 * 30 * 9.5
        it("should return '9 months ago'", () => {
            let result = formatSinceDate(duration)

            expect(result).toBe('9 months ago')
        })
    })
    describe("duration equal to 1 year", () => {
        let duration = 86400 * 365
        it("should return '1 year ago'", () => {
            let result = formatSinceDate(duration)

            expect(result).toBe('1 year ago')
        })
    })
    describe("duration equal to 5.2 years", () => {
        let duration = 86400 * 365 * 5.2
        it("should return '5 years ago'", () => {
            let result = formatSinceDate(duration)

            expect(result).toBe('5 years ago')
        })
    })
})