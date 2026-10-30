import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import './dashboard-charts.css'

export default function UpcomingScheduleChart({ shipments = [] }) {
  const data = useMemo(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0)
    return Array.from({ length: 7 }, (_, index) => {
      const day = new Date(today); day.setDate(today.getDate() + index)
      const next = new Date(day); next.setDate(day.getDate() + 1)
      const events = shipments.filter(shipment => ['pending', 'assigned', 'in_transit', 'delayed'].includes(shipment.status))
      return {
        day: index === 0 ? 'Today' : day.toLocaleDateString('en', { weekday: 'short' }),
        pickups: events.filter(shipment => shipment.loadingDate && new Date(shipment.loadingDate) >= day && new Date(shipment.loadingDate) < next).length,
        deliveries: events.filter(shipment => shipment.unloadingDate && new Date(shipment.unloadingDate) >= day && new Date(shipment.unloadingDate) < next).length,
      }
    })
  }, [shipments])

  return <article className="panel chart-panel">
    <div className="panel-heading"><div><h2>Upcoming schedule</h2><p>Pickups and deliveries over the next 7 days</p></div></div>
    <div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><BarChart data={data} margin={{ top: 10, right: 8, left: -22, bottom: 0 }}><CartesianGrid stroke="#edf0f5" vertical={false}/><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9aa3b2', fontSize: 10 }}/><YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#9aa3b2', fontSize: 10 }}/><Tooltip/><Legend iconType="circle" wrapperStyle={{ fontSize: 10 }}/><Bar dataKey="pickups" name="Pickups" fill="#e8aa43" radius={[4,4,0,0]}/><Bar dataKey="deliveries" name="Deliveries" fill="#3b72f5" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></div>
  </article>
}
