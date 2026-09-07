import {
  BadgeCheck,
  BarChart,
  Building2,
  ClipboardCheck,
  LayoutTemplate,
  MonitorSmartphone,
  Rocket,
  SearchCheck,
  ShoppingCart,
  TrendingUp,
  Wrench,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  badgeCheck: BadgeCheck,
  barChart: BarChart,
  building2: Building2,
  clipboardCheck: ClipboardCheck,
  layoutTemplate: LayoutTemplate,
  monitorSmartphone: MonitorSmartphone,
  rocket: Rocket,
  searchCheck: SearchCheck,
  shoppingCart: ShoppingCart,
  trendingUp: TrendingUp,
  wrench: Wrench,
};

export function DataIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = icons[name];
  if (!Icon) return null;
  return <Icon className={className} aria-hidden="true" />;
}