import { useEffect, useState } from 'react'
import { ArrowDownWideNarrow, Plus, Search } from 'lucide-react'
import api from '../services/api'
import ShipmentFormModal from '../components/shipments/ShipmentFormModal'
import ShipmentDrawer from '../components/shipments/ShipmentDrawer'
import ShipmentsList from '../components/shipments/ShipmentsList'
import { Loading, ErrorMessage } from '../components/ui/StateMessages'

export default function Shipments() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [modal, setModal] = useState(false)
  const [selected, setSelected] = useState(null)
  const [editSelected, setEditSelected] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const result = await api.get('/shipments')
      setItems(result.data)
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load shipments.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = items.filter(shipment =>
    (status === 'all' || shipment.status === status) &&
    `${shipment.reference} ${shipment.destination} ${shipment.customerName}`.toLowerCase().includes(query.toLowerCase())
  )

  return <>
    <div className="welcome-row page-title-row">
      <div><div className="eyebrow">OPERATIONS</div><h1>Shipments <span className="title-count">{items.length}</span></h1><p>Track deliveries and keep every order moving.</p></div>
      <button className="button button-primary" onClick={() => setModal(true)}><Plus size={17}/> New shipment</button>
    </div>
    <div className="filterbar">
      <div className="search-box"><Search size={17}/><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search reference, destination, customer…"/></div>
      <label className="select-filter"><ArrowDownWideNarrow size={15}/><select value={status} onChange={event => setStatus(event.target.value)}><option value="all">All statuses</option>{['pending','assigned','in_transit','delivered','delayed'].map(value => <option key={value} value={value}>{value.replace('_',' ')}</option>)}</select></label>
      <span className="result-count">{filtered.length} shipments</span>
    </div>
    <section className="panel table-panel">{loading ? <Loading/> : error ? <ErrorMessage message={error}/> : <ShipmentsList shipments={filtered} onSelect={shipment => { setSelected(shipment); setEditSelected(false) }} onEdit={shipment => { setSelected(shipment); setEditSelected(true) }} onUpdated={updated => { setItems(current => current.map(item => item._id === updated._id ? updated : item)); setSelected(current => current?._id === updated._id ? updated : current) }}/>}</section>
    {modal && <ShipmentFormModal onClose={() => setModal(false)} onSaved={() => { setModal(false); load() }}/>}
    <ShipmentDrawer shipment={selected} startEditing={editSelected} onClose={() => setSelected(null)} onSaved={updated => { setItems(current => current.map(item => item._id === updated._id ? updated : item)); setSelected(updated) }}/>
  </>
}
