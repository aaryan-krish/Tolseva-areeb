import React from 'react';

interface TolSevaLogoProps {
  variant?: 'full' | 'horizontal' | 'icon-only' | 'badge';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  colorMode?: 'light' | 'dark';
  className?: string;
}

export const TolSevaLogo: React.FC<TolSevaLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  colorMode = 'light',
  className = '',
}) => {
  const isDark = colorMode === 'dark';
  const textColor = isDark ? '#FFFFFF' : '#0369A1';
  const subtitleColor = isDark ? '#7DD3FC' : '#0284C7';

  // Dimension presets
  const iconDimensions = {
    xs: { w: 28, h: 22 },
    sm: { w: 36, h: 28 },
    md: { w: 46, h: 36 },
    lg: { w: 68, h: 54 },
    xl: { w: 96, h: 76 },
  }[size];

  const renderIconSvg = () => (
    <svg 
      viewBox="130 35 260 190" 
      width={iconDimensions.w} 
      height={iconDimensions.h} 
      className="shrink-0 drop-shadow-xs"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Central T-Bar and Post (Saffron/Orange) */}
      <rect x="165" y="44" width="170" height="15" rx="7.5" fill="#F58220" />
      <rect x="242" y="44" width="16" height="92" rx="4" fill="#F58220" />

      {/* Left Pan Strings & Basin */}
      <polygon points="186,59 152,136 220,136" stroke="#F58220" strokeWidth="4.5" strokeLinejoin="round" fill="none" />
      <path d="M 148 136 Q 186 176 224 136 Z" fill="#F58220" />

      {/* Right Pan Strings & Basin */}
      <polygon points="314,59 280,136 348,136" stroke="#F58220" strokeWidth="4.5" strokeLinejoin="round" fill="none" />
      <path d="M 276 136 Q 314 176 352 136 Z" fill="#F58220" />

      {/* Ashoka Chakra (Attractive Light/Sky Blue) */}
      <g transform="translate(250, 188)">
        <circle cx="0" cy="0" r="38" fill={isDark ? '#082F49' : '#FFFFFF'} stroke={isDark ? '#38BDF8' : '#0284C7'} strokeWidth="4.5" />
        <circle cx="0" cy="0" r="34" fill="none" stroke={isDark ? '#38BDF8' : '#0EA5E9'} strokeWidth="1.2" />
        <circle cx="0" cy="0" r="6" fill={isDark ? '#38BDF8' : '#0284C7'} />
        {/* 24 Spokes */}
        <g stroke={isDark ? '#38BDF8' : '#0284C7'} strokeWidth="1.8" strokeLinecap="round">
          {[0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165].map((deg) => (
            <line 
              key={deg} 
              x1="0" 
              y1="-34" 
              x2="0" 
              y2="34" 
              transform={`rotate(${deg})`} 
            />
          ))}
        </g>
      </g>

      {/* Bold Green Checkmark Over Right Pan */}
      <path 
        d="M 284 140 L 318 180 L 376 96" 
        stroke="#16A34A" 
        strokeWidth="18" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        fill="none" 
      />
    </svg>
  );

  if (variant === 'icon-only') {
    return <div className={`inline-flex items-center justify-center ${className}`}>{renderIconSvg()}</div>;
  }

  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center text-center select-none ${className}`}>
        {renderIconSvg()}
        <div className="mt-1.5">
          <span 
            className="font-black tracking-widest block leading-none"
            style={{ 
              color: textColor, 
              fontSize: size === 'xs' ? '14px' : size === 'sm' ? '18px' : size === 'md' ? '24px' : size === 'lg' ? '32px' : '40px',
              letterSpacing: '0.12em'
            }}
          >
            TOLSEVA
          </span>
          <span 
            className="font-bold tracking-wider uppercase block mt-0.5"
            style={{ 
              color: subtitleColor, 
              fontSize: size === 'xs' ? '8px' : size === 'sm' ? '10px' : size === 'md' ? '11px' : size === 'lg' ? '13px' : '15px',
              letterSpacing: '0.15em'
            }}
          >
            SAHI TOL, DIGITAL VISHWAS
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'badge') {
    return (
      <div className={`inline-flex items-center gap-2 bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 shadow-2xs ${className}`}>
        {renderIconSvg()}
        <div className="text-left">
          <div className="flex items-center gap-1.5">
            <span className="font-black text-xs tracking-wider text-slate-950 dark:text-white leading-none">
              TOLSEVA
            </span>
            <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded leading-normal">
              GOV
            </span>
          </div>
          <span className="text-[9px] font-semibold text-indigo-900 dark:text-indigo-300 tracking-wider block">
            SAHI TOL, DIGITAL VISHWAS
          </span>
        </div>
      </div>
    );
  }

  // Default: horizontal layout (perfect for Navbars and Headers)
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {renderIconSvg()}
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1.5">
          <span 
            className="font-black tracking-wider leading-none"
            style={{ 
              color: textColor,
              fontSize: size === 'xs' ? '13px' : size === 'sm' ? '16px' : size === 'md' ? '19px' : '24px'
            }}
          >
            TOLSEVA
          </span>
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-orange-500/10 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300 border border-orange-500/30">
            METROLOGY
          </span>
        </div>
        <span 
          className="font-bold tracking-wider uppercase leading-tight mt-0.5"
          style={{ 
            color: subtitleColor,
            fontSize: size === 'xs' ? '8px' : size === 'sm' ? '9px' : size === 'md' ? '10px' : '12px',
            letterSpacing: '0.12em'
          }}
        >
          SAHI TOL, DIGITAL VISHWAS
        </span>
      </div>
    </div>
  );
};
