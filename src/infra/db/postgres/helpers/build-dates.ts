// easy way of getting different dates
export const buildDatesByDay = (size: number, step: number): Date[] => {
  return [...Array(size)].map((_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i * step)
    return date
  })
}
