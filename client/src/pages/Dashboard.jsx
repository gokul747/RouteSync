import { useMemo } from 'react'
import { ArrowUpRight, Box, CircleCheck, Truck, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import useFleetSnapshot from '../hooks/useFleetSnapshot'
import { Loading, ErrorMessage } from '../components/ui/StateMessages'
import { KpiCard, DeliveryTrendChart, PipelineBreakdown, ActivityFeed, AttentionPanel, FleetReadiness, AllocationBoard, UpcomingSchedule, UpcomingScheduleChart, FleetStatusChart } from '../components/dashboard'

export default function Dashboard() {
  const { vehicles, drivers, shipments, loading, error } = useFleetSnapshot()
  const trend = useMemo(() => {
    const now = new Date()
    return Array.from({ length: 7 }, (_, index) => {
      const day = new Date(now)
      day.setDate(now.getDate() - 6 + index)
      return { label: day.toLocaleDateString('en', { weekday: 'short' }), delivered: shipments.filter(shipment => shipment.status === 'delivered' && new Date(shipment.updatedAt || shipment.createdAt).toDateString() === day.toDateString()).length }
    })
  }, [shipments])
  const delivered = shipments.filter(shipment => shipment.status === 'delivered').length
  const active = shipments.filter(shipment => ['assigned', 'in_transit'].includes(shipment.status)).length
  const monthStart = new Date(); monthStart.setDate(1)
  const deliveredMonth = shipments.filter(shipment => shipment.status === 'delivered' && new Date(shipment.updatedAt || shipment.createdAt) >= monthStart).length

  if (loading) return <Loading label="Loading your operations…"/>
  if (error) return <ErrorMessage message={error}/>

  return <>
    <div className="welcome-row"><div><div className="eyebrow">{new Date().toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}</div><h1>Good morning, {(JSON.parse(localStorage.getItem('routesync_user') || '{}').name || 'there').split(' ')[0]} <span className="wave">✦</span></h1><p>Here’s what’s happening across your operation today.</p></div><Link className="button button-primary" to="/shipments"><Box size={16}/> View shipments <ArrowUpRight size={15}/></Link></div>
    <section className="kpi-grid"><KpiCard label="TOTAL SHIPMENTS" value={shipments.length} detail="All time" icon={Box}/><KpiCard label="IN TRANSIT" value={active} detail="Assigned & on the road" icon={Truck} tone="violet"/><KpiCard label="DELIVERED THIS MONTH" value={deliveredMonth} detail="Completed deliveries" icon={CircleCheck} tone="green"/><KpiCard label="ACTIVE DRIVERS" value={drivers.filter(driver => driver.status === 'active').length} detail={`${drivers.length} total in directory`} icon={Users} tone="amber"/></section>
    <section className="dashboard-grid">
      <article className="panel trend-panel"><div className="panel-heading"><div><h2>Delivery performance</h2><p>Completed shipments over the last 7 days</p></div><span className="panel-stat"><strong>{delivered}</strong><small>delivered total</small></span></div><DeliveryTrendChart data={trend}/></article>
      <article className="panel"><div className="panel-heading"><div><h2>Shipment pipeline</h2><p>Current status breakdown</p></div><Link to="/shipments" className="text-link">View all <ArrowUpRight size={14}/></Link></div><PipelineBreakdown shipments={shipments}/></article>
      <UpcomingScheduleChart shipments={shipments}/>
      <FleetStatusChart vehicles={vehicles}/>
      <article className="panel"><div className="panel-heading"><div><h2>Fleet readiness</h2><p>Vehicle availability at a glance</p></div><Link to="/fleet" className="text-link">Manage fleet <ArrowUpRight size={14}/></Link></div><FleetReadiness vehicles={vehicles}/></article>
      <AllocationBoard shipments={shipments}/>
      <UpcomingSchedule shipments={shipments}/>
      <article className="panel"><div className="panel-heading"><div><h2>Recent activity</h2><p>Latest updates from your team</p></div><span className="live-label"><i/> LIVE</span></div><ActivityFeed shipments={shipments}/></article>
      <article className="panel attention-panel"><div className="panel-heading"><div><h2>Needs attention</h2><p>Items that may need a closer look</p></div><span className="attention-count">{vehicles.filter(vehicle => vehicle.status === 'maintenance').length + shipments.filter(shipment => shipment.status === 'delayed').length}</span></div><AttentionPanel vehicles={vehicles} shipments={shipments}/></article>
    </section>
    <footer className="page-footer">RouteSync Operations <span>·</span> {new Date().getFullYear()} <span className="footer-right">{vehicles.length} vehicles <span>·</span> {drivers.length} drivers <span>·</span> {shipments.length} shipments</span></footer>
  </>
}
