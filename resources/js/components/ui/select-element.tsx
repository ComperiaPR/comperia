import { memo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DataProps {
    id: string | number
    name: string
}

interface SelectElementProps {
    data: DataProps[];
    valueSelected: string;
    className: string;
    onChangeEvent: (value: string) => void;
}

function SelectElement({ data, valueSelected, onChangeEvent, className }: SelectElementProps) {
    return (
        <Select value={valueSelected} onValueChange={onChangeEvent} required>
            <SelectTrigger className={`border-slate-200 bg-white ${className}`}>
                <SelectValue placeholder="Seleccione" />
            </SelectTrigger>
            <SelectContent>
                {data.map((item: DataProps) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                        {item.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

export default memo(SelectElement);
