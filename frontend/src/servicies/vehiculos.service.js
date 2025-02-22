import axios from 'axios'

const baseUrl = 'http://localhost:3001/vehiculos'

export const getAllVehicle = async () => {
  axios
    .get(`${baseUrl}/all`)
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      console.log(error)
    })
}
