import busData from '@/app/data/bus_routes.json'

const getDirectBuses = (from: string, to: string) => {
  return busData.filter(bus => {
    const stops = bus["Main Stops"]
    const fromIndex = stops.indexOf(from)
    const toIndex = stops.indexOf(to)
    return fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex
  })
}

export default getDirectBuses
