import { useState, useEffect } from "react"
import { supabase } from "./supabase"

import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import esLocale from "@fullcalendar/core/locales/es"

function App(){

const [fecha,setFecha] = useState("")
const [horaInicio,setHoraInicio] = useState("")
const [horaFin,setHoraFin] = useState("")
const [cliente,setCliente] = useState("")
const [precio,setPrecio] = useState("")
const [estado,setEstado] = useState("")
const [reservas,setReservas] = useState([])
const [mensaje,setMensaje] = useState("")

useEffect(()=>{
cargarReservas()
},[])

async function cargarReservas(){

const { data } = await supabase
.from("reservas")
.select("*")
.order("fecha",{ascending:true})

setReservas(data || [])

}

async function guardarReserva(){

const { data } = await supabase
.from("reservas")
.select("*")
.eq("fecha",fecha)

if(data.length>0){
setMensaje("Ese día ya tiene una reserva")
return
}

const { error } = await supabase
.from("reservas")
.insert([
{
fecha,
hora_inicio:horaInicio,
hora_fin:horaFin,
cliente,
precio,
estado
}
])

if(error){

setMensaje("Error al guardar")

}else{

setMensaje("Reserva guardada correctamente")

setFecha("")
setHoraInicio("")
setHoraFin("")
setCliente("")
setPrecio("")
setEstado("")

cargarReservas()

}

}

async function borrarReserva(id){

await supabase
.from("reservas")
.delete()
.eq("id",id)

cargarReservas()

}

const eventos = reservas.map(r=>({

title: r.cliente+" "+r.hora_inicio,
date: r.fecha,
color: r.estado==="Ocupado" ? "#86efac" : "#fde68a"

}))

const mesActual = new Date().getMonth()
const anioActual = new Date().getFullYear()

const reservasMes = reservas.filter(r=>{

const fechaReserva = new Date(r.fecha)

return fechaReserva.getMonth()===mesActual &&
fechaReserva.getFullYear()===anioActual

})

const totalReservasMes = reservasMes.length

const ingresosMes = reservasMes.reduce((total,r)=>{

return total + Number(r.precio)

},0)

return(

<div className="min-h-screen bg-blue-50 p-10 font-sans">

<h1 className="text-4xl font-bold text-blue-700 mb-8">
Agenda de Reservas
</h1>

{mensaje && <p className="mb-4 text-green-600">{mensaje}</p>}

<div className="grid grid-cols-2 gap-6 mb-10">

<div className="bg-white p-6 rounded-xl shadow">

<h2 className="text-xl font-semibold text-blue-700 mb-2">
Reservas del mes
</h2>

<p className="text-3xl font-bold">
{totalReservasMes}
</p>

</div>

<div className="bg-white p-6 rounded-xl shadow">

<h2 className="text-xl font-semibold text-blue-700 mb-2">
Ingresos del mes
</h2>

<p className="text-3xl font-bold">
${ingresosMes}
</p>

</div>

</div>

<div className="bg-white p-6 rounded-xl shadow mb-10">

<h2 className="text-2xl font-semibold text-blue-700 mb-6">
Nueva reserva
</h2>

<div className="grid grid-cols-2 gap-4">

<div>
<p>Fecha</p>
<input
type="date"
value={fecha}
onChange={(e)=>setFecha(e.target.value)}
className="border p-2 rounded w-full"
/>
</div>

<div>
<p>Cliente</p>
<select
value={cliente}
onChange={(e)=>setCliente(e.target.value)}
className="border p-2 rounded w-full"
>
<option></option>
<option>Arena</option>
<option>JB</option>
<option>Jessi</option>
<option>Vale</option>
<option>Pa</option>
<option>Ma</option>
</select>
</div>

<div>
<p>Hora inicio</p>
<input
type="time"
step="1800"
value={horaInicio}
onChange={(e)=>setHoraInicio(e.target.value)}
className="border p-2 rounded w-full"
/>
</div>

<div>
<p>Hora fin</p>
<input
type="time"
step="1800"
value={horaFin}
onChange={(e)=>setHoraFin(e.target.value)}
className="border p-2 rounded w-full"
/>
</div>

<div>
<p>Precio</p>
<input
type="number"
value={precio}
onChange={(e)=>setPrecio(e.target.value)}
className="border p-2 rounded w-full"
/>
</div>

<div>
<p>Estado</p>
<select
value={estado}
onChange={(e)=>setEstado(e.target.value)}
className="border p-2 rounded w-full"
>
<option></option>
<option>Ocupado</option>
<option>En espera</option>
</select>
</div>

</div>

<button
onClick={guardarReserva}
className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
>
Guardar reserva
</button>

</div>

<div className="bg-white p-6 rounded-xl shadow mb-10">

<h2 className="text-2xl font-semibold text-blue-700 mb-4">
Calendario
</h2>

<FullCalendar
plugins={[dayGridPlugin]}
initialView="dayGridMonth"
events={eventos}
locale={esLocale}
/>

</div>

<div className="bg-white p-6 rounded-xl shadow">

<h2 className="text-2xl font-semibold text-blue-700 mb-4">
Reservas
</h2>

<table className="w-full border">

<thead className="bg-blue-100">

<tr>
<th className="p-2">Fecha</th>
<th className="p-2">Cliente</th>
<th className="p-2">Horario</th>
<th className="p-2">Precio</th>
<th className="p-2">Estado</th>
<th className="p-2">Borrar</th>
</tr>

</thead>

<tbody>

{reservas.map(r=>(
<tr key={r.id} className="text-center border">

<td className="p-2">{r.fecha}</td>
<td className="p-2">{r.cliente}</td>
<td className="p-2">{r.hora_inicio} - {r.hora_fin}</td>
<td className="p-2">${r.precio}</td>
<td className="p-2">{r.estado}</td>

<td className="p-2">
<button
onClick={()=>borrarReserva(r.id)}
className="bg-red-500 text-white px-3 py-1 rounded"
>
X
</button>
</td>

</tr>
))}

</tbody>

</table>

</div>

</div>

)

}

export default App