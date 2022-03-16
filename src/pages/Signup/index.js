import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { string, z } from 'zod';

import Input from 'components/form/Input';
import Button from 'components/common/Button';
import ComboBox from 'components/form/ComboBox';
import routesPaths from 'routes/routesPaths';
import useTranslation from 'hooks/useTranslation';
import useAuth from 'hooks/useAuth';
import { api } from 'services/api';
import { useSignupMutation } from 'services/auth/auth';
import { PASSWORD_REGEX } from 'constants/constants';

import './style.css';

const Signup = () => {
  const t = useTranslation();
  const dispatch = useDispatch();
  const { push } = useHistory();
  const { user, authenticated } = useAuth();
  const [signup, { isLoading, isSuccess, error }] = useSignupMutation();
  const genderList = [
    { value: 'female', name: 'female' },
    { value: 'male', name: 'male' },
  ];
  const schema = z
    .object({
      username: z.string().min(1),
      email: z.string().email({ message: t('signup.errors.emailMsg') }),
      gender: z.string().min(1),
      password: z.string().regex(PASSWORD_REGEX, { message: t('signup.errors.passwordMsg') }),
      passwordConfirmation: z
        .string()
        .regex(PASSWORD_REGEX, { message: t('signup.errors.passwordMsg') }),
    })
    .refine(data => data.password === data.passwordConfirmation, {
      message: t('signup.errors.passwordConfirmationMsg'),
      path: ['passwordConfirmation'],
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = data => signup(data);

  const resetErrors = useCallback(() => dispatch(api.util.resetApiState()), [dispatch]);

  const handleFocus = () => error && resetErrors();

  useEffect(() => {
    if (isSuccess) {
      push(routesPaths.index);
    }
  }, [isSuccess, user, push]);

  useEffect(() => resetErrors, [resetErrors]);

  if (authenticated) {
    return <Redirect to={routesPaths.index} />;
  }

  return (
    <div className="row">
      <div className="form column left-column">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <h1>{t('signup.title')}</h1>
          <label htmlFor="username">Name</label>
          <Input
            register={register}
            type="text"
            name="username"
            error={errors.username}
            handleFocus={handleFocus}
          />
          <label htmlFor="email">{t('signup.labels.email')}</label>
          <Input
            register={register}
            type="email"
            name="email"
            error={errors.email}
            handleFocus={handleFocus}
          />

          <label htmlFor="password">{t('signup.labels.password')}</label>
          <Input
            register={register}
            type="password"
            name="password"
            error={errors.password}
            handleFocus={handleFocus}
          />

          <label htmlFor="password">{t('signup.labels.passwordConfirmation')}</label>
          <Input
            register={register}
            type="password"
            name="passwordConfirmation"
            error={errors.passwordConfirmation}
            handleFocus={handleFocus}
          />
          <label htmlFor="gender">Gender</label>
          <ComboBox
            register={register}
            name="gender"
            error={errors.gender}
            handleFocus={handleFocus}
            dataSource={genderList}
          />
          <div className="button-container">
            <Button type="submit" disabled={isLoading}>
              {t('signup.title')}
            </Button>
            <Link to={routesPaths.login}>{t('signup.alreadyHaveAccount')}</Link>
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

export default Signup;
