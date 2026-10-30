import { useEffect, useState } from 'react'
import { MapPin, Package, Pencil, Save, UserRound, Weight, X } from 'lucide-react'
import StatusBadge from '../ui/StatusBadge'
import FormField from '../ui/FormField'
import { formatDate, formatDateTimeLocal } from '../../utils/labels'
import { getShipmentEvents, updateShipment } from '../../services/shipmentService'
import './shipment-drawer.css'

const initialForm = { destination: '', loadingPlace: '', unloadingPlace: '', customerName: '', customerEmail: '', weight: '', loadingDate: '', unloadingDate: '', priority: 'standard', status: 'pending' }

export default function ShipmentDrawer({ shipment, onClose, onSaved, startEditing = false }) {
  const [editing, setEditing] = useState(startEditing)
  const [form, setForm] = useState(initialForm)
  const [busy, setBusy] = useState(false)
  const [statusBusy, setStatusBusy] = useState(false)
  const [error, setError] = useState('')
  const [events, setEvents] = useState([])
  const [eventsLoading, setEventsLoading] = useState(false)
  const [eventsError, setEventsError] = useState('')
  const [timelineVersion, setTimelineVersion] = useState(0)

  useEffect(() => {
    if (!shipment) return
    setForm({
      destination: shipment.destination || '',
      loadingPlace: shipment.loadingPlace || '',
      unloadingPlace: shipment.unloadingPlace || '',
      customerName: shipment.customerName || '',
      customerEmail: shipment.customerEmail || '',
      weight: shipment.weight ?? '',
      loadingDate: formatDateTimeLocal(shipment.loadingDate),
      unloadingDate: formatDateTimeLocal(shipment.unloadingDate),
      priority: shipment.priority || 'standard',
      status: shipment.status || 'pending',
    })
    setEditing(startEditing)
    setError('')
  }, [shipment?._id, startEditing])

  useEffect(() => {
    if (!shipment?._id) return
    let active = true
    setEventsLoading(true)
    setEventsError('')
    getShipmentEvents(shipment._id)
      .then(result => { if (active) setEvents(result) })
      .catch(err => { if (active) setEventsError(err.response?.data?.message || 'Could not load shipment history.') })
      .finally(() => { if (active) setEventsLoading(false) })
    return () => { active = false }
  }, [shipment?._id, timelineVersion])

  if (!shipment) return null

  function change(event) {
    setForm(current => ({ ...current, [event.target.name]: event.target.value }))
  }

  async function save(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const updated = await updateShipment(shipment._id, { ...form, weight: Number(form.weight), loadingDate: form.loadingDate || null, unloadingDate: form.unloadingDate || null })
      onSaved?.(updated)
      setTimelineVersion(version => version + 1)
      setEditing(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save shipment changes.')
    } finally {
      setBusy(false)
    }
  }

  async function changeStatus(event) {
    const nextStatus = event.target.value
    setStatusBusy(true)
    setError('')
    try {
      const updated = await updateShipment(shipment._id, { status: nextStatus })
      onSaved?.(updated)
      setTimelineVersion(version => version + 1)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update shipment status.')
    } finally {
      setStatusBusy(false)
    }
  }

  return <div className="drawer-backdrop" onMouseDown={event => event.target === event.currentTarget && onClose()}>
    <aside className="drawer">
      <header>
        <div><span className="eyebrow">SHIPMENT DETAILS</span><h2>{shipment.reference}</h2></div>
        <button className="icon-button" onClick={onClose} aria-label="Close"><X size={18}/></button>
      </header>
      {editing ? <form className="form-grid drawer-edit-form" onSubmit={save}>
        <FormField label="Destination" name="destination" value={form.destination} onChange={change} required />
        <FormField label="Loading place" name="loadingPlace" value={form.loadingPlace} onChange={change} placeholder="Pickup address or location" />
        <FormField label="Unloading place" name="unloadingPlace" value={form.unloadingPlace} onChange={change} placeholder="Drop-off address or location" />
        <FormField label="Customer name" name="customerName" value={form.customerName} onChange={change} required />
        <FormField label="Customer email" name="customerEmail" type="email" value={form.customerEmail} onChange={change} />
        <FormField label="Weight (kg)" name="weight" type="number" min="0" value={form.weight} onChange={change} required />
        <FormField label="Loading date" name="loadingDate" type="datetime-local" value={form.loadingDate} onChange={change} />
        <FormField label="Unloading date" name="unloadingDate" type="datetime-local" value={form.unloadingDate} onChange={change} />
        <label className="form-field"><span>Priority</span><select name="priority" value={form.priority} onChange={change}><option value="standard">Standard</option><option value="express">Express</option></select></label>
        <label className="form-field"><span>Status</span><select name="status" value={form.status} onChange={change}><option value="pending">Pending</option><option value="assigned">Assigned</option><option value="in_transit">In transit</option><option value="delivered">Delivered</option><option value="delayed">Delayed</option></select></label>
        {error && <p className="form-error">{error}</p>}
        <div className="form-actions"><button type="button" className="button button-quiet" onClick={() => { setEditing(false); setError('') }}>Cancel</button><button className="button button-primary" disabled={busy}><Save size={15}/>{busy ? 'Saving…' : 'Save changes'}</button></div>
      </form> : <>
        <StatusBadge status={shipment.status}/>
        <label className="form-field drawer-status-field"><span>Update status {statusBusy ? '· Saving…' : ''}</span><select value={shipment.status} onChange={changeStatus} disabled={statusBusy}><option value="pending">Pending</option><option value="assigned">Assigned</option><option value="in_transit">In transit</option><option value="delivered">Delivered</option><option value="delayed">Delayed</option></select></label>
        {error && <p className="form-error drawer-status-error">{error}</p>}
        <div className="drawer-section">
          <h3>Delivery information</h3>
          <p><MapPin size={16}/><span><small>Destination</small>{shipment.destination || '—'}</span></p>
          <p><MapPin size={16}/><span><small>Loading place</small>{shipment.loadingPlace || 'Not specified'}</span></p>
          <p><MapPin size={16}/><span><small>Unloading place</small>{shipment.unloadingPlace || 'Not specified'}</span></p>
          <p><UserRound size={16}/><span><small>Customer</small>{shipment.customerName || '—'}</span></p>
          <p><UserRound size={16}/><span><small>Assigned driver</small>{shipment.driver?.name || 'Not assigned'}</span></p>
          <p><Package size={16}/><span><small>Assigned vehicle</small>{shipment.vehicle?.name ? `${shipment.vehicle.name} · ${shipment.vehicle.registrationNumber}` : 'Not assigned'}</span></p>
          <p><Weight size={16}/><span><small>Weight</small>{shipment.weight || 0} kg</span></p>
          <p><Package size={16}/><span><small>Loading date</small>{shipment.loadingDate ? new Date(shipment.loadingDate).toLocaleString() : 'Not scheduled'}</span></p>
          <p><Package size={16}/><span><small>Unloading date</small>{shipment.unloadingDate ? new Date(shipment.unloadingDate).toLocaleString() : 'Not scheduled'}</span></p>
          <p><Package size={16}/><span><small>Created</small>{formatDate(shipment.createdAt)}</span></p>
          <p><Package size={16}/><span><small>Last updated</small>{shipment.updatedAt ? new Date(shipment.updatedAt).toLocaleString() : '—'}</span></p>
        </div>
        <div className="drawer-section tracking-section">
          <h3>Tracking history</h3>
          {eventsLoading ? <p className="tracking-message">Loading shipment history…</p> : eventsError ? <p className="tracking-message tracking-error">{eventsError}</p> : events.length ? <div className="tracking-timeline">{events.map(event => <div className="tracking-event" key={event._id}><span className="tracking-dot"/><div><strong>{event.status.replaceAll('_', ' ')}</strong><span>{event.note || 'Status updated'}</span><small>{new Date(event.createdAt).toLocaleString()}</small></div></div>)}</div> : <p className="tracking-message">No tracking updates yet.</p>}
        </div>
        <button className="button button-primary drawer-edit-button" onClick={() => setEditing(true)}><Pencil size={15}/> Edit shipment</button>
      </>}
    </aside>
  </div>
}
