import { LockOutlined, UserOutlined } from '@ant-design/icons';
import {
  Button,
  Form,
  Image,
  Input,
  notification,
  Row,
  Space,
  Typography,
} from 'antd';
import logo from 'assets/img/logo/logo_2017.svg';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Redirect, useHistory } from 'react-router-dom';
import { noticficationBase } from 'utils/constant';
import RequireOtp from './RequireOtp';
import {
  selectAccount,
  selectData,
  selectError,
  selectLoading,
  selectNotice,
} from './selectors';
import { actions } from './slice';

const { Text } = Typography;

export default function SignIn() {
  const [showOtpForm, setShowOtpForm] = useState(false);

  const dispatch = useDispatch();
  const history = useHistory();
  const [form] = Form.useForm();
  const { t } = useTranslation(['translation', 'constant']);

  const account = useSelector(selectAccount);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const data = useSelector(selectData);
  const notice = useSelector(selectNotice);

  const onFinish = values => {
    const { user_name, password } = values;
    if (
      data?.user_name === user_name &&
      data?.password === password &&
      error === t('constant:Message.OTP_INVALID')
    ) {
      setShowOtpForm(true);
    } else {
      dispatch(actions.setData({ user_name, password }));
      dispatch(actions.loadAccount());
    }
  };
  const submitWithOtp = value => {
    dispatch(actions.setData({ ...data, otp_token: value }));
    dispatch(actions.loadAccount());
  };
  //Reset Error
  useEffect(() => {
    return () => {
      dispatch(actions.setError(null));
    };
  }, [dispatch]);

  useEffect(() => {
    if (error === t('constant:Message.OTP_INVALID')) setShowOtpForm(true);
  }, [error, t]);

  useEffect(() => {
    if (account) {
      noticficationBase('success', `Welcome ${account.user_name} back`);
      setTimeout(() => history.push('/dashboard'), 1000);
    }
  }, [account, history]);

  useEffect(() => {
    if (notice === t('Message.RECOMMEND_TWO_FACTORS')) {
      notification.warning({
        message: notice,
        placement: 'bottomRight',
        duration: 10,
        key: notice,
        btn: (
          <Row justify="end">
            <Space size={16}>
              <Button type="link" onClick={() => notification.close(notice)}>
                {t('Button.NOT_NOW')}
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  history.push('/dashboard/profile#security_option');
                  notification.close(notice);
                }}
              >
                {t('Button.SETTING')}
              </Button>
            </Space>
          </Row>
        ),
      });
      dispatch(actions.setNotice(null));
    }
  }, [t, notice, dispatch, history]);

  return account ? (
    <Redirect to="/dashboard"></Redirect>
  ) : (
    <>
      <Space direction="vertical" size="middle" className="auth-form">
        <Row justify="center">
          <NavLink to="/">
            <Image width={100} src={logo}></Image>
          </NavLink>
        </Row>
        <Row justify="center">
          <Typography.Title level={2}>{t('Title.SIGN_IN')}</Typography.Title>
        </Row>
        <Row justify="center">
          <Form
            form={form}
            name="normal_login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="user_name"
              rules={[{ required: true, message: t('Field_Message.USERNAME') }]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder={t('Placeholder.USERNAME_OR_EMAIL')}
                size="large"
                autoFocus
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: t('Field_Message.PASSWORD') }]}
            >
              <Input.Password
                autoComplete="new-password"
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder={t('Placeholder.PASSWORD')}
                size="large"
              />
            </Form.Item>
            {/* <Form.Item>
              <Row justify="space-between">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Ghi nhớ tài khoản</Checkbox>
                </Form.Item>
                <NavLink to="/forgot-password">Quên Mật Khẩu</NavLink>
              </Row>
            </Form.Item> */}
            {error && (
              <Row style={{ marginBottom: 4 }}>
                <Text type="danger">{`Error: ${error}`}</Text>
              </Row>
            )}
            <Form.Item>
              <Button
                size="large"
                type="primary"
                htmlType="submit"
                className="login-form-button"
                loading={!data?.otp_token ? loading : false}
                block
              >
                {t('Button.SIGN_IN')}
              </Button>
              <Row justify="space-between" style={{ marginTop: '0.5rem' }}>
                <NavLink to="/sign-up">{t('Link.SIGN_UP')}</NavLink>
                <NavLink to="/forgot-password">
                  {t('Link.FORGOT_PASSWORD')}
                </NavLink>
              </Row>
            </Form.Item>
            <Row justify="center">
              <NavLink to="/forgot-qrcode">
                {t('Title.LOST_GOOGLE_AUTHENTICATOR_ACCOUNT')}
              </NavLink>
            </Row>
          </Form>
        </Row>
      </Space>
      <RequireOtp
        visible={showOtpForm}
        setVisible={() => setShowOtpForm(false)}
        submitWithOtp={value => submitWithOtp(value)}
      ></RequireOtp>
    </>
  );
}
