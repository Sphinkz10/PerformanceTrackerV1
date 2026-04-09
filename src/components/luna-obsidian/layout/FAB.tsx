import React from 'react';

export function FAB() {
  const toggleFab = () => {
    const fab = document.getElementById('fab');
    if (fab) {
      fab.classList.toggle('open');
      if (fab.classList.contains('open')) {
        // Here we'd show the menu in a real implementation
        setTimeout(() => fab.classList.remove('open'), 800);
      }
    }
  };

  return (
    <button
      id="fab"
      className="fixed bottom-8 right-8 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-gold to-orange_l border-none text-navy flex items-center justify-center cursor-pointer shadow-[0_8px_24px_rgba(255,183,1,0.4),0_0_40px_rgba(255,183,1,0.15),inset_0_1px_0_rgba(255,255,255,0.3)] transition-all duration-300 hover:-translate-y-[3px] hover:scale-105 hover:shadow-[0_12px_32px_rgba(255,183,1,0.5)] group"
      onClick={toggleFab}
    >
      <svg
        viewBox="0 0 24 24"
        className="w-6 h-6 stroke-current fill-none stroke-[3] stroke-linecap-round stroke-linejoin-round transition-transform duration-300 group-[.open]:rotate-45"
      >
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </button>
  );
}
