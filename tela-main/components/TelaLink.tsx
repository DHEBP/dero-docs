import { useCallback, useRef, useEffect, useState } from 'react';

interface TelaLinkProps {
  scid: string;
  path?: string;
  children: React.ReactNode;
  className?: string;
}

export const TelaLink: React.FC<TelaLinkProps> = ({ 
  scid, 
  path = '', 
  children, 
  className 
}) => {
  // Use a ref to track processing state and prevent double-clicks
  const processingRef = useRef(false);
  // Track if component is mounted (client-side only)
  const [isMounted, setIsMounted] = useState(false);

  // Generate the TELA link URL
  const telaLink = `tela://open/${scid}/${path}`;

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    console.log(`Processing TELA link: ${telaLink}`);
    
    // Try WebSocket handler first if available
    if (typeof window !== 'undefined' && window.handleTelaLink) {
      e.preventDefault();
      
      // Prevent multiple clicks from being processed
      if (processingRef.current) {
        console.log('Already processing a TELA link request, please wait');
        return;
      }
      
      processingRef.current = true;
      
      try {
        window.handleTelaLink(telaLink);
        
        // Reset processing state after a delay
        setTimeout(() => {
          processingRef.current = false;
        }, 2000); // 2 second cooldown between clicks
      } catch (error) {
        console.error('Error processing TELA link:', error);
        alert(`Error processing TELA link: ${error.message || 'Unknown error'}`);
        processingRef.current = false;
      }
    } else {
      // Let browser handle tela:// protocol natively
      // Don't prevent default - this allows Engram to catch the protocol
      console.log('Attempting to open via tela:// protocol handler');
      // Browser will try to open with registered protocol handler (Engram)
      // If that fails, browser will show its own "no protocol handler" message
    }
  }, [scid, path, telaLink]);

  return (
    <a 
      href={telaLink} // Use actual tela:// URL for better browser behavior
      role="button"
      onClick={handleClick}
      className={className}
      style={{ cursor: 'pointer' }}
      data-scid={scid}
      data-path={path}
      title={`Open TELA content: ${telaLink}`} // Add title for better tooltip
      aria-label={`Open TELA content: ${scid}/${path}`}
    >
      {children}
    </a>
  );
}; 