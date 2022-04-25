import { useCallback, useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { api } from 'services/api';
import { useLoginMutation } from 'services/auth/auth';
import useAuth from 'hooks/useAuth';
import useTranslation from 'hooks/useTranslation';
import routesPaths from 'routes/routesPaths';
import Input from 'components/form/Input';
import Button from 'components/common/Button';
import '../../styles/form.css';
import './style.css';
import Menu from 'components/menu';
import Modal from 'components/modal';
import { ModalHeader } from 'components/modal';
import { ModalBody } from 'components/modal';
import { ModalFooter } from 'components/modal';

const Login = () => {
  const t = useTranslation();
  const dispatch = useDispatch();
  const { push } = useHistory();
  const [login, { isLoading, isSuccess, error }] = useLoginMutation();
  const { authenticated, user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const schema = z.object({
    email: z.string().email({ message: t('login.errors.emailMsg') }),
    password: z.string().min(1, { message: t('login.errors.passwordMsg') }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = data => login(data);

  const resetErrors = useCallback(() => dispatch(api.util.resetApiState()), [dispatch]);

  const handleFocus = () => error && resetErrors();

  useEffect(() => {
    if (isSuccess) {
      push(routesPaths.index);
    }
  }, [isSuccess, user, push]);

  useEffect(() => resetErrors, [resetErrors]);
  const switchTab = dataFromChild => {
    if (dataFromChild === 'CONTACT') {
      setShowModal(true);
    }
  };
  if (authenticated) {
    return <Redirect to={routesPaths.index} />;
  }
  return (
    <div className="row">
      <div className="form column left-column">
        <Menu switchTab={switchTab} />
        <Modal show={showModal} setShow={setShowModal}>
          <ModalBody>
            <div className="circles"> </div>
            <h3 className="contact-title">{t('contact.form.title')}</h3>
            <div className="contact-form">
              <label htmlFor="contactEmail">{t('contact.form.label.email')}</label>
              <input type="email" name="contactEmail" className="contact-input" />
              <label htmlFor="contactEmail">{t('contact.form.label.message')}</label>
              <textarea className="contact-text-area"></textarea>
              <div className="contact-button">
                <Button handleClick={() => setShowModal(false)}>{t('contact.form.button')}</Button>
              </div>
            </div>
          </ModalBody>
        </Modal>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="circles"> </div>
          <h1 className="title">{t('login.title')}</h1>
          <h5 className="subTitle">{t('login.subTitle')}</h5>
          <p className="explanation">{t('login.explanation')}</p>
          <label htmlFor="email">{t('login.labels.email')}</label>
          <Input
            register={register}
            type="email"
            name="email"
            error={errors.email}
            handleFocus={handleFocus}
          />

          <label htmlFor="password">{t('login.labels.password')}</label>
          <Input
            register={register}
            type="password"
            name="password"
            error={errors.password}
            handleFocus={handleFocus}
          />

          {error && error.data && <p className="error-message">{error.data.errors}</p>}

          <div className="button-container">
            <Button type="submit" disabled={isLoading}>
              {t('login.button.signin')}
            </Button>
            <Link to={routesPaths.signup} className="forgot">
              {t('login.forgot')}
            </Link>
            <Link to={routesPaths.signup} className="facebook">
              {t('login.faceBook')}
            </Link>
            <hr />
            <Link to={routesPaths.signup} className="signup">
              {t('login.dontHaveAccountMsg')}
            </Link>
          </div>
        </form>
      </div>

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

export default Login;
