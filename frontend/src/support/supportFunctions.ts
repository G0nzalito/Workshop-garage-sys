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