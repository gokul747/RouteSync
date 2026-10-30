import { useState } from 'react'
import Modal from '../ui/Modal'
import FormField from '../ui/FormField'
import { createShipment } from '../../services/shipmentService'

const initialForm = { destination: '', loadingPlace: '', unloadingPlace: '', customerName: '', customerEmail: '', weight: '', loadingDate: '', unloadingDate: '', priority: 'standard' }

export default function ShipmentFormModal({ onClose, onSaved }) {
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  function change(event) { setForm(current => ({ ...current, [event.target.name]: event.target.value })) }
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError('')
    try { const created = await createShipment({ ...form, weight: Number(form.weight), loadingDate: form.loadingDate || null, unloadingDate: form.unloadingDate || null }); onSaved(created) }
    catch (err) { setError(err.response?.data?.message || 'Could not create shipment.') }
    finally { setBusy(false) }
  }
  return <Modal title="Create shipment" onClose={onClose}><form className="form-grid" onSubmit={submit}>
    <FormField label="Destination" name="destination" value={form.destination} onChange={change} placeholder="City, region" required/>
    <FormField label="Loading place" name="loadingPlace" value={form.loadingPlace} onChange={change} placeholder="Pickup address or location"/>
    <FormField label="Unloading place" name="unloadingPlace" value={form.unloadingPlace} onChange={change} placeholder="Drop-off address or location"/>
    <FormField label="Customer name" name="customerName" value={form.customerName} onChange={change} required/>
    <FormField label="Customer email" type="email" name="customerEmail" value={form.customerEmail} onChange={change}/>
    <FormField label="Weight (kg)" type="number" min="0" name="weight" value={form.weight} onChange={change} required/>
    <FormField label="Loading date" type="datetime-local" name="loadingDate" value={form.loadingDate} onChange={change}/>
    <FormField label="Unloading date" type="datetime-local" name="unloadingDate" value={form.unloadingDate} onChange={change}/>
    <label className="form-field"><span>Priority</span><select name="priority" value={form.priority} onChange={change}><option value="standard">Standard</option><option value="express">Express</option></select></label>
    {error && <p className="form-error">{error}</p>}
    <div className="form-actions"><button type="button" className="button button-quiet" onClick={onClose}>Cancel</button><button disabled={busy} className="button button-primary">{busy ? 'Creating…' : 'Create shipment'}</button></div>
  </form></Modal>
}
