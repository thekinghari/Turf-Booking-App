import { FC } from 'react';

interface SwitchProps {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  label?: string;
}

export const Switch: FC<SwitchProps>; 