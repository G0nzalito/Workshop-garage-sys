import axios from "axios";

const URLCategorias = "http://localhost:4001/api/categorias";
const URLSubCategorias = "http://localhost:4001/api/subcategorias";

export const getCategoriasProductos = async () => {
  const response = await axios.get(`${URLCategorias}/active`);
  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error(`Error al obtener categorias: ${response.statusText}`);
  }
}

export const getSubCategoriasProductosByCategoria = async (categoria) => {
  const response = await axios.get(`${URLSubCategorias}/specific`, { params: { Categoria: categoria } })
  if (response.status === 200) {
    return response.data
  } else {
    throw new Error(`Error al obtener subcategorias: ${response.statusText}`)
  }
}