import React from 'react';
import Input from 'components/form/Input';
import Button from 'components/common/Button';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useTranslation from 'hooks/useTranslation';
import emailjs from 'emailjs-com';

import './style.css';

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
  const [isForgotPassowrd, setIsForgotPassowrd] = useState(true);
  const [isSend, setIsSend] = useState(false);
  const [toSend, setToSend] = useState({
    message: `Hello, thank you for signing up to MVD! We're excited to have you onboard and will be happy to help you set everything up.`,
    to: '',
  });

  const setEmailData = data => {
    setToSend(prevState => {
      return {
        ...prevState,
        to: data.email,
      };
    });
  };
  const emailSendRecovery = () => {
    if (!isSend) {
      emailjs
        .send('service_c2myo6u', 'template_3cw6jas', toSend, 'CzOOH1L12ZmTTkiFU')
        .then(response => {
          setIsSend(true);
        })
        .catch(err => {});
    }
  };

  const onSubmitForgotPassowrd = data => {
    setEmailData(data);
    emailSendRecovery();
  };
  return (
    <div className="row">
      {!isSend ? (
        <div className="form column left-column">
          <form onSubmit={handleOnSubmitForgotPassowrd(onSubmitForgotPassowrd)} noValidate>
            <label htmlFor="email">{t('forgotPassword.email')}</label>
            <Input
              register={forgotPassowrd}
              type="email"
              name="email"
              error={forgotPassowrdErrors.email}
            />
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
