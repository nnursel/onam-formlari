import { useRef, useCallback, useEffect, useState } from 'react';
import ReactSignatureCanvas from 'react-signature-canvas';
import { Trash2 } from 'lucide-react';

interface SignatureCanvasProps {
  fieldId: string;
  label: string;
  value?: string;
  onChange: (fieldId: string, value: string) => void;
  height?: number;
}

export default function SignatureCanvas({ fieldId, label, value, onChange, height = 180 }: SignatureCanvasProps) {
  const sigRef = useRef<ReactSignatureCanvas | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Restore signature from saved value on mount
  useEffect(() => {
    if (!sigRef.current) return;
    if (!isReady) return;
    
    if (value && sigRef.current.isEmpty()) {
      try {
        sigRef.current.fromDataURL(value);
      } catch {
        // Ignore invalid dataURL
      }
    }
  }, [value, isReady]);

  const handleEnd = useCallback(() => {
    if (sigRef.current) {
      const dataURL = sigRef.current.toDataURL('image/png');
      onChange(fieldId, dataURL);
    }
  }, [fieldId, onChange]);

  const handleClear = useCallback(() => {
    if (sigRef.current) {
      sigRef.current.clear();
      onChange(fieldId, '');
    }
  }, [fieldId, onChange]);

  return (
    <div className="space-y-2">
      <label className="block text-[13px] font-medium text-slate-900">
        {label}
      </label>
      <div
        className="relative w-full border-2 border-dashed border-slate-300 rounded-lg overflow-hidden"
        style={{
          height,
          background: 'repeating-linear-gradient(45deg, #F8FAFA 0, #F8FAFA 10px, #F0F4F4 10px, #F0F4F4 20px)',
        }}
      >
        <ReactSignatureCanvas
          ref={(ref) => {
            sigRef.current = ref;
            if (ref && !isReady) {
              setIsReady(true);
            }
          }}
          penColor="#1a3a6b"
          minWidth={1.5}
          maxWidth={2.5}
          velocityFilterWeight={0.7}
          canvasProps={{
            className: 'w-full h-full cursor-crosshair',
          }}
          onEnd={handleEnd}
        />
      </div>
      <button
        type="button"
        onClick={handleClear}
        className="inline-flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 transition-colors select-none"
      >
        <Trash2 size={12} />
        Temizle
      </button>
    </div>
  );
}
