export default function OnDev({nombre}: {nombre: string}): JSX.Element {
    return (
        <div className='flex w-full flex-col bg-base-100 text-white gap-2 p-4'>
           Hola, esta parte todavía esta en desarrollo, pero llegaste a {nombre}, muchas gracias
        </div>
    )
}
