import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import cookie from 'js-cookie';
import { useRouter } from 'next/router';
import { useAuth } from '../../providers/auth';
import Image from 'next/image';

//COMPONENTS
import { FieldInput, Button, LinkText, WarningText } from '../index';

//STYLE
import { ContainerFormLogin } from './style';

// UTILS
import { YupMessage } from '../../utils/yupMessagens';
import { CustomIcons } from '../../assets/icons';
import { useState } from 'react';

// VALIDATION
const schema = yup.object({
  email: yup
    .string()
    .email(YupMessage.invalidformat)
    .required(YupMessage.requiredField),
  password: yup.string().required(YupMessage.requiredField),
});

export type FormLoginProps = {
  onRegister: () => void;
  onCallModal: (type: string, message: string) => void;
};

export const FormLogin = ({ onRegister, onCallModal }: FormLoginProps) => {
  const router = useRouter();
  const { setUser } = useAuth();
  const [typeInput, setTypeInput] = useState('password');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(schema),
  });

  const setSession = (session, user) => {
    if (session) {
      cookie.set('bugbank-auth', session, {
        expires: 1,
        path: '/',
      });
      user.logged = true;
      setUser(user);
      localStorage.setItem(user.email, JSON.stringify(user));
      router.push({
        pathname: '/home',
      });
    } else {
      cookie.remove('bugbank-auth');
    }
  };

  const allStorage = () => {
    const values = [];
    const keys = Object.keys(localStorage);
    let i = keys.length;

    while (i--) {
      values.push(localStorage.getItem(keys[i]));
    }
    return values;
  };

  function handleLogin(data) {
    const responseStorage = localStorage.getItem(data.email);
    const loggedUser = JSON.parse(responseStorage);

    if (!loggedUser) {
      onCallModal(
        'error',
        'Usuário ou senha inválido.\nTente novamente ou verifique suas informações!',
      );
      return;
    }

    const users = allStorage();

    users.map((user) => {
      const u = JSON.parse(user);
      if (u.email !== loggedUser.email) {
        u.logged = false;
        localStorage.setItem(u.email, JSON.stringify(u));
      }
    });

    if (loggedUser && data.password === loggedUser.password) {
      setSession(true, loggedUser);
    } else {
      onCallModal(
        'error',
        'Usuário ou senha inválido.\nTente novamente ou verifique suas informações!',
      );
      setSession(false, loggedUser);
    }
  }

  return (
    <ContainerFormLogin
      onSubmit={handleSubmit(handleLogin)}
      autoComplete="nope"
    >
      <FieldInput
        label="E-mail"
        type="email1"
        name="email1"
        visible={!!errors.email}
        messageError={errors.email?.message}
        register={register}
        placeholder="Informe seu e-mail"
      />
      <div className="login__password">
        <FieldInput
          label="Senha"
          type={typeInput}
          name="password"
          visible={!!errors.password}
          messageError={errors.password?.message}
          register={register}
          placeholder="Informe sua senha"
        />
        <button
          className="login__eye"
          type="button"
          onClick={() =>
            setTypeInput(typeInput === 'password' ? 'text' : 'password')
          }
        >
          <Image
            src={
              typeInput === 'password'
                ? CustomIcons.CloseEye.src
                : CustomIcons.OpenEye.src
            }
            alt={
              typeInput === 'password'
                ? CustomIcons.CloseEye.alt
                : CustomIcons.OpenEye.alt
            }
            width="26"
            height="26"
          />
        </button>
      </div>
      <div className="login__buttons">
        <Button label="Acessar" type="submit" appearance="pink" />
        <Button
          label="Registrar"
          onClick={() => {
            onRegister();
            reset();
          }}
          appearance="white"
        />
      </div>
      <div className="login__link">
        <LinkText href="/requirements">Conheça nossos requisitos</LinkText>

        <WarningText>
          A aplicação não conta com um banco de dados, todas as informações são
          armazenadas em <span>memória local</span>
        </WarningText>
      </div>
    </ContainerFormLogin>
  );
};
