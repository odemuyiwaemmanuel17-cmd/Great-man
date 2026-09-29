import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

type BookingApi = {
  open: boolean;
  service: string;
  openBooking: (service?: string) => void;
  closeBooking: () => void;
};

const BookingContext = createContext<BookingApi | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [service, setService] = useState('');

  const openBooking = useCallback((next = '') => {
    setService(next);
    setOpen(true);
  }, []);

  const closeBooking = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ open, service, openBooking, closeBooking }),
    [open, service, openBooking, closeBooking],
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used inside BookingProvider');
  return ctx;
}
