'use client';

import { Input } from 'afena-ui/components/input';
import { Search } from 'lucide-react';

interface EntityToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  children?: React.ReactNode;
}

export function EntityToolbar({
  searchValue,
  onSearchChange,
  children,
}: EntityToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-2 py-4">
      <div className="relative max-w-sm flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
