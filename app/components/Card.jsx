'use client';

export function Card({ children, className = '', hover = false }) {
  const baseClasses = 'bg-white rounded-lg shadow-md border border-gray-100 p-6';
  const hoverClasses = hover ? 'hover:shadow-lg transition-shadow cursor-pointer' : '';
  
  return (
    <div className={`${baseClasses} ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-200">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function CardContent({ children }) {
  return <div className="text-gray-700">{children}</div>;
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`flex gap-3 pt-4 border-t border-gray-200 ${className}`}>
      {children}
    </div>
  );
}
