const formatter = (duration, text) => {
    if (Math.floor(duration) !== 1) {
        return `${Math.floor(duration)} ${text}s ago`
    } else {
        return `1 ${text} ago`
    }
}

export const formatSinceDate = (duration) => {
    let durationMinutes = duration / 60
    let durationHours = duration / (60 * 60)
    let durationDays = duration / (60 * 60 * 24)
    let durationMonths = duration / (60 * 60 * 24 * 30)
    let durationYears = duration / (60 * 60 * 24 * 365)

    if (duration < 60) {
        return 'Just now'
    }
    else if (duration < 60 * 60) {
        return formatter(durationMinutes, 'minute')
    }
    else if (duration < 60 * 60 * 24) {
        return formatter(durationHours, 'hour')
    }
    else if (duration < 60 * 60 * 24 * 30) {
        return formatter(durationDays, 'day')
    }
    else if (duration < 60 * 60 * 24 * 365) {
        return formatter(durationMonths, 'month')
    }
    else {
        return formatter(durationYears, 'year')
    }
}