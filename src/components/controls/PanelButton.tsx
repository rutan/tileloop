import { AnchorHTMLAttributes, ButtonHTMLAttributes, FC } from 'react';
import styles from './PanelButton.module.css';

type Variant = 'accent' | 'danger' | 'primary' | 'secondary';

interface CommonProps {
  className?: string;
  variant?: Variant;
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, CommonProps {}

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement>, CommonProps {}

function getClassName(variant: Variant, className?: string, isLink = false) {
  return [styles.button, isLink ? styles.linkButton : '', styles[variant], className].filter(Boolean).join(' ');
}

export const PanelButton: FC<ButtonProps> = ({ className, variant = 'secondary', ...props }) => {
  return <button className={getClassName(variant, className)} {...props} />;
};

export const PanelLinkButton: FC<LinkProps> = ({ children, className, variant = 'secondary', ...props }) => {
  return (
    <a className={getClassName(variant, className, true)} {...props}>
      {children}
    </a>
  );
};
