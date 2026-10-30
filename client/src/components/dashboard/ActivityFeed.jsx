import { ArrowUpRight, PackageCheck } from 'lucide-react'
import { formatDate } from '../../utils/labels'
import StatusBadge from '../ui/StatusBadge'
import { EmptyState } from '../ui/StateMessages'
export default function ActivityFeed({ shipments = [] }) { const recent = [...shipments].sort((a,b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)).slice(0,5); return <div className="activity-list">{recent.length ? recent.map(s => <div className="activity-item" key={s._id}><span className="activity-icon"><PackageCheck size={16}/></span><div className="activity-copy"><strong>{s.reference || 'Shipment'} <StatusBadge status={s.status}/></strong><span>{s.destination || 'Destination pending'} · {formatDate(s.updatedAt || s.createdAt)}</span></div><ArrowUpRight size={15} className="muted"/></div>) : <EmptyState title="No activity yet" detail="Updates will appear here as shipments move."/>}</div> }
