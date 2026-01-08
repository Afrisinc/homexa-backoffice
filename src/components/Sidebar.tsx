import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  ChevronDown,
  Tags,
  MessageSquare,
  BarChart3,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  {
    id: 'overview',
    label: 'Dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
    href: '/dashboard',
  },
  {
    id: 'management',
    label: 'Management',
    icon: <Package className="h-5 w-5" />,
    children: [
      { id: 'users', label: 'Users', href: '/dashboard/users', icon: <Users className="h-4 w-4" /> },
      {
        id: 'products',
        label: 'Products',
        href: '/dashboard/products',
        icon: <Package className="h-4 w-4" />,
      },
      {
        id: 'categories',
        label: 'Categories',
        href: '/dashboard/categories',
        icon: <Tags className="h-4 w-4" />,
      },
    ],
  },
  {
    id: 'support',
    label: 'Support',
    icon: <MessageSquare className="h-5 w-5" />,
    href: '/dashboard/support',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: <BarChart3 className="h-5 w-5" />,
    href: '/dashboard/analytics',
  },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar = ({ isOpen = true, onClose }: SidebarProps) => {
  const [expandedItems, setExpandedItems] = useState<string[]>(['management']);
  const location = useLocation();

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const NavItemComponent = ({ item, isNested = false }: { item: NavItem; isNested?: boolean }) => {
    const hasChildren = item.children && item.children.length > 0;
    const active = isActive(item.href);
    const expanded = expandedItems.includes(item.id);

    if (hasChildren) {
      return (
        <div key={item.id}>
          <button
            onClick={() => toggleExpanded(item.id)}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-colors ${
              active
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <span className="font-medium text-sm">{item.label}</span>
            </div>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            />
          </button>

          {expanded && (
            <div className="mt-1 space-y-1 pl-6">
              {item.children?.map((child) => (
                <NavItemComponent key={child.id} item={child} isNested={true} />
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.id}
        to={item.href || '#'}
        onClick={onClose}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
          active
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
        } ${isNested ? 'text-sm' : ''}`}
      >
        {item.icon}
        <span className="font-medium">{item.label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 lg:hidden z-20" onClick={onClose} />}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-card border-r border-border transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo area */}
          <div className="hidden lg:block p-6 border-b border-border">
            <h2 className="text-xl font-serif font-bold text-foreground">Homexa</h2>
            <p className="text-xs text-muted-foreground">Backoffice</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {navItems.map((item) => (
              <NavItemComponent key={item.id} item={item} />
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border space-y-2">
            <button className="w-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors text-left">
              Settings
            </button>
            <button className="w-full px-4 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors text-left">
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
