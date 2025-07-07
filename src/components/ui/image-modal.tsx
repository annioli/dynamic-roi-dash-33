
import React from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface ImageModalProps {
  src: string;
  alt: string;
  className?: string;
  children: React.ReactNode;
}

const ImageModal: React.FC<ImageModalProps> = ({ src, alt, className, children }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full h-[80vh] bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 p-0 overflow-hidden">
        <div className="relative w-full h-full flex items-center justify-center">
          <img 
            src={src} 
            alt={alt}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;
