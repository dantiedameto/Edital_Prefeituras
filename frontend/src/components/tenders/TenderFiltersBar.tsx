import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { CATEGORY_LABELS, STATUS_LABELS } from '../../types';

interface TenderFiltersBarProps {
  defaultValues: {
    keyword?: string;
    city?: string;
    state?: string;
    category?: string;
    status?: string;
  };
}

export function TenderFiltersBar({ defaultValues }: TenderFiltersBarProps) {
  return (
    <form action="/editais" method="get" className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
      <div className="sm:col-span-2 lg:col-span-2">
        <Input name="keyword" placeholder="Buscar por palavra-chave..." defaultValue={defaultValues.keyword} />
      </div>
      <Input name="city" placeholder="Cidade" defaultValue={defaultValues.city} />
      <Input name="state" placeholder="Estado (UF)" defaultValue={defaultValues.state} maxLength={2} />
      <Select name="category" defaultValue={defaultValues.category ?? ''}>
        <option value="">Categoria</option>
        {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>
      <Select name="status" defaultValue={defaultValues.status ?? ''}>
        <option value="">Status</option>
        {Object.entries(STATUS_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>
      <div className="lg:col-span-6">
        <Button type="submit" size="sm">
          Filtrar
        </Button>
      </div>
    </form>
  );
}
