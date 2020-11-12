import React, { useCallback, useRef } from 'react';
import { FiLogIn, FiLock } from 'react-icons/fi';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import queryString from 'query-string';
import getValidationErrors from '../../utils/getValidationErros';
import { useToast } from '../../hooks/toast';
import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, Background, AnimationContainer } from './styles';
import api from '../../services/api';

interface ResetPasswordFormData {
  password_confirmation: string;
  password: string;
}

const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();
  const location = useLocation();

  const handleSubmit = useCallback(
    async (data: ResetPasswordFormData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          password: Yup.string().required('Senha obrigatória'),
          password_confirmation: Yup.string()
            .required('Confirmar sua senha é obrigatorio')
            .oneOf([Yup.ref('password')], 'Confirmação incorreta'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const { password, password_confirmation } = data;
        const { token } = queryString.parse(location.search);

        if (!token) {
          addToast({
            type: 'error',
            title: 'Erro ao resetar sua senha',
            description:
              'Ocorreu um erro ao resetar sua senha, tente novamente',
          });
          return;
        }

        await api.post('/password/reset', {
          password,
          password_confirmation,
          token,
        });

        history.push('/');
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          formRef.current?.setErrors(errors);
          return;
        }

        addToast({
          type: 'error',
          title: 'Erro ao resetar sua senha',
          description: 'Ocorreu um erro ao resetar sua senha, tente novamente',
        });
      }
    },
    [addToast, history, location.search],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Resetar Senha</h1>

            <Input
              name="password"
              type="password"
              placeholder="Digite sua nova senha"
              icon={FiLock}
            />

            <Input
              name="password_confirmation"
              type="password"
              placeholder="Confirme sua nova senha"
              icon={FiLock}
            />
            <Button type="submit">Alterar senha</Button>
          </Form>

          <Link to="/">
            <FiLogIn />
            Volte para o login
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ResetPassword;
