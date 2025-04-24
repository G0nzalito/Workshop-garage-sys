import axios from 'axios'
// import { modificarStockProducto } from './productosService.ts'

const URLCaja = 'http://localhost:4001/api/ventas'

async function generarCobroSinODT({
  Forma_de_Pago,
  Tarjeta,
  Cuotas,
  Fuente_MKT,
  Numero_Documento_Cliente,
  Tipo_Documento_Cliente,
  Sub_Total,
  Turno,
  N_Autorizacion,
  N_Cupon,
  N_Lote,
  Operador_1,
  Operador_2,
  Supervisor,
  Descripcion,
  sucursal_id,
  Tipo_de_comprobante
}) {
  if (
    !Forma_de_Pago ||
    !Fuente_MKT ||
    !Numero_Documento_Cliente ||
    !Tipo_Documento_Cliente ||
    !Sub_Total ||
    !Turno
  ) {
    throw new ReferenceError('Faltan datos requeridos')
  } else {
    if ((Forma_de_Pago === 2 || Forma_de_Pago === 3) && (!N_Autorizacion || !N_Cupon || !N_Lote)) {
      throw new ReferenceError('Faltan datos requeridos para pago con tarjeta')
    }
  }

  const data = {}
  for (let entry in arguments[0]) {
    if (arguments[0][entry] !== '') {
      data[entry] = arguments[0][entry]
    }
  }

  // console.log('data', data)

  const response = await axios.post(`${URLCaja}/create`, data)

  // console.log('response', response)

  if (response.status === 201) {
    return response.status
  } else {
    throw new Error(`Error al generar cobro: ${response.statusText}`)
  }
}

export { generarCobroSinODT }
