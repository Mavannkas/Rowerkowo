import { OpenStreetMapProvider } from 'leaflet-geosearch'

export const getPointData = async (routeName: string) => {
  const provider = new OpenStreetMapProvider()
  try {
    const response = await provider.search({ query: routeName })
    return response
  } catch (error) {
    throw new Error('Error getting map data')
  }
}
