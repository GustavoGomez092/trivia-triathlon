import { cn } from '@/lib/utils';
import { ReactNode } from '@tanstack/react-router';
import { FC } from 'react';

interface TableProps {
  className?: string;
  children?: ReactNode;
}

const Table: FC<TableProps> = ({ className, children }) => {
  return (
    <div className={cn('nes-table-responsive nes-scrollbar', className)}>
      <table className="nes-table is-bordered is-centered">{children}</table>
    </div>
  );
};

export { Table };
