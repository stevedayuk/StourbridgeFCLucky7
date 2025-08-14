export function getMonthNameByIndex(month: number) {
    return new Date(2020, month, 1).toLocaleString('default', { month: 'long' });
}
export function getMonthNameByNumber(month: number) {
    return new Date(2020, month - 1, 1).toLocaleString('default', { month: 'long' })
}