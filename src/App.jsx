import { useState, useEffect } from "react"
import { supabase } from "./supabase"

import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
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

const confirmar = window.confirm("¿Seguro que quieres borrar esta reserva?")

if(!confirmar){
return
}

await supabase
.from("reservas")
.delete()
.eq("id",id)

setMensaje("Reserva eliminada")

cargarReservas()

}

const eventos = reservas.map(r => ({

title: r.cliente+" "+r.hora_inicio+"-"+r.hora_fin,
start: r.fecha,
end: r.fecha,

allDay:true,

backgroundColor: r.estado==="Ocupado" ? "#86efac" : "#fde68a",
borderColor: r.estado==="Ocupado" ? "#4ade80" : "#facc15",
textColor:"#000"

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

<div style={{background:"#eaf3ff",minHeight:"100vh",padding:"30px",fontFamily:"Arial"}}>

<h1 style={{fontSize:"34px",color:"#2563eb",fontWeight:"bold"}}>
Agenda de Reservas
</h1>

<div style={{marginTop:"10px",marginBottom:"20px"}}>

<img
src="https://cdn-icons-png.flaticon.com/512/616/616408.png"
style={{
width:"100px",
animation:"flotar 3s ease-in-out infinite"
}}
/>

<p style={{fontSize:"14px"}}>
Ardilla supervisora 🐿️🏊
</p>

</div>

{mensaje && <p style={{color:"green"}}>{mensaje}</p>}

<div style={{display:"flex",gap:"20px",marginBottom:"30px"}}>

<div style={{background:"white",padding:"15px",borderRadius:"10px",width:"200px"}}>

<h3>Reservas del mes</h3>
<p style={{fontSize:"28px",fontWeight:"bold"}}>{totalReservasMes}</p>

</div>

<div style={{background:"white",padding:"15px",borderRadius:"10px",width:"200px"}}>

<h3>Ingresos del mes</h3>
<p style={{fontSize:"28px",fontWeight:"bold"}}>${ingresosMes}</p>

</div>

</div>

<div style={{background:"white",padding:"20px",borderRadius:"10px",marginBottom:"30px"}}>

<h2>Nueva reserva</h2>

<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"}}>

<input
type="date"
value={fecha}
onChange={(e)=>setFecha(e.target.value)}
/>

<select
value={cliente}
onChange={(e)=>setCliente(e.target.value)}
>

<option></option>
<option>Arena</option>
<option>JB</option>
<option>Jessi</option>
<option>Vale</option>
<option>Pa</option>
<option>Ma</option>

</select>

<input
type="time"
step="1800"
value={horaInicio}
onChange={(e)=>setHoraInicio(e.target.value)}
/>

<input
type="time"
step="1800"
value={horaFin}
onChange={(e)=>setHoraFin(e.target.value)}
/>

<input
type="number"
placeholder="Precio"
value={precio}
onChange={(e)=>setPrecio(e.target.value)}
/>

<select
value={estado}
onChange={(e)=>setEstado(e.target.value)}
>

<option></option>
<option>Ocupado</option>
<option>En espera</option>

</select>

</div>

<button
onClick={guardarReserva}
style={{marginTop:"15px",background:"#2563eb",color:"white",padding:"8px 15px",borderRadius:"6px"}}
>
Guardar reserva
</button>

</div>

<div style={{background:"white",padding:"20px",borderRadius:"10px",marginBottom:"30px"}}>

<h2>Calendario</h2>

<FullCalendar
plugins={[dayGridPlugin,timeGridPlugin]}
initialView="dayGridMonth"
locale={esLocale}
height={650}

headerToolbar={{
left:"prev,next today",
center:"title",
right:"dayGridMonth,timeGridWeek"
}}

events={eventos}

eventTextColor="#000"

dateClick={(info)=>{

const yaReservado = reservas.find(r => r.fecha === info.dateStr)

if(yaReservado){
alert("Ese día ya está reservado")
return
}

setFecha(info.dateStr)

}}

eventClick={(info)=>{

const reserva = reservas.find(r => r.fecha === info.event.startStr)

if(reserva){

setFecha(reserva.fecha)
setHoraInicio(reserva.hora_inicio)
setHoraFin(reserva.hora_fin)
setCliente(reserva.cliente)
setPrecio(reserva.precio)
setEstado(reserva.estado)

}

}}
/>

</div>

<div style={{background:"white",padding:"20px",borderRadius:"10px"}}>

<h2>Reservas</h2>

<table style={{width:"100%",textAlign:"center"}}>

<thead style={{background:"#dbeafe"}}>

<tr>
<th>Fecha</th>
<th>Cliente</th>
<th>Horario</th>
<th>Precio</th>
<th>Estado</th>
<th>Borrar</th>
</tr>

</thead>

<tbody>

{reservas.map(r=>(
<tr key={r.id}>

<td>{r.fecha}</td>
<td>{r.cliente}</td>
<td>{r.hora_inicio} - {r.hora_fin}</td>
<td>${r.precio}</td>
<td>{r.estado}</td>

<td>

<button
onClick={()=>borrarReserva(r.id)}
style={{background:"#ef4444",color:"white",borderRadius:"4px"}}
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