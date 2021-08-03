import { LoadingOutlined } from '@ant-design/icons';
import {
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Spin,
  Typography,
} from 'antd';
import { Status } from 'app/containers/Orders/constants';
import { selectRegion, selectRegions } from 'app/containers/Orders/selectors';
import { actions } from 'app/containers/Orders/slice';
import { MODE_EDIT } from 'app/containers/Users/constants';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const { Option } = Select;
const { Text } = Typography;

const selectorMoney = (
  <Form.Item name="money" noStyle>
    <Select style={{ width: 100 }} defaultValue="vnd">
      <Option value="vnd">VND</Option>
      <Option value="usd">USD</Option>
    </Select>
  </Form.Item>
);

interface Props {
  loading?: boolean;
  handleBlurContract?: any;
  mode?: string;
}

export default function ContractFormBase({
  loading,
  handleBlurContract,
  mode,
}: Props) {
  const { t } = useTranslation(['translation', 'constant']);
  const dispatch = useDispatch();

  const regions = useSelector(selectRegions);
  const region = useSelector(selectRegion);

  const optionRegion = regions.map(region => (
    <Option value={region.id} key={region.id}>
      {region.name}
    </Option>
  ));

  const onSelect = value => {
    dispatch(actions.setRegion(value));
  };

  return (
    <>
      <Form.Item
        name="contract_code"
        label={t('Label.CONTRACT_NO')}
        rules={[
          {
            required: true,
            message: t('Field_Message.CONTRACT_NO'),
            whitespace: true,
          },
        ]}
      >
        <Input
          placeholder={t('Placeholder.CONTRACT_NO')}
          onBlur={handleBlurContract}
          suffix={loading ? <Spin indicator={antIcon} /> : null}
        />
      </Form.Item>
      <Form.Item initialValue={region} name="region_id" label={t('Title.AREA')}>
        <Select
          value={region}
          style={{ width: 80 }}
          onSelect={onSelect}
          loading={loading}
        >
          {optionRegion}
        </Select>
      </Form.Item>
      <Form.Item
        initialValue="COMPUTE"
        name="service_type"
        label={t('Field_Message.SERVICE')}
      >
        <Select>
          <Option value="COMPUTE">COMPUTE</Option>
          <Option value="COMPUTE-GPU">COMPUTE-GPU</Option>
        </Select>
      </Form.Item>
      <Form.Item
        initialValue="BUY"
        name="order_type"
        label={t('Label.ORDER_TYPE')}
      >
        <Select>
          <Option value="TRIAL">{t('Button.TRIAL')}</Option>
          <Option value="BUY">{t('Button.BUY')}</Option>
          <Option value="EXPIRE">{t('Button.EXTEND')}</Option>
          <Option value="EXTEND">{t('Button.UPGRADE')}</Option>
        </Select>
      </Form.Item>
      {/* <Form.Item
        name="duration"
        label={t('Label.CONTRACT_DURATION')}
        rules={[
          { required: true, message: t('Field_Message.DURATION_INVALID') },
        ]}
      >
        <InputNumber
          style={{ width: '9rem' }}
          disabled
          parser={(value: any) => value.replace(/[ ngày]\s?|(,*)/g, '')}
          min={0}
          formatter={value =>
            `${value} ngày`.replace(/\B(?=(\d{3})+(?!\d))/g, '')
          }
        />
      </Form.Item> */}
      <Form.Item
        name="start_at"
        label={t('Label.START_AT')}
        rules={[
          {
            type: 'object',
            required: true,
            message: t('Field_Message.SELECT_TIME'),
          },
        ]}
      >
        <DatePicker format="YYYY-MM-DD" />
      </Form.Item>
      <Form.Item
        name="end_at"
        label={t('Label.END_AT')}
        rules={[
          {
            type: 'object',
            required: true,
            message: t('Field_Message.SELECT_TIME'),
          },
        ]}
      >
        <DatePicker format="YYYY-MM-DD" />
      </Form.Item>
      <Form.Item
        name="price"
        label={t('Label.CONTRACT_TOTAL')}
        rules={[{ required: true, message: t('Field_Message.CONTRACT_TOTAL') }]}
      >
        {/* <Input
          addonBefore={selectorMoney}
          type="number"
          min={0}
          style={{ width: '100%' }}
          placeholder="Giá trị đơn hàng"
        /> */}
        <InputNumber
          style={{ width: '50%' }}
          min={0}
          formatter={value =>
            `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          }
          parser={value => String(value).replace(/\$\s?|(,*)/g, '')}
        />
      </Form.Item>
      {/* <Form.Item
        initialValue="PAY_COMPLETED"
        name="status"
        label={t('Label.ORDER_STATUS')}
      >
        <Select>
          {Object.keys(Status).map(item => (
            <Option key={item} value={item}>
              {item}
            </Option>
          ))}
        </Select>
      </Form.Item> */}
      <Form.Item
        initialValue="COD"
        name="pmt_type"
        label={t('Label.PAYMENT_TYPE')}
      >
        <Select>
          <Option value="COD">COD</Option>
          <Option value="MONTHLY">Monthly</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="sale_care"
        label={t('Title.SALE_CARE')}
        rules={[
          {
            type: 'email',
            message: t('Invalid_Pattern.EMAIL'),
          },
          {
            required: true,
            message: t('Field_Message.REQUIRED_FIELD'),
            whitespace: true,
          },
        ]}
      >
        <Input placeholder={t('constant:Placeholder.EMAIL')} />
      </Form.Item>
      <Text>Co-Sale:</Text>
      <Row>
        <Col
          span={mode === MODE_EDIT ? 22 : 24}
          offset={mode === MODE_EDIT ? 2 : 0}
        >
          <Form.Item
            labelAlign="right"
            name="department"
            label={t('Title.CENTER')}
          >
            <Input placeholder={t('Title.CENTER')} />
          </Form.Item>
          <Form.Item
            labelAlign="right"
            name="sale"
            label={t('constant:Label.EMAIL')}
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
}
