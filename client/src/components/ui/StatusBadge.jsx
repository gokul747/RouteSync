import { statusLabel } from '../../utils/labels'
export default function StatusBadge({ status }) { const value = (status || 'unknown').toLowerCase().replaceAll(' ', '_'); return <span className={`badge badge-${value}`}>{statusLabel(status)}</span> }
