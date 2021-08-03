import { Button, Card, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { RESOURCE_TYPE } from './constants';
import { selectLoading, selectNotice } from './selectors';
import { actions } from './slice';

export default function CreateForm() {
  const loading = useSelector(selectLoading);
  const notice = useSelector(selectNotice);
  const { t } = useTranslation(['translation', 'constant']);

  const dispatch = useDispatch();
  const history = useHistory();

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  const rules = {
    rules: [{ required: true, message: t('Field_Message.REQUIRED_FIELD') }],
  };

  useEffect(() => {
    if (notice === t('Message.CREATE_PRODUCT_SUCCESS')) {
      dispatch(actions.loadProducts());
      history.push('/dashboard/products');
    }
  }, [notice]);

  const onFinish = (value: any) => {
    const data: any = {
      ...value,
      type: value.resource_type,
      data: {
        arch: value.arch,
        type: value.type,
        version: value.version,
        platform: value.platform,
        backend_name: value.backend_name,
      },
    };
    delete data.arch;
    delete data.resource_type;
    //    delete data.type;
    delete data.version;
    delete data.platform;
    delete data.backend_name;
    dispatch(actions.setData(data));
    dispatch(actions.createProduct());
  };

  return (
    <Row className='steps-content'>
      <Col span={18} push={3}>
        <Form
          {...layout}
          layout="horizontal"
          labelAlign="left"
          scrollToFirstError={true}
          onFinish={onFinish}
        >
          <Card
            title={t('Title.CREATE_PRODUCT')}
            bordered={false}
            style={{ height: '100%', minHeight: '78vh' }}
          >
            <Form.Item label={t('constant:Label.NAME')} name="name" {...rules}>
              <Input placeholder={t('constant:Label.NAME')}></Input>
            </Form.Item>
            <Form.Item
              label={t('constant:Label.RESOURCE_TYPE')}
              name="resource_type"
              {...rules}
            >
              <Select placeholder={t('constant:Label.RESOURCE_TYPE')}>
                {RESOURCE_TYPE.map(item => (
                  <Select.Option value={item} key={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              initialValue="License"
              label={t('constant:Label.UNIT')}
              name="unit"
            >
              <Input disabled></Input>
            </Form.Item>
            <Form.Item
              initialValue="image"
              label={t('constant:Label.CN')}
              name="cn"
            >
              <Input disabled></Input>
            </Form.Item>
            <Form.Item
              label={t('constant:Label.INIT_FEE')}
              name="init_fee"
              {...rules}
              initialValue={0}
            >
              <InputNumber
                style={{ width: '50%' }}
                formatter={value =>
                  `${value} VNĐ`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                parser={(value: any) => value.replace(/[ VNĐ]\s?|(,*)/g, '')}
                min={0}
              ></InputNumber>
            </Form.Item>
            <Form.Item
              label={t('constant:Label.MAINTENANCE_FEE')}
              name="maintenance_fee"
              initialValue={0}
              {...rules}
            >
              <InputNumber
                style={{ width: '50%' }}
                formatter={value =>
                  `${value} VNĐ`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                parser={(value: any) => value.replace(/[ VNĐ]\s?|(,*)/g, '')}
                min={0}
              ></InputNumber>
            </Form.Item>
            <Form.Item
              label={t('constant:Label.DESCRIPTION')}
              name="description"
              {...rules}
            >
              <Input.TextArea
                allowClear
                placeholder={t('constant:Placeholder.DESCRIPTION')}
              ></Input.TextArea>
            </Form.Item>
            <Form.Item label={t('constant:Label.ARCH')} name="arch" {...rules}>
              <Input placeholder={t('constant:Placeholder.ARCH')}></Input>
            </Form.Item>
            <Form.Item
              label={t('constant:Label.IMAGE_TYPE')}
              name="type"
              {...rules}
            >
              <Input placeholder={t('constant:Placeholder.TYPE')}></Input>
            </Form.Item>
            <Form.Item
              label={t('constant:Label.VERSION')}
              name="version"
              {...rules}
            >
              <Input placeholder={t('constant:Placeholder.VERSION')}></Input>
            </Form.Item>
            <Form.Item
              label={t('constant:Label.PLATFORM')}
              name="platform"
              {...rules}
            >
              <Input placeholder={t('constant:Placeholder.PLATFORM')}></Input>
            </Form.Item>
            <Form.Item
              label={t('constant:Label.BACKEND_NAME')}
              name="backend_name"
              {...rules}
            >
              <Input placeholder={t('constant:Placeholder.BACKEND_NAME')}></Input>
            </Form.Item>

            <Row justify="center">
              <Form.Item>
                <Button htmlType="submit" type="primary" loading={loading}>
                  {t('constant:Button.CREATE')}
                </Button>
              </Form.Item>
            </Row>
          </Card>
        </Form>
      </Col>
    </Row>
  );
}
