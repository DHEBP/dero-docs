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
    e.preventDefault(); // Always prevent default to show our custom message
    
    console.log(`Processing TELA link: ${telaLink}`);
    
    // Prevent multiple clicks from being processed
    if (processingRef.current) {
      console.log('Already processing a TELA link request, please wait');
      return;
    }
    
    processingRef.current = true;
    
    // Try WebSocket handler first if available
    if (typeof window !== 'undefined' && window.handleTelaLink) {
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
      // WebSocket handler not available - show helpful instructions
      console.log('TELA WebSocket handler not available - Engram not connected');
      
      const message = `⚠️ Engram Wallet Required

To open TELA applications, you need Engram wallet running with XSWD enabled:

📥 SETUP STEPS:
1. Download Engram from:
   github.com/DEROFDN/Engram/releases

2. Launch Engram on your computer

3. In Engram Settings:
   • Enable "Cyberdeck" (XSWD protocol)
   • Verify it shows port 44326

4. Keep Engram running in background

5. Refresh this page and try again

💡 Engram must be running to open TELA apps!`;
      
      alert(message);
      processingRef.current = false;
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