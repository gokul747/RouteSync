import { useState } from 'react'
import { Eye, Package, Pencil } from 'lucide-react'
import { formatDate } from '../../utils/labels'
import { EmptyState } from '../ui/StateMessages'
import { updateShipment } from '../../services/shipmentService'

const statuses = ['pending', 'assigned', 'in_transit', 'delivered', 'delayed']
export default function ShipmentsList({ shipments, onSelect, onEdit, onUpdated }) {
  const [savingId, setSavingId] = useState(null)
  const [rowErrors, setRowErrors] = useState({})

  async function changeStatus(shipment, status) {
    setSavingId(shipment._id)
    setRowErrors(current => ({ ...current, [shipment._id]: '' }))
    try {
      const updated = await updateShipment(shipment._id, { status })
      onUpdated?.(updated)
    } catch (error) {
      setRowErrors(current => ({ ...current, [shipment._id]: error.response?.data?.message || 'Could not update status.' }))
    } finally {
      setSavingId(null)
    }
  }

  return shipments.length ? <div className="table-scroll"><table><thead><tr><th>REFERENCE</th><th>LOADING PLACE</th><th>UNLOADING PLACE</th><th>DESTINATION</th><th>CUSTOMER</th><th>DRIVER</th><th>VEHICLE</th><th>CREATED</th><th>LOADING DATE</th><th>UNLOADING DATE</th><th>UPDATED</th><th>STATUS</th><th>ACTIONS</th></tr></thead><tbody>{shipments.map(shipment=><tr key={shipment._id}><td><span className="reference-cell"><span className="table-icon"><Package size={15}/></span><strong>{shipment.reference}</strong></span></td><td>{shipment.loadingPlace || '—'}</td><td>{shipment.unloadingPlace || '—'}</td><td>{shipment.destination || '—'}</td><td>{shipment.customerName || '—'}</td><td>{shipment.driver?.name || 'Not assigned'}</td><td>{shipment.vehicle?.name || 'Not assigned'}</td><td>{formatDate(shipment.createdAt)}</td><td>{formatDate(shipment.loadingDate)}</td><td>{formatDate(shipment.unloadingDate)}</td><td>{formatDate(shipment.updatedAt)}</td><td><div className="status-edit-cell"><select className={`status-select badge badge-${shipment.status}`} value={shipment.status} disabled={savingId===shipment._id} onChange={event=>changeStatus(shipment,event.target.value)} aria-label={`Update status for ${shipment.reference}`}>{statuses.map(status=><option key={status} value={status}>{status.replace('_',' ')}</option>)}</select>{rowErrors[shipment._id]&&<small className="status-error">{rowErrors[shipment._id]}</small>}</div></td><td><div className="row-actions"><button className="row-action" onClick={()=>onEdit(shipment)} aria-label={`Edit ${shipment.reference}`} title="Edit shipment"><Pencil size={15}/></button><button className="row-action" onClick={()=>onSelect(shipment)} aria-label={`View ${shipment.reference}`} title="View shipment"><Eye size={16}/></button></div></td></tr>)}</tbody></table></div> : <EmptyState title="No shipments found" detail="Create your first shipment to start tracking deliveries."/>
}
