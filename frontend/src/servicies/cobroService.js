import axios from 'axios'

const URL = 'http://localhost:4001/api/ventas'

export const generarCobroSinODT = async ({
  Forma_de_pago,
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
  Supervisor
}) => {
  if (
    !Forma_de_pago ||
    !Fuente_MKT ||
    !Numero_Documento_Cliente ||
    !Tipo_Documento_Cliente ||
    !Sub_Total ||
    !Turno
  ) {
    throw new ReferenceError('Faltan datos requeridos')
  } else {
    if ((Forma_de_pago === 2 || Forma_de_pago === 3) && (!N_Autorizacion || !N_Cupon || !N_Lote)) {
      throw new ReferenceError('Faltan datos requeridos')
    }
  }
  const response = await axios.post(`${URL}/create`, {
    data: {
      Forma_de_pago,
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
      Supervisor
    }
  })
  if (response.status === 200) {
    return response.data
  } else {
    throw new Error(`Error al generar cobro: ${response.statusText}`)
  }
}

