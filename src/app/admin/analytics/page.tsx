"use client";

import { useState } from "react";
import { BarChart3, TrendingUp, TrendingDown, Users, Building2, DollarSign, Home, Activity, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function AdminAnalytics() {
  const [period, setPeriod] = useState("This Month");

  const kpis = [
    { label: "Total Revenue", value: "₹37,45,000", change: "+8.2%", up: true, icon: DollarSign, color: "text-emerald-600 bg-emerald-50" },
    { label: "Active Residents", value: "1,160", change: "+3.1%", up: true, icon: Users, color: "text-indigo-600 bg-indigo-50" },
    { label: "Occupancy Rate", value: "82.1%", change: "-1.2%", up: false, icon: Building2, color: "text-blue-600 bg-blue-50" },
    { label: "Maintenance SLA Met", value: "91%", change: "+5.0%", up: true, icon: Activity, color: "text-orange-600 bg-orange-50" },
  ];

  const revenueByMonth = [
    { month: "Jan", value: 28 },
    { month: "Feb", value: 30 },
    { month: "Mar", value: 31 },
    { month: "Apr", value: 29 },
    { month: "May", value: 35 },
    { month: "Jun", value: 36 },
    { month: "Jul", value: 37 },
  ];
  const maxRevenue = Math.max(...revenueByMonth.map(r => r.value));

  const occupancyByProperty = [
    { property: "PropVista Heights", occupancy: 82.5, total: 240, occupied: 198 },
    { property: "Green Valley", occupancy: 80.6, total: 180, occupied: 145 },
    { property: "Sunrise Residency", occupancy: 83.3, total: 120, occupied: 100 },
  ];

  const topIssues = [
    { category: "Plumbing", count: 45, trend: "up" },
    { category: "Electrical", count: 32, trend: "down" },
    { category: "Housekeeping", count: 28, trend: "up" },
    { category: "Carpentry", count: 18, trend: "down" },
    { category: "Elevator", count: 12, trend: "up" },
  ];

  const recentActivity = [
    { action: "New booking confirmed", detail: "Flat A-402, PropVista Heights", time: "2 mins ago" },
    { action: "Rent payment received", detail: "₹18,000 from Rahul Sharma", time: "15 mins ago" },
    { action: "Maintenance resolved", detail: "Ticket M-1002 (AC issue)", time: "1 hour ago" },
    { action: "New resident approved", detail: "Sneha Reddy, B-105", time: "3 hours ago" },
    { action: "Complaint logged", detail: "Parking dispute, Green Valley", time: "5 hours ago" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Analytics Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Key performance indicators and operational trends</p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:border-indigo-500 bg-white shadow-sm"
        >
          <option>This Week</option>
          <option>This Month</option>
          <option>Last 3 Months</option>
          <option>This Year</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${kpi.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold ${kpi.up ? "text-emerald-600" : "text-red-500"}`}>
                  {kpi.up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                  {kpi.change}
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">{kpi.value}</div>
              <div className="text-xs text-slate-500 font-medium mt-1">{kpi.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart (CSS-based bar chart) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-indigo-600" /> Monthly Revenue Trend (₹ Lakhs)
            </h3>
          </div>
          <div className="flex items-end gap-4 h-48">
            {revenueByMonth.map((item) => (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-bold text-slate-700">{item.value}L</span>
                <div
                  className="w-full bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t-lg transition-all duration-500 hover:from-indigo-600 hover:to-indigo-500"
                  style={{ height: `${(item.value / maxRevenue) * 100}%` }}
                />
                <span className="text-[10px] font-bold text-slate-500 uppercase">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-emerald-600" /> Live Activity Feed
          </h3>
          <div className="space-y-4">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="h-2 w-2 bg-indigo-500 rounded-full mt-2 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.action}</p>
                  <p className="text-xs text-slate-500">{item.detail}</p>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Occupancy by Property */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Home className="h-5 w-5 text-blue-600" /> Occupancy by Community
          </h3>
          <div className="space-y-5">
            {occupancyByProperty.map((prop) => (
              <div key={prop.property}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-slate-900">{prop.property}</span>
                  <span className="text-xs font-bold text-slate-600">{prop.occupied}/{prop.total} ({prop.occupancy}%)</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-700"
                    style={{ width: `${prop.occupancy}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Maintenance Categories */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange-600" /> Top Maintenance Categories
          </h3>
          <div className="space-y-4">
            {topIssues.map((issue, i) => (
              <div key={issue.category} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-xs font-black text-slate-500">
                    {i + 1}
                  </div>
                  <span className="text-sm font-bold text-slate-900">{issue.category}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-black text-slate-700">{issue.count} tickets</span>
                  {issue.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-red-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-emerald-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
