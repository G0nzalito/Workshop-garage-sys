import axios from "axios";

const URL = "http://localhost:4001/api/proveedores";

export const getProveedoresActivos = async () => {
  const response = await axios.get(`${URL}/active`);
  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error(`Error al obtener proovedores: ${response.statusText}`);
  }
}