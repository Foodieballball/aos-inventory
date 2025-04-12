import React, { useState, useEffect } from 'react';

interface InventoryRecord {
  date: string;
  itemName: string;
  quantity: number;
  location: string;
  notes: string;
}

export default function Home() {
  const [records, setRecords] = useState<InventoryRecord[]>([]);
  const [formData, setFormData] = useState<InventoryRecord>({
    date: new Date().toISOString().split('T')[0],
    itemName: '',
    quantity: 0,
    location: '',
    notes: ''
  });

  useEffect(() => {
    const savedRecords = localStorage.getItem('inventoryRecords');
    if (savedRecords) {
      setRecords(JSON.parse(savedRecords));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecords = [...records, formData];
    setRecords(newRecords);
    localStorage.setItem('inventoryRecords', JSON.stringify(newRecords));
    
    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      itemName: '',
      quantity: 0,
      location: '',
      notes: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">庫存管理系統</h1>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow-md mb-8">
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">日期</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">物品名稱</label>
              <input
                type="text"
                value={formData.itemName}
                onChange={(e) => setFormData({...formData, itemName: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">數量</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: Number(e.target.value)})}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">位置</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">備註</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full p-2 border rounded"
                rows={3}
              />
            </div>
            
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              提交
            </button>
          </div>
        </form>
        
        {/* Records Table */}
        <div className="bg-white rounded-lg p-6 shadow-md overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4">記錄列表</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">日期</th>
                <th className="text-left p-2">物品名稱</th>
                <th className="text-left p-2">數量</th>
                <th className="text-left p-2">位置</th>
                <th className="text-left p-2">備註</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">{record.date}</td>
                  <td className="p-2">{record.itemName}</td>
                  <td className="p-2">{record.quantity}</td>
                  <td className="p-2">{record.location}</td>
                  <td className="p-2">{record.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
