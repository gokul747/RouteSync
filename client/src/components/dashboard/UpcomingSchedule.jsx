import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, MapPin, Pencil, Plus } from 'lucide-react'
import { EmptyState } from '../ui/StateMessages'
import ShipmentDrawer from '../shipments/ShipmentDrawer'
import ShipmentFormModal from '../shipments/ShipmentFormModal'
import './upcoming-schedule.css'

export default function UpcomingSchedule({ shipments = [] }) {
  const [selected, setSelected] = useState(null)
  const [updates, setUpdates] = useState({})
  const [createdShipments, setCreatedShipments] = useState([])
  const [booking, setBooking] = useState(false)
  const currentShipments = [...createdShipments, ...shipments].map(shipment => updates[shipment._id] || shipment)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const events = currentShipments.flatMap(shipment => [
    shipment.loadingDate && { shipment, kind: 'Pickup', place: shipment.loadingPlace, date: new Date(shipment.loadingDate) },
    shipment.unloadingDate && { shipment, kind: 'Delivery', place: shipment.unloadingPlace || shipment.destination, date: new Date(shipment.unloadingDate) },
  ]).filter(event => event && event.date >= today && shipmentIsOpen(event.shipment.status))
    .sort((a, b) => a.date - b.date).slice(0, 5)

  return <article className="panel upcoming-panel">
    <div className="panel-heading"><div><h2>Upcoming pickups & deliveries</h2><p>Scheduled shipment stops</p></div><div className="upcoming-actions"><button className="button button-primary upcoming-book" onClick={() => setBooking(true)}><Plus size={13}/> Book delivery</button><Link to="/shipments" className="text-link">All <ArrowUpRight size={14}/></Link></div></div>
    {events.length ? <div className="upcoming-list">{events.map(event => <div className="upcoming-row" key={`${event.shipment._id}-${event.kind}`}>
      <span className={`upcoming-marker ${event.kind.toLowerCase()}`}/>
      <div className="upcoming-time"><strong>{event.date.toLocaleDateString('en', { month: 'short', day: 'numeric' })}</strong><small>{event.date.toLocaleTimeString('en', { hour: 'numeric', minute: '2-digit' })}</small></div>
      <div className="upcoming-info"><strong>{event.kind} · {event.shipment.reference}</strong><span><MapPin size={12}/>{event.place || 'Place not specified'}</span></div>
      <button className="row-action upcoming-edit" onClick={() => setSelected(event.shipment)} aria-label={`Edit ${event.kind.toLowerCase()} for ${event.shipment.reference}`}><Pencil size={14}/></button>
    </div>)}</div> : <EmptyState title="No upcoming stops scheduled" detail="Edit a shipment and set a loading or unloading date today or later."/>}
    <ShipmentDrawer shipment={selected} startEditing onClose={() => setSelected(null)} onSaved={updated => { setUpdates(current => ({ ...current, [updated._id]: updated })); setSelected(updated) }}/>
    {booking && <ShipmentFormModal onClose={() => setBooking(false)} onSaved={created => { setCreatedShipments(current => [created, ...current]); setBooking(false) }}/>}
  </article>
}

function shipmentIsOpen(status) { return ['pending', 'assigned', 'in_transit', 'delayed'].includes(status) }
