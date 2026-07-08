const fs = require('fs');
const path = require('path');

const missing = [
  'cities', 'floors', 'bookings', 'payments', 'rent', 
  'approvals', 'complaints', 'announcements', 'feed', 
  'visitors', 'vehicles', 'facilities', 'emails', 
  'notifications', 'reports', 'analytics', 'ai', 'settings'
];

const basePath = path.join(process.cwd(), 'src', 'app', 'admin');

missing.forEach(folder => {
  const folderPath = path.join(basePath, folder);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
  
  const title = folder.charAt(0).toUpperCase() + folder.slice(1);
  
  const content = `"use client";

import { Building2 } from "lucide-react";

export default function Admin${title}() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-900">${title}</h1>
          <p className="text-sm text-slate-500 mt-1">Manage ${folder} in the system</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-12 text-center">
        <div className="inline-flex h-16 w-16 bg-indigo-50 text-indigo-600 rounded-full items-center justify-center mb-4">
          <Building2 className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">${title} Module</h3>
        <p className="text-slate-500 max-w-md mx-auto">
          This is a placeholder page for the ${title} module. Development is in progress.
        </p>
      </div>
    </div>
  );
}
`;
  
  fs.writeFileSync(path.join(folderPath, 'page.tsx'), content);
});

console.log('Created placeholder pages.');
