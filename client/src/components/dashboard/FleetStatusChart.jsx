import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import './dashboard-charts.css'

const colors = { available: '#39b47d', in_use: '#4b79ed', maintenance: '#e58a71' }
export default function FleetStatusChart({ vehicles = [] }) {
  const data = ['available', 'in_use', 'maintenance'].map(status => ({ status, label: status.replace('_', ' '), count: vehicles.filter(vehicle => vehicle.status === status).length, color: colors[status] }))
  return <article className="panel chart-panel">
    <div className="panel-heading"><div><h2>Fleet status</h2><p>Vehicle availability breakdown</p></div></div>
    {vehicles.length ? <div className="fleet-chart-layout"><div className="fleet-chart"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data} dataKey="count" nameKey="label" innerRadius={43} outerRadius={65} paddingAngle={3} stroke="none">{data.map(entry => <Cell key={entry.status} fill={entry.color}/>)}</Pie><Tooltip formatter={(value, name) => [value, name]}/></PieChart></ResponsiveContainer></div><div className="fleet-chart-legend">{data.map(entry => <div key={entry.status}><i style={{ background: entry.color }}/><span>{entry.label}</span><strong>{entry.count}</strong></div>)}</div></div> : <div className="chart-empty">Add vehicles to see fleet status.</div>}
  </article>
}
