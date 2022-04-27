import React from 'react';
import Input from 'components/form/Input';
import Button from 'components/common/Button';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useTranslation from 'hooks/useTranslation';

import './style.css';
import { useResetPasswordMutation } from 'services/profile/profile';

const ForgotPassword = () => {
  const t = useTranslation();
  const schema = z.object({
    email: z.string().email({ message: t('signup.errors.emailMsg') }),
  });
  const {
    register: forgotPassowrd,
    handleSubmit: handleOnSubmitForgotPassowrd,
    formState: { errors: forgotPassowrdErrors },
  } = useForm({ resolver: zodResolver(schema) });
  const [isSend, setIsSend] = useState(false);
  const [resetPassword, { isSuccess }] = useResetPasswordMutation();
  const redirectUrl = 'https://localhost:3000/login';
  const onSubmitForgotPassowrd = data => {
    resetPassword({ ...data, redirect_url: redirectUrl });
  };
  useEffect(() => {
    if (isSuccess) {
      setIsSend(true);
    }
  }, [isSuccess]);

  return (
    <div className="row">
      {!isSend ? (
        <div className="form column left-column">
          <form onSubmit={handleOnSubmitForgotPassowrd(onSubmitForgotPassowrd)} noValidate>
            <label htmlFor="email">{t('forgotPassword.email')}</label>
            <Input register={forgotPassowrd} type="email" name="email" />
            <div className="button-container">
              <Button type="submit"> {t('forgotPassword.button')} </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="form column left-column">
          <h3>{t('forgotPassword.message')}</h3>
        </div>
      )}
      <div className="column right-column">
        <div className="i6"></div>
        <button id="apple-store"></button>
        <div className="social-media">
          <button id="facebook"></button>
          <button id="twitter"></button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
