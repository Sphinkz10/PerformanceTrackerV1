import React from 'react';
import styles from './luna-forms.module.css';
import { useLunaForms } from './LunaFormsContext';

export const DrawerBackdrop: React.FC = () => {
  const { isLeftDrawerOpen, isRightDrawerOpen, closeDrawers } = useLunaForms();

  const isOpen = isLeftDrawerOpen || isRightDrawerOpen;

  return (
    <div
      className={`${styles.drawerBackdrop} ${isOpen ? styles.open : ''}`}
      onClick={closeDrawers}
    />
  );
};
