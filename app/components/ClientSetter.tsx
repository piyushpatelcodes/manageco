'use client';

import { useEffect } from 'react';

export default function ClientSessionSetter({ currentUser }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && currentUser) {
      sessionStorage.setItem('user', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  return null;
}
