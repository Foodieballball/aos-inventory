import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, ChevronUp, Clock, Plus, Check } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

const inventoryCategories = {
  "熟食項目": [
    "魚肉燒賣（包）",
    "豬肉燒賣（包）"
  ],
  "燒賣配料": [
    "大樽少少辣（樽）",
    "大樽正常辣（樽）",
    "大樽好撚辣（樽）",
    "大桶醬油（桶）",
    "芫茜（盒）"
  ],
  "飲品": [
    "朱古力粉（盒）",
    "維他奶（枝）",
    "維他蒸餾水 700ml（枝）"
  ],
  "櫻花蝦辣椒油": [
    { name: "小小辣", id: "櫻花蝦_小小辣" },
    { name: "正常辣", id: "櫻花蝦_正常辣" },
    { name: "好撚辣", id: "櫻花蝦_好撚辣" }
  ],
  "蒜香果仁辣椒油": [
    { name: "小小辣", id: "蒜香果仁_小小辣" },
    { name: "正常辣", id: "蒜香果仁_正常辣" },
    { name: "好撚辣", id: "蒜香果仁_好撚辣" }
  ],
  "臘腸肉燥辣椒油": [
    { name: "小小辣", id: "臘腸肉燥_小小辣" },
    { name: "正常辣", id: "臘腸肉燥_正常辣" },
    { name: "好撚辣", id: "臘腸肉燥_好撚辣" }
  ],
  "醬油": [
    "焦糖醬油貨裝"
  ],
  "外賣用品": [
    "碗（條）",
    "杯（條）",
    "竹簽"
  ],
  "清潔用品": [
    "抹手紙",
    "濕紙巾",
    "洗潔精",
    "垃圾袋"
  ]
};

export default function InventorySystem() {
  const [currentView, setCurrentView] = useState('form');
  const [date, setDate] = useState('');
  const [openCategories, setOpenCategories] = useState({});
  const [inventoryHistory, setInventoryHistory] = useState([]);
  const [formValues, setFormValues] = useState({});

  useEffect(() => {
    const savedHistory = localStorage.getItem('inventoryHistory');
    if (savedHistory) {
      setInventoryHistory(JSON.parse(savedHistory));
    }
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
  }, []);

  const toggleCategory = (category, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleInputChange = (itemId, value, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    requestAnimationFrame(() => {
      setFormValues(prev => ({
        ...prev,
        [itemId]: value
      }));
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const newInventory = {
      date: date,
      items: { ...formValues }
    };

    setInventoryHistory(prev => [newInventory, ...prev]);
    localStorage.setItem('inventoryHistory', JSON.stringify([newInventory, ...inventoryHistory]));
    
    toast({
      title: "成功",
      description: "庫存已成功提交！",
      duration: 3000,
    });

    requestAnimationFrame(() => {
      setFormValues({});
      setDate(new Date().toISOString().split('T')[0]);
    });
  };

  const renderInput = (category, item) => {
    const isChiliOil = ["櫻花蝦辣椒油", "蒜香果仁辣椒油", "臘腸肉燥辣椒油"].includes(category);
    const isStatusSelect = (category === "清潔用品" || (category === "外賣用品" && item === "竹簽"));
    
    const itemId = isChiliOil ? item.id : item;
    const displayName = isChiliOil ? `${category} ${item.name}` : item;

    return (
      <div key={itemId} className="space-y-2">
        <Label htmlFor={itemId}>{displayName}</Label>
        {isStatusSelect ? (
          <Select
            value={formValues[itemId] || ''}
            onValueChange={(value) => handleInputChange(itemId, value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="選擇狀態" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="充足">充足</SelectItem>
              <SelectItem value="少量">少量</SelectItem>
              <SelectItem value="極少">極少</SelectItem>
              <SelectItem value="缺貨">缺貨</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <Input
            type="number"
            id={itemId}
            placeholder="輸入數量"
            min="0"
            value={formValues[itemId] || ''}
            onChange={(e) => handleInputChange(itemId, e.target.value, e)}
            className="w-full"
            onFocus={(e) => {
              e.preventDefault();
              e.target.addEventListener('wheel', e => e.preventDefault());
            }}
            onClick={(e) => {
              e.preventDefault();
              e.target.select();
            }}
          />
        )}
      </div>
    );
  };

  const InventoryForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="date">日期</Label>
        <Input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div className="space-y-4">
        {Object.entries(inventoryCategories).map(([category, items]) => (
          <Card key={category}>
            <button
              type="button"
              onClick={(e) => toggleCategory(category, e)}
              className="w-full p-4 flex justify-between items-center text-left font-semibold"
            >
              {category}
              {openCategories[category] ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
            
            {openCategories[category] && (
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {Array.isArray(items) && items.map(item => renderInput(category, item))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
      
      <Button type="submit" className="w-full">
        提交庫存
      </Button>
    </form>
  );

  const HistoryView = () => (
    <div className="space-y-4">
      {inventoryHistory.map((record, index) => (
        <Card key={index}>
          <CardContent className="pt-6">
            <div className="font-semibold mb-4">{record.date}</div>
            <div className="space-y-2">
              {Object.entries(record.items).map(([itemId, quantity]) => {
                let displayName = itemId;
                if (itemId.includes('_')) {
                  const [category, type] = itemId.split('_');
                  displayName = `${category} ${type}`;
                }
                return (
                  <div key={itemId} className="flex justify-between text-sm">
                    <span>{displayName}</span>
                    <span>{quantity}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">AOS 庫存管理</h1>
            <div className="flex gap-2">
              <Button 
                variant={currentView === 'form' ? "default" : "outline"}
                size="icon"
                onClick={() => setCurrentView('form')}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button 
                variant={currentView === 'history' ? "default" : "outline"}
                size="icon"
                onClick={() => setCurrentView('history')}
              >
                <Clock className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {currentView === 'form' ? <InventoryForm /> : <HistoryView />}
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}
