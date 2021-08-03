import { Button, Card, Col, Row, Space } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import InfoInstance from './InfoInstance.jsx';
import OptionServices from './OptionServices.jsx';
import ReviewInstance from './ReviewInstance';
import {
  selectCurrentOs,
  selectInstance,
  selectOs,
  selectProducts,
  selectReview,
  selectService,
} from './selectors';
import { actions } from './slice';
import './styles.less';
import empty from 'is-empty';
import { MODE_EXTEND } from '../Users/constants';

interface Props {
  mode?: string;
}

export default function SetPackage({ mode }: Props) {
  const dispatch = useDispatch();
  const { t } = useTranslation(['translation', 'constant']);

  const instance = useSelector(selectInstance);
  const service = useSelector(selectService);
  const currentOs = useSelector(selectCurrentOs);
  const review = useSelector(selectReview);
  const os = useSelector(selectOs);
  const products = useSelector(selectProducts);

  const handleClickAdd = () => {
    const OS = { ...os.find(item => item.name === currentOs) };
    let items = [...products, [...instance, ...service]];
    if (!empty(OS)) {
      OS.quantity = 1;
      OS.unit = OS.unit?.name;
      items = [...products, [...instance, ...service, OS]];
    }

    dispatch(actions.setProducts(items));

    const compute = { OS: currentOs };
    instance.forEach(item => {
      compute[item.name] = item.quantity;
    });
    service.forEach(item => {
      compute[item.name] = item.quantity;
    });
    dispatch(actions.setReview([...review, compute]));
  };
  return (
    <>
      <Row gutter={mode === MODE_EXTEND ? 0 : 4} style={{ marginBottom: 4 }}>
        <Col span={12}>
          <Card
            title={t('Title.INSTANCE_INFO')}
            bordered={false}
            // style={{ height: '100%' }}
          >
            <InfoInstance />
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title={t('Title.EXTEND_SERVICE')}
            bordered={false}
            style={{ height: '100%' }}
          >
            <OptionServices />
          </Card>
        </Col>
      </Row>
      <Row justify="center" style={{ margin: '16px 0px' }}>
        <Space>
          <Button
            disabled={mode === MODE_EXTEND ? products.length > 0 : false}
            type="primary"
            onClick={handleClickAdd}
          >
            {t('constant:Button.ADD')}
          </Button>
        </Space>
      </Row>
      <Card
        title={t('Title.INSTANCE_INFO')}
        headStyle={{ textAlign: 'center' }}
        bordered={false}
        style={{ height: '100%' }}
      >
        <ReviewInstance mode={mode} />
      </Card>
    </>
  );
}
