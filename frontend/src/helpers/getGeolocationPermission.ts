export const getGeolocationPermission = async () => {
  let permissionStatus: 'granted' | 'prompt' | 'denied' = 'denied'
  try {
    const result = await navigator.permissions.query({ name: 'geolocation' })
    permissionStatus = result.state as 'granted' | 'prompt' | 'denied'
  } catch (error) {
    console.error('Error checking permissions:', error)
  }

  return permissionStatus
}
