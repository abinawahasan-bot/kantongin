import {
  BadgeCheck,
  BarChart,
  Building2,
  LayoutTemplate,
  MonitorSmartphone,
  Rocket,
  ShoppingCart,
  TrendingUp,
  Wrench,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  badgeCheck: BadgeCheck,
  barChart: BarChart,
  building2: Building2,
  layoutTemplate: LayoutTemplate,
  monitorSmartphone: MonitorSmartphone,
  rocket: Rocket,
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