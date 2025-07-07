
import React, { useRef, useState } from 'react';
import { Camera, Upload } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface AvatarUploadProps {
  currentImage?: string;
  fallback: string;
  onImageChange: (imageUrl: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentImage,
  fallback,
  onImageChange,
  className,
  size = 'md'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-16 w-16'
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Arquivo inválido",
        description: "Por favor, selecione apenas arquivos de imagem.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "A imagem deve ter no máximo 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    // Create file URL for preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        // Store in localStorage for persistence
        localStorage.setItem('user-avatar', result);
        onImageChange(result);
        toast({
          title: "Foto atualizada",
          description: "Sua foto de perfil foi atualizada com sucesso.",
        });
      }
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    localStorage.removeItem('user-avatar');
    onImageChange('');
    toast({
      title: "Foto removida",
      description: "Sua foto de perfil foi removida.",
    });
  };

  return (
    <div className={cn("relative group", className)}>
      <Avatar className={cn(sizeClasses[size], "cursor-pointer transition-all duration-200 group-hover:opacity-80")}>
        <AvatarImage src={currentImage} alt="Avatar" />
        <AvatarFallback className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          {fallback}
        </AvatarFallback>
      </Avatar>
      
      {/* Upload overlay */}
      <div 
        className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer"
        onClick={handleUploadClick}
      >
        {isUploading ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <Camera className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Upload buttons for larger sizes */}
      {size === 'lg' && (
        <div className="mt-4 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleUploadClick}
            disabled={isUploading}
            className="flex-1"
          >
            <Upload className="w-4 h-4 mr-2" />
            {currentImage ? 'Alterar' : 'Upload'}
          </Button>
          {currentImage && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleRemoveImage}
              disabled={isUploading}
            >
              Remover
            </Button>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default AvatarUpload;
