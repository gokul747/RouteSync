export function Loading({ label = 'Loading data…' }) { return <div className="state-message"><span className="spinner" />{label}</div> }
export function ErrorMessage({ message = 'Something went wrong.' }) { return <div className="state-message error-state">{message}</div> }
export function EmptyState({ title, detail }) { return <div className="empty-state"><strong>{title}</strong><span>{detail}</span></div> }
