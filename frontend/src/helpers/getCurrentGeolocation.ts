export const getCurrentGeolocation = () => {
  return new Promise<{ x: number; y: number } | undefined>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coordinates = {
          x: pos.coords.longitude,
          y: pos.coords.latitude
        }
        resolve(coordinates)
      },
      (error) => {
        console.error('Error getting geolocation:', error)
        reject(error)
      }
    )
  })
}
