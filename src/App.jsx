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

if(!fecha || !horaInicio || !horaFin || !cliente || !precio || !estado){

setMensaje("Debes llenar todos los campos")
return

}

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

function generarHoras(){

const horas=[]

for(let h=0;h<24;h++){

horas.push(`${String(h).padStart(2,'0')}:00`)
horas.push(`${String(h).padStart(2,'0')}:30`)

}

return horas

}

const horas = generarHoras()

const eventos = reservas.map(r => ({

title: r.cliente+" "+r.hora_inicio+"-"+r.hora_fin,

date: r.fecha,

backgroundColor: r.estado==="Ocupado" ? "#166534" : "#facc15",

borderColor:"#000",

textColor:"#fff"

}))

return(

<div style={{background:"#eef6ff",minHeight:"100vh",padding:"30px",fontFamily:"Arial"}}>

<h1 style={{
fontSize:"40px",
color:"#1d4ed8",
fontWeight:"bold",
textAlign:"center"
}}>
Sistema de Reservas de Piscina
</h1>

<div style={{display:"flex",justifyContent:"space-between",marginTop:"20px"}}>

<div style={{textAlign:"center"}}>

<div style={{fontSize:"50px",animation:"nadar 4s infinite"}}>
🐿️
</div>

<p>Ardilla salvavidas</p>

</div>

<div style={{textAlign:"center"}}>

<div style={{fontSize:"50px",animation:"nadar 5s infinite"}}>
🐕
</div>

<p>Crixo el American Bully</p>

</div>

</div>

{mensaje && <p style={{color:"green",marginTop:"10px"}}>{mensaje}</p>}

<div style={{background:"white",padding:"20px",borderRadius:"10px",marginTop:"20px"}}>

<h2>Nueva reserva</h2>

<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"}}>

<div>
<p>Fecha</p>
<input
type="date"
value={fecha}
onChange={(e)=>setFecha(e.target.value)}
/>
</div>

<div>
<p>Cliente</p>
<select
value={cliente}
onChange={(e)=>setCliente(e.target.value)}
>

<option value="">Seleccionar</option>
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
<select
value={horaInicio}
onChange={(e)=>setHoraInicio(e.target.value)}
>

<option value="">Seleccionar</option>

{horas.map(h=>(
<option key={h}>{h}</option>
))}

</select>
</div>

<div>
<p>Hora fin</p>
<select
value={horaFin}
onChange={(e)=>setHoraFin(e.target.value)}
>

<option value="">Seleccionar</option>

{horas.map(h=>(
<option key={h}>{h}</option>
))}

</select>
</div>

<div>
<p>Precio ($)</p>
<input
type="number"
value={precio}
onChange={(e)=>setPrecio(e.target.value)}
/>
</div>

<div>
<p>Estado</p>
<select
value={estado}
onChange={(e)=>setEstado(e.target.value)}
>

<option value="">Seleccionar</option>
<option>Ocupado</option>
<option>En espera</option>

</select>
</div>

</div>

<button
onClick={guardarReserva}
style={{
marginTop:"15px",
background:"#2563eb",
color:"white",
padding:"10px 20px",
borderRadius:"6px"
}}
>
Guardar reserva
</button>

</div>

<div style={{background:"white",padding:"20px",borderRadius:"10px",marginTop:"30px"}}>

<h2>Calendario</h2>

<FullCalendar
plugins={[dayGridPlugin]}
initialView="dayGridMonth"
locale={esLocale}
height={650}
events={eventos}

dateClick={(info)=>{

const yaReservado = reservas.find(r => r.fecha === info.dateStr)

if(yaReservado){

alert("Ese día ya está reservado")
return

}

setFecha(info.dateStr)

}}
/>

</div>

<div style={{background:"white",padding:"20px",borderRadius:"10px",marginTop:"30px"}}>

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
style={{background:"#ef4444",color:"white"}}
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