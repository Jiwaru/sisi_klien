import React from "react";
import { Loader2 } from "lucide-react";

const Table = ({ children }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">{children}</table>
      </div>
    </div>
  );
};

Table.Header = ({ children }) => (
  <thead className="bg-gray-50 border-b border-gray-100">
    <tr>{children}</tr>
  </thead>
);

Table.Body = ({
  children,
  isLoading,
  isEmpty,
  emptyMessage = "Tidak ada data.",
}) => {
  if (isLoading) {
    return (
      <tbody>
        <tr>
          <td colSpan="100%" className="p-12 text-center text-indigo-500">
            <div className="flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          </td>
        </tr>
      </tbody>
    );
  }

  if (isEmpty) {
    return (
      <tbody>
        <tr>
          <td colSpan="100%" className="px-6 py-12 text-center text-gray-400">
            {emptyMessage}
          </td>
        </tr>
      </tbody>
    );
  }

  return <tbody className="divide-y divide-gray-50">{children}</tbody>;
};

Table.HeadCell = ({ children, className = "" }) => (
  <th className={`px-6 py-4 text-sm font-semibold text-gray-600 ${className}`}>
    {children}
  </th>
);

Table.Row = ({ children, className = "" }) => (
  <tr className={`hover:bg-gray-50/80 transition-colors group ${className}`}>
    {children}
  </tr>
);

Table.Cell = ({ children, className = "" }) => (
  <td className={`px-6 py-4 ${className}`}>{children}</td>
);

export default Table;
