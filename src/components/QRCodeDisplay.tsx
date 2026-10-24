import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  label?: string;
  className?: string;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  value,
  size = 180,
  label,
  className = ''
}) => {
  const [dataUrl, setDataUrl] = useState<string>('');

  useEffect(() => {
    QRCode.toDataURL(value, {
      width: size * 2,
      margin: 1,
      color: {
        dark: '#08080A',
        light: '#F5E6B8', // Soft luxury gold background
      },
    })
      .then((url: string) => setDataUrl(url))
      .catch((err: unknown) => console.error('Error generating QR Code', err));
  }, [value, size]);

  if (!dataUrl) {
    return (
      <div 
        style={{ width: size, height: size }} 
        className="flex items-center justify-center bg-[#15151C] border border-[#D4AF37]/30 rounded-xl animate-pulse text-xs text-[#D4AF37]"
      >
        Generating QR...
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="p-2.5 bg-[#F5E6B8] rounded-xl shadow-lg border border-[#D4AF37]/40">
        <img
          src={dataUrl}
          alt={label || 'QR Code'}
          style={{ width: size, height: size }}
          className="rounded-lg object-contain"
        />
      </div>
      {label && (
        <span className="mt-2 text-xs text-neutral-400 font-mono tracking-wide">{label}</span>
      )}
    </div>
  );
};
