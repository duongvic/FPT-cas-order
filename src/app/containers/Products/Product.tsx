import { Button, Card, Col, Form, Input, Row, Switch } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router';
import {
  selectLoading,
  selectNotice,
  selectParams,
  selectProduct,
} from './selectors';
import { actions } from './slice';

export default function Product() {
  const [isChecked, setIsChecked]: any = useState(null);

  const product = useSelector(selectProduct);
  const loading = useSelector(selectLoading);
  const notice = useSelector(selectNotice);
  const paramsRedux = useSelector(selectParams);

  const match: any = useRouteMatch();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { t } = useTranslation(['constant', 'translation']);
  const history = useHistory();

  const layout = {
    labelCol: { lg: 6, md: 4, xs: 6 },
    wrapperCol: { lg: 6, md: 8, xs: 12 },
  };

  useEffect(() => {
    if (!product) {
      dispatch(actions.setData({ productId: match.params.productId }));
      dispatch(actions.loadProduct());
    }
  }, []);

  useEffect(() => {
    if (notice === t('translation:Message.UPDATE_PRODUCT_SUCCESS')) {
      if (paramsRedux) {
        dispatch(actions.queryProducts());
      }
      history.push('/dashboard/products');
    }
  }, [notice]);

  useEffect(() => {
    if (product) {
      let newProduct = {
        ...product,
        resource_type: product.type,
      };
      delete newProduct.Type;
      newProduct = { ...newProduct, ...product.data };
      form.setFieldsValue({
        ...newProduct,
      });
      setIsChecked(product?.is_base);
    }
  }, [product]);

  const onFinish = value => {
    let data;
    data = {
      name: value.name,
      cn: value.cn,
      type: value.resource_type,
      data: {
        arch: value.arch,
        type: value.type,
        version: value.version,
        platform: value.platform,
        backend_name: value.backend_name,
      },
    };
    dispatch(
      actions.setData({ data: data, productId: match.params.productId }),
    );
    dispatch(actions.updateProduct());
  };
  return (
    <Form
      form={form}
      {...layout}
      layout="horizontal"
      labelAlign="left"
      scrollToFirstError={true}
      onFinish={onFinish}
    >
      <Card bordered={false} style={{ height: '100%', minHeight: '76vh' }}>
        <Form.Item name="name" label={t('Label.NAME')}>
          <Input></Input>
        </Form.Item>
        <Form.Item name="cn" label={t('Label.CN')}>
          <Input></Input>
        </Form.Item>
        <Form.Item name="resource_type" label={t('Label.RESOURCE_TYPE')}>
          <Input></Input>
        </Form.Item>
        <Form.Item name="price" label={t('Label.PRICE')}>
          <Input disabled></Input>
        </Form.Item>
        {product?.cn === 'image' && (
          <>
            <Form.Item name="arch" label={t('Label.ARCH')}>
              <Input></Input>
            </Form.Item>
            <Form.Item name="type" label={t('Label.IMAGE_TYPE')}>
              <Input></Input>
            </Form.Item>
            <Form.Item name="version" label={t('Label.VERSION')}>
              <Input></Input>
            </Form.Item>
            <Form.Item name="platform" label={t('Label.PLATFORM')}>
              <Input></Input>
            </Form.Item>
            <Form.Item name="backend_name" label={t('Label.BACKEND_NAME')}>
              <Input></Input>
            </Form.Item>
          </>
        )}
        <Form.Item name="is_base" label={t('Label.IS_BASE')}>
          <Switch
            checked={isChecked}
            disabled
            // onChange={() => setIsChecked(!isChecked)}
          ></Switch>
        </Form.Item>
        <Col span={12}>
          <Row justify="center">
            <Form.Item htmlFor="submit">
              <Button type="primary" htmlType="submit" loading={loading}>
                {t('Button.UPDATE')}
              </Button>
            </Form.Item>
          </Row>
        </Col>
      </Card>
    </Form>
  );
}
