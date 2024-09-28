import { OpenStreetMapProvider } from 'leaflet-geosearch'

export const getPointData = async (routeName: string) => {
  const provider = new OpenStreetMapProvider({
    params: {
      'accept-language': 'pl',
      countrycodes: 'pl'
    }
  })
  try {
    const response = await provider.search({ query: routeName })
    return response.filter((point) => point.label.includes('małopolskie'))
  } catch (error) {
    throw new Error('Error getting map data')
  }
}
