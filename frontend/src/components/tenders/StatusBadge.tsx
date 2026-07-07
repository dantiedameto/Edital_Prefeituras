import { Badge } from '../ui/Badge';
import { STATUS_LABELS, TenderStatus } from '../../types';

const TONE_BY_STATUS: Record<TenderStatus, 'good' | 'neutral' | 'warning'> = {
  OPEN: 'good',
  CLOSED: 'neutral',
  IN_REVIEW: 'warning',
};

export function StatusBadge({ status }: { status: TenderStatus }) {
  return <Badge tone={TONE_BY_STATUS[status]}>{STATUS_LABELS[status]}</Badge>;
}
