import * as React from 'react';

import { cn } from '@/lib/utils';

interface ITableHeaders {
  title: string;
  key: string;
}

interface TableProps<T = Record<string, any>> {
  className?: string;
  tableHeaders?: readonly ITableHeaders[];
  tableData?: T[];
}

const Table: React.FC<TableProps> = ({
  className,
  tableHeaders,
  tableData,
}) => {
  return (
    <div className={cn('nes-table-responsive nes-scrollbar', className)}>
      <table className="nes-table is-bordered is-centered">
        <thead>
          <tr>
            {tableHeaders?.map(({ key, title }) => <th key={key}>{title}</th>)}
          </tr>
        </thead>
        <tbody>
          {tableData?.map((data, index) => (
            <tr key={index}>
              {tableHeaders?.map(({ key: property }) => (
                <td className="whitespace-nowrap" key={`${property}-${index}`}>
                  {data?.[property as keyof typeof data]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { Table };
