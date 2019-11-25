import * as React from 'react';
import './LinkButton.less';
interface ILinkButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const LinkButton: React.FunctionComponent<ILinkButtonProps> = ({ children, onClick }) => {
  return (
    <button className={`link-button`} onClick={onClick}>
      {children}
    </button>
  );
};

export default LinkButton;
