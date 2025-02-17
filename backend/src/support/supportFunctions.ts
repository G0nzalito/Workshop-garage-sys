export function getDateWithTimeZone(date: Date): string {
  const fechaLocalConZona = new Date(
    date.toLocaleString("en-US", { timeZoneName: "short" })
  )

  return fechaLocalConZona.toISOString()
}

export const formatDateDash = (date: Date) => {
  // Función que nos permite pasar de un objeto tipo date a uno de tipo string en formato YYYY-MM-DD
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

export const formatDateDashARG = (date: Date) => {
  // Funcion que nos permite pasar de un objeto tipo date a uno de tipo string en formato DD-MM-YYYY
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${day}-${month}-${year}`
}

export const formatDateSlash = (date: Date | string) => {
  // Función que nos permite pasar de un objeto tipo date a uno de tipo string en formato YYYY/MM/DD
  // Esta es LA FUNCIÓN A USAR si queremos guardar fechas en algún lado, porque asi es más fácil recuperarlas y transformarlas en objetos tipo DATE

  if (typeof date === "object") {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")

    return `${year}/${month}/${day}`
  } else {
    const fechaSplited = date.split("-")
    const year = fechaSplited[0]
    const month = fechaSplited[1]
    const day = fechaSplited[2]

    return `${year}/${month}/${day}`
  }
}


// Funcion buena para poner el formato timestamptz en formato local
export function convertirFechaLocal(fechaUTC: Date): string {
  const fechaLocal = new Date(
    fechaUTC.toLocaleString("en-US", {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    })
  )

  const year = fechaLocal.getFullYear()
  const month = String(fechaLocal.getMonth() + 1).padStart(2, "0")
  const day = String(fechaLocal.getDate()).padStart(2, "0")
  const hours = String(fechaLocal.getHours()).padStart(2, "0")
  const minutes = String(fechaLocal.getMinutes()).padStart(2, "0")
  const seconds = String(fechaLocal.getSeconds()).padStart(2, "0")

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}
