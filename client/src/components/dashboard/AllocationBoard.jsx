import { Link } from 'react-router-dom'
import { ArrowUpRight, Package, Truck, UserRound } from 'lucide-react'
import StatusBadge from '../ui/StatusBadge'
import { EmptyState } from '../ui/StateMessages'
import './allocation-board.css'

export default function AllocationBoard({ shipments = [] }) {
  const recent = [...shipments].sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)).slice(0, 5)
  return <article className="panel allocation-panel">
    <div className="panel-heading"><div><h2>Driver & vehicle assignments</h2><p>Shipment allocations at a glance</p></div><Link to="/shipments" className="text-link">All shipments <ArrowUpRight size={14}/></Link></div>
    {recent.length ? <div className="allocation-list">{recent.map(shipment => <div className="allocation-item" key={shipment._id}>
      <div className="allocation-shipment"><span className="table-icon"><Package size={14}/></span><div><strong>{shipment.reference}</strong><small>{shipment.destination || 'Destination pending'}</small></div><StatusBadge status={shipment.status}/></div>
      <div className="allocation-resources"><span><UserRound size={13}/><b>{shipment.driver?.name || 'Driver not assigned'}</b></span><span><Truck size={13}/><b>{shipment.vehicle?.name || 'Vehicle not assigned'}</b></span></div>
    </div>)}</div> : <EmptyState title="No shipments yet" detail="Shipment driver and vehicle allocations will appear here."/>}
  </article>
}
