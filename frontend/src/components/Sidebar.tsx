import { 
  LayoutDashboard, Package, Users, Lock, PencilRuler, FileText, 
  Settings, Percent, Truck, ShoppingCart, LogOut 
} from "lucide-react";
import Image from "next/image";

export default function Sidebar() {
  return (
    <aside className="h-screen w-64 bg-white shadow-lg flex flex-col justify-between p-5">
      {/* Logo */}
      <div className="flex items-center gap-2 px-3">
        <span className="text-indigo-600 font-bold text-2xl">square</span>
      </div>

      {/* Menu List */}
      <nav className="flex-1 mt-6">
        <p className="text-gray-400 text-sm mb-2 px-3">Menu</p>
        <ul className="space-y-1">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" badge={4} />
          <SidebarItem icon={Package} label="Stock" />
          <SidebarItem icon={Users} label="Customer" active />
          <SidebarItem icon={Lock} label="Restaurant" />
          <SidebarItem icon={PencilRuler} label="Design" />
          <SidebarItem icon={FileText} label="Report" />
          <SidebarItem icon={Settings} label="Role & Admin" />
          <SidebarItem icon={Percent} label="Settings" />
        </ul>

        <p className="text-gray-400 text-sm mt-6 mb-2 px-3">Integration</p>
        <ul className="space-y-1">
          <SidebarItem icon={ShoppingCart} label="Stock" />
          <SidebarItem icon={Truck} label="Supply" />
        </ul>
      </nav>

      {/* Profile Section */}
      <div className="border-t pt-4">
        <div className="flex items-center gap-3 px-3">
          <Image 
            src="/profile.jpg" 
            alt="Profile" 
            width={40} 
            height={40} 
            className="rounded-full"
          />
          <div>
            <p className="text-sm font-medium">Savannah N</p>
            <p className="text-xs text-gray-400">Food Quality Manager</p>
          </div>
        </div>
        
        {/* Logout Button */}
        <button className="mt-4 w-full flex items-center gap-2 bg-red-100 text-red-600 py-2 px-4 rounded-lg">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}

// Component untuk item sidebar
interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  badge?: number;
}

function SidebarItem({ icon: Icon, label, active, badge }: SidebarItemProps) {
  return (
    <li className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition ${
      active ? "bg-indigo-100 text-indigo-600 font-semibold" : "text-gray-600 hover:bg-gray-100"
    }`}>
      <Icon size={20} />
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </li>
  );
}
