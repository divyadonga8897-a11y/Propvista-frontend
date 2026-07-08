"use client";

import { useState } from "react";
import { FileBarChart, Download, Filter, Calendar, Building2, DollarSign, Users, TrendingUp } from "lucide-react";

export default function AdminReports() {
  const [selectedReport, setSelectedReport] = useState("occupancy");
  const [dateRange, setDateRange] = useState("This Month");

  const reports = [
    { id: "occupancy", label: "Occupancy Report", icon: Building2, color: "text-indigo-600 bg-indigo-50" },
    { id: "revenue", label: "Revenue Report", icon: DollarSign, color: "text-emerald-600 bg-emerald-50" },
    { id: "residents", label: "Residents Report", icon: Users, color: "text-blue-600 bg-blue-50" },
    { id: "maintenance", label: "Maintenance Report", icon: TrendingUp, color: "text-orange-600 bg-orange-50" },
  ];

  // Mock data for each report
  const reportData: Record<string, { headers: string[]; rows: string[][] }> = {
    occupancy: {
      headers: ["Community", "Total Flats", "Occupied", "Vacant", "Occupancy %"],
      rows: [
        ["PropVista Heights", "240", "198", "42", "82.5%"],
        ["Green Valley", "180", "145", "35", "80.6%"],
        ["Sunrise Residency", "120", "100", "20", "83.3%"],
      ],
    },
    revenue: {
      headers: ["Month", "Rent Collected", "Maintenance Dues", "Penalties", "Total Revenue"],
      rows: [
        ["July 2026", "₹32,40,000", "₹4,20,000", "₹85,000", "₹37,45,000"],
        ["June 2026", "₹31,80,000", "₹4,10,000", "₹62,000", "₹36,52,000"],
        ["May 2026", "₹30,95,000", "₹4,05,000", "₹78,000", "₹35,78,000"],
      ],
    },
    residents: {
      headers: ["Community", "Total Residents", "Owners", "Tenants", "New This Month"],
      rows: [
        ["PropVista Heights", "520", "310", "210", "12"],
        ["Green Valley", "380", "220", "160", "8"],
        ["Sunrise Residency", "260", "180", "80", "5"],
      ],
    },
    maintenance: {
      headers: ["Category", "Total Tickets", "Resolved", "Avg Resolution (Days)", "Satisfaction"],
      rows: [
        ["Plumbing", "45", "38", "2.1", "4.2 / 5"],
        ["Electrical", "32", "30", "1.5", "4.5 / 5"],
        ["Carpentry", "18", "15", "3.0", "3.8 / 5"],
        ["Housekeeping", "28", "26", "1.0", "4.6 / 5"],
      ],
    },
  };

  const currentReport = reports.find(r => r.id === selectedReport)!;
  const data = reportData[selectedReport];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Reports & Exports</h1>
          <p className="text-sm text-slate-500 mt-1">Generate and download detailed property management reports</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-colors">
          <Download className="h-4 w-4" /> Export as CSV
        </button>
      </div>

      {/* Report Type Selector */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report.id)}
              className={`rounded-2xl border p-5 text-left transition-all ${selectedReport === report.id
                ? "border-indigo-300 bg-indigo-50 ring-2 ring-indigo-200 shadow-sm"
                : "border-slate-200 bg-white hover:border-indigo-200 hover:bg-slate-50"
              }`}
            >
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center mb-3 ${report.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{report.label}</h3>
            </button>
          );
        })}
      </div>

      {/* Report Content */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <FileBarChart className="h-5 w-5 text-indigo-600" />
            <h2 className="font-bold text-slate-900">{currentReport.label}</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <Calendar className="h-4 w-4" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
              >
                <option>This Month</option>
                <option>Last Month</option>
                <option>Last 3 Months</option>
                <option>This Year</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5">
                <Download className="h-3.5 w-3.5" /> PDF
              </button>
              <button className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5">
                <Download className="h-3.5 w-3.5" /> Excel
              </button>
            </div>
          </div>
        </div>

        {/* Summary Bar */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-8 text-sm">
            <div>
              <span className="text-slate-500 font-medium">Report Period:</span>
              <span className="font-bold text-slate-900 ml-2">{dateRange}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Generated:</span>
              <span className="font-bold text-slate-900 ml-2">{new Date().toLocaleDateString()}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Rows:</span>
              <span className="font-bold text-slate-900 ml-2">{data.rows.length}</span>
            </div>
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {data.headers.map((header, i) => (
                <th key={i} className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className={`p-4 ${cellIndex === 0 ? "font-bold text-slate-900" : "font-semibold text-slate-700"}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-slate-50 border-t-2 border-slate-200">
              <td className="p-4 text-xs font-bold text-slate-500 uppercase">Totals</td>
              {data.headers.slice(1).map((_, i) => (
                <td key={i} className="p-4 text-sm font-black text-slate-900">—</td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
