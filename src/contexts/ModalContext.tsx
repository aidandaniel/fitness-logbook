import { createContext, useContext, useState, ReactNode } from 'react';

interface ModalContextType {
  isAnyModalOpen: boolean;
  registerModal: () => () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [openModals, setOpenModals] = useState<Set<symbol>>(new Set());

  const registerModal = () => {
    const modalId = Symbol('modal');
    setOpenModals(prev => new Set(prev).add(modalId));
    
    // Return cleanup function
    return () => {
      setOpenModals(prev => {
        const next = new Set(prev);
        next.delete(modalId);
        return next;
      });
    };
  };

  const isAnyModalOpen = openModals.size > 0;

  return (
    <ModalContext.Provider value={{ isAnyModalOpen, registerModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModalContext() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModalContext must be used within a ModalProvider');
  }
  return context;
}
