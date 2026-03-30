'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Microscope,
  Clock,
  Leaf,
  Pill,
  User,
} from 'lucide-react';
import { useI18n } from '@/app/hooks/useI18n';

export function BottomNav() {
  const pathname = usePathname();
  const { isRTL } = useI18n();

  const navItems = [
    { href: '/dashboard', icon: Home, label: 'Accueil' },
    { href: '/detection', icon: Microscope, label: 'Détecter' },
    { href: '/history', icon: Clock, label: 'Historique' },
    { href: '/plants', icon: Leaf, label: 'Plantes' },
    { href: '/profile', icon: User, label: 'Profil' },
  ];

  return (
    <nav className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-40 ${
      isRTL ? 'rtl' : 'ltr'
    }`}>
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
                isActive
                  ? 'text-primary-500 border-t-2 border-primary-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={24} />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
