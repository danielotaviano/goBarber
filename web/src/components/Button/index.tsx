import React, { ButtonHTMLAttributes } from 'react';
import loadingGif from '../../assets/loading.svg';
import { Container } from './styles';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

const Button: React.FC<ButtonProps> = ({ children, loading, ...rest }) => (
  <Container type="button" {...rest}>
    {loading ? <img src={loadingGif} alt="loading..." /> : children}
  </Container>
);

export default Button;
