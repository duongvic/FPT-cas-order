import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LoadingOutlined,
} from '@ant-design/icons';
import { Col, DatePicker, Form, Input, Radio, Row, Select, Spin } from 'antd';
import { Pattern } from 'app/containers/Auth/constants';
import {
  MODE_CREATE,
  MODE_EDIT,
  MODE_UPDATE,
} from 'app/containers/Users/constants';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const selectorIdentifi = (
  <Form.Item initialValue="cmnd" name="identification" noStyle>
    <Select style={{ width: 100 }}>
      <Option value="cmnd">CMND</Option>
      <Option value="cancuoc">Căn cước</Option>
      <Option value="hochieu">Hộ chiếu</Option>
    </Select>
  </Form.Item>
);

interface Props {
  mode: string;
  handleBlurUsername?: any;
  loading?: boolean;
  userType?: string;
}

export default function UserFormBase({
  mode,
  handleBlurUsername,
  loading,
  userType,
}: Props) {
  const [customerType, setCustomerType] = useState('PERSONAL');

  const { t } = useTranslation(['translation', 'constant']);

  useEffect(() => {
    if (userType) {
      setCustomerType(userType);
    } else {
      setCustomerType('PERSONAL');
    }
  }, [userType]);

  const personal = (
    <>
      <Form.Item
        name="full_name"
        label={t('Label.FULL_NAME')}
        rules={[
          {
            required: true,
            message: t('Field_Message.FULL_NAME'),
            whitespace: true,
          },
        ]}
      >
        <Input placeholder={t('Placeholder.FULL_NAME')} />
      </Form.Item>
      <Form.Item
        name="id_no"
        label={t('constant:Label.ID')}
        rules={[{ required: true, message: t('Field_Message.ID') }]}
      >
        <Input
          addonBefore={selectorIdentifi}
          style={{ width: '100%' }}
          placeholder={t('constant:Placeholder.PHONE_NUMBER')}
        />
      </Form.Item>
      <Row>
        <Col span={mode === MODE_EDIT ? 2 : 6}></Col>
        <Col span={9}>
          <Form.Item
            labelCol={{ span: 8 }}
            name="id_created_at"
            label={t('Label.ID_CREATED_AT')}
            rules={[
              {
                type: 'object',
                required: true,
                message: t('Field_Message.REQUIRED_FIELD'),
              },
            ]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
        </Col>
        <Col span={9}>
          <Form.Item
            name="id_location"
            label={t('Label.ID_LOCATION')}
            rules={[
              {
                required: true,
                message: t('Field_Message.REQUIRED_FIELD'),
                whitespace: true,
              },
            ]}
          >
            <Input placeholder={t('Label.ID_LOCATION')} />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        name="phone_num"
        label={t('Label.PHONE_NUMBER')}
        rules={[
          {
            required: true,
            message: t('Field_Message.REQUIRED_FIELD'),
            whitespace: true,
          },
        ]}
      >
        <Input placeholder={t('constant:Placeholder.PHONE_NUMBER')} />
      </Form.Item>
      <Form.Item
        name="email"
        label="E-mail"
        rules={[
          {
            type: 'email',
            message: t('Field_Message.EMAIL'),
          },
          {
            required: true,
            message: t('Field_Message.REQUIRED_FIELD'),
          },
        ]}
      >
        <Input
          disabled={mode !== MODE_CREATE}
          placeholder={t('constant:Placeholder.EMAIL')}
        />
      </Form.Item>
      <Form.Item
        name="address"
        label={t('Label.ADDRESS')}
        rules={[
          {
            required: true,
            message: t('Field_Message.ADDRESS'),
            whitespace: true,
          },
        ]}
      >
        <Input placeholder={t('Field_Message.ADDRESS')} />
      </Form.Item>
      <Form.Item
        name="ref_name"
        label={t('Label.REF_NAME')}
        rules={[
          {
            required: true,
            message: t('Field_Message.REQUIRED_FIELD'),
            whitespace: true,
          },
        ]}
      >
        <Input placeholder={t('Placeholder.REF_NAME')} />
      </Form.Item>
      <Row>
        <Col span={mode === MODE_EDIT ? 2 : 6}></Col>
        <Col span={18}>
          <Form.Item name="ref_phone" label={t('Label.PHONE_NUMBER')}>
            <Input placeholder={t('constant:Placeholder.PHONE_NUMBER')} />
          </Form.Item>
        </Col>
        <Col span={18} push={mode === MODE_EDIT ? 2 : 6}>
          <Form.Item
            name="ref_email"
            label="E-mail"
            rules={[
              {
                type: 'email',
                message: t('Invalid_Pattern.EMAIL'),
              },
            ]}
          >
            <Input placeholder={t('constant:Placeholder.EMAIL')} />
          </Form.Item>
        </Col>
      </Row>
    </>
  );

  const company = (
    <>
      <Form.Item
        name="full_name"
        label={t('Label.COMPANY_NAME')}
        rules={[
          {
            required: true,
            message: t('Field_Message.REQUIRED_FIELD'),
            whitespace: true,
          },
        ]}
      >
        <Input placeholder={t('Label.COMPANY_NAME')} />
      </Form.Item>
      <Form.Item
        name="email"
        label="E-mail"
        rules={[
          {
            type: 'email',
            message: t('Invalid_Pattern.EMAIL'),
          },
          {
            required: true,
            message: t('Field_Message.REQUIRED_FIELD'),
          },
        ]}
      >
        <Input disabled={mode !== MODE_CREATE} placeholder="abc@.bbb" />
      </Form.Item>
      <Form.Item
        name="address"
        label={t('Label.COMPANY_ADDRESS')}
        rules={[
          {
            required: true,
            message: t('Field_Message.REQUIRED_FIELD'),
            whitespace: true,
          },
        ]}
      >
        <Input placeholder={t('Label.COMPANY_ADDRESS')} />
      </Form.Item>
      <Form.Item
        name="tax_no"
        label={t('Label.TAX_NO')}
        rules={[{ required: true, message: t('Title.ID') }]}
      >
        <Input
          style={{ width: '100%' }}
          placeholder={t('constant:Placeholder.PHONE_NUMBER')}
        />
      </Form.Item>

      <Form.Item
        name="rep_name"
        label={t('Label.REP_NAME')}
        rules={[
          {
            required: true,
            message: t('Field_Message.REQUIRED_FIELD'),
            whitespace: true,
          },
        ]}
      >
        <Input placeholder={t('Label.REP_NAME')} />
      </Form.Item>
      <Row>
        <Col span={mode === MODE_EDIT ? 2 : 6}></Col>
        <Col span={18}>
          <Form.Item name="rep_phone" label={t('Label.PHONE_NUMBER')}>
            <Input placeholder={t('constant:Placeholder.PHONE_NUMBER')} />
          </Form.Item>
        </Col>
        <Col span={18} push={mode === MODE_EDIT ? 2 : 6}>
          <Form.Item
            name="rep_email"
            label="E-mail"
            rules={[
              {
                type: 'email',
                message: t('Title.EMAIL'),
              },
            ]}
          >
            <Input placeholder={t('constant:Placeholder.EMAIL')} />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="ref_name"
        label={t('Label.REF_NAME')}
        rules={[
          {
            required: true,
            message: t('Field_Message.REQUIRED_FIELD'),
            whitespace: true,
          },
        ]}
      >
        <Input placeholder={t('Placeholder.REF_NAME')} />
      </Form.Item>
      <Row>
        <Col span={mode === MODE_EDIT ? 2 : 6}></Col>
        <Col span={18}>
          <Form.Item name="ref_phone" label={t('Label.PHONE_NUMBER')}>
            <Input placeholder={t('constant:Placeholder.PHONE_NUMBER')} />
          </Form.Item>
        </Col>
        <Col span={18} push={mode === MODE_EDIT ? 2 : 6}>
          <Form.Item
            name="ref_email"
            label="E-mail"
            rules={[
              {
                type: 'email',
                message: t('Field_Message.EMAIL'),
              },
            ]}
          >
            <Input placeholder={t('constant:Placeholder.EMAIL')} />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
  return (
    <>
      <Form.Item
        name="user_name"
        label={t('Label.ACCOUNT')}
        rules={[
          {
            required: true,
            message: t('Field_Message.REQUIRED_FIELD'),
            whitespace: true,
          },
          {
            pattern: Pattern.USERNAME,
            message: t('Invalid_Pattern.USERNAME'),
          },
        ]}
      >
        <Input
          disabled={mode !== MODE_CREATE && mode !== MODE_UPDATE}
          placeholder={t('Label.ACCOUNT')}
          // autoComplete="off"
          onBlur={handleBlurUsername}
          suffix={loading ? <Spin indicator={antIcon} /> : null}
        />
      </Form.Item>
      {mode === MODE_CREATE && (
        <>
          <Form.Item
            name="password"
            label={t('Label.PASSWORD')}
            rules={[
              {
                required: true,
                message: t('Field_Message.PASSWORD'),
                whitespace: true,
              },
            ]}
          >
            <Input.Password
              autoComplete="new-password"
              placeholder={t('Placeholder.PASSWORD')}
              iconRender={visible =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label={t('Label.CONFIRM_PASSWORD')}
            rules={[
              {
                required: true,
                message: t('Field_Message.CONFIRM_PASSWORD'),
                whitespace: true,
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(t('Field_Message.PASSWORD_NOT_MATCH'));
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Password"
              iconRender={visible =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
        </>
      )}
      <Form.Item
        name="account_type"
        initialValue="AGENCY"
        label={t('Label.ACCOUNT_TYPE')}
      >
        <Select autoFocus>
          <Option value="AGENCY">Agency</Option>
          <Option value="EU">End User</Option>
        </Select>
      </Form.Item>
      <Form.Item
        initialValue="PERSONAL"
        name="user_type"
        label={t('Label.CUSTOMER_TYPE')}
      >
        <Radio.Group onChange={event => setCustomerType(event.target.value)}>
          <Radio value="PERSONAL">{t('Typography.PERSONAL')}</Radio>
          <Radio value="COMPANY">{t('Typography.COMPANY')}</Radio>
        </Radio.Group>
      </Form.Item>
      {customerType === 'PERSONAL' && personal}
      {customerType === 'COMPANY' && company}
    </>
  );
}
