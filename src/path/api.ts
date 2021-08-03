// const root = 'http://172.16.0.61';
const root = 'https://api.fptvds.vn';
// anh Khanh
// const auth = `http://192.168.206.10:5000/api/v1`;
// const vdc = `http://192.168.206.65:5000/api/v1`;
// const order = `http://192.168.206.10:9001/api/v1`;

export const cms_path = 'https://cms.fptvds.vn';
const auth_api_path = `${root}/auth`;
const order_api_path = `${root}/order`;
const vdc_api_path = `${root}/vdc`;

const path = {
  config: {
    config: `${auth_api_path}/configs`,
  },
  cms: {
    navbars: `${cms_path}/navbars`,
    metas: `${cms_path}/metas`,
    banners: `${cms_path}/banner-mains`,
    contacts: `${cms_path}/contacts`,
    des_services: `${cms_path}/description-services`,
    customers: `${cms_path}/customers`,
    benefit_services: `${cms_path}/benefit-services`,
    features: `${cms_path}/features`,
  },
  auth: {
    login: `${auth_api_path}/login`,
    activate: `${auth_api_path}/activate`,
    forgot_password: `${auth_api_path}/forget`,
    reset_password: `${auth_api_path}/recovery`,
    refresh_token: `${auth_api_path}/refresh`,
  },
  users: {
    users: `${auth_api_path}/users`,
    user: `${auth_api_path}/user`,
    delete: `${auth_api_path}/user/delete`,
    create_two_factors: `${auth_api_path}/user/two-factors`,
    disable_two_factors: `${auth_api_path}/user/two-factor`,
    forgot_qrcode: `${auth_api_path}/two-factor/recovery`,
    register: `${auth_api_path}/register`,
  },
  histories: {
    histories: `${auth_api_path}/histories`,
    history: `${auth_api_path}/history`,
  },
  orders: {
    orders: `${order_api_path}/orders`,
    order: `${order_api_path}/order`,
    transactions: `${order_api_path}/order/:orderID/transactions`,
    transaction: `${order_api_path}/order/:orderID/transaction`,
    regions: `${order_api_path}/regions`,
    region: `${order_api_path}/region/:regionId`,
    instance: `${order_api_path}/products?condition=is_base__eq__1`,
    service: `${order_api_path}/products?condition=is_base__eq__0`,
    os: `${order_api_path}/products?condition=type__eq__OS`,
    vmCfg: `${order_api_path}/order/:orderID/idx/:orderIDX`,
  },
  computes: {
    computes: `${vdc_api_path}/computes`,
    computesError: `${vdc_api_path}/computes?condition=status__eq__ERROR`,
    compute: `${vdc_api_path}/compute/:computeId`,
    computeAction: `${vdc_api_path}/compute/:computeId/action`,
    ssh_key: `${vdc_api_path}/ssh_key`,
    vnc: `${vdc_api_path}/compute/:computeId/console`,
    snapshots: `${vdc_api_path}/compute/:computeId/snapshots`,
    snapshot: `${vdc_api_path}/compute/:computeId/snapshot`,
    secgroups: `${vdc_api_path}/compute/:computeId/secgroups`,
    secgroup: `${vdc_api_path}/compute/:computeId/secgroup/:secgroupId`,
    rules: `${vdc_api_path}/compute/:computeId/rules`,
    rule: `${vdc_api_path}/compute/:computeId/rule/:ruleId`,
    backupJobs: `${vdc_api_path}/compute/:computeId/backup/jobs`,
    backupJob: `${vdc_api_path}/compute/:computeId/backup/job`,
    backupFiles: `${vdc_api_path}/compute/:computeId/backup/files`,
    backupFile: `${vdc_api_path}/compute/:computeId/backup/file/:backupId`,
    keyPairs: `${vdc_api_path}/keypairs`,
    keyPair: `${vdc_api_path}/keypair`,
    regions: `${vdc_api_path}/regions`,
    region: `${vdc_api_path}/region/:regionId`,
    schedules: `${vdc_api_path}/compute/:computeId/jobs`,
    schedule: `${vdc_api_path}/compute/:computeId/job`,
    monitor: `${vdc_api_path}/compute/:computeId/statistic?type=:type&step=:step&start=:start&end=:end`,
    histories: `${vdc_api_path}/histories?compute_id=:computeId`,
    zones: `${vdc_api_path}/availability-zones?region_id=:regionId`,
  },
  flavor: {
    flavors: `${vdc_api_path}/flavors`,
    flavor: `${vdc_api_path}/flavor`,
  },
  products: {
    units: `${order_api_path}/units`,
    unit: `${order_api_path}/unit/:unitId`,
    products: `${order_api_path}/products`,
    product: `${order_api_path}/product/:productId`,
    packages: `${order_api_path}/packages`,
    package: `${order_api_path}/package/:packageId`,
    package_products: `${order_api_path}/package/:packageId/products`,
    package_product: `${order_api_path}/package/:packageId/product/:productId`,
  },
  networks: {
    networks: `${vdc_api_path}/networks`,
    network: `${vdc_api_path}/network`,
    routers: `${vdc_api_path}/routers`,
    router: `${vdc_api_path}/router`,
    routerInterfaces: `${vdc_api_path}/router/:routerId/interfaces`,
    routerInterface: `${vdc_api_path}/router/:routerId/interface`,
    secgroups: `${vdc_api_path}/secgroups`,
    secgroup: `${vdc_api_path}/secgroup`,
    secgroupRules: `${vdc_api_path}/secgroup/:secgroupId/rules`,
    secgroupRule: `${vdc_api_path}/secgroup/:secgroupId/rule`,
    subnets: `${vdc_api_path}/network/:networkId/subnets`,
    subnet: `${vdc_api_path}/network/:networkId/subnet`,
  },
  loadBalancer: {
    lbs: `${vdc_api_path}/lbaas/lbs`,
    lb: `${vdc_api_path}/lbaas/lb/:lbId`,
    listeners: `${vdc_api_path}/lbaas/listeners`,
    listener: `${vdc_api_path}/lbaas/listener/:listenerId`,
    pools: `${vdc_api_path}/lbaas/pools`,
    pool: `${vdc_api_path}/lbaas/pool/:poolId`,
    poolMembers: `${vdc_api_path}/lbaas/pool/:poolId/members`,
    poolMember: `${vdc_api_path}/lbaas/pool/:poolId/member/:memberId`,
    monitors: `${vdc_api_path}/lbaas/healthmonitors`,
    monitor: `${vdc_api_path}/lbaas/healthmonitor/:monitorId`,
    l7Policies: `${vdc_api_path}/lbaas/l7policies`,
    l7Policy: `${vdc_api_path}/lbaas/l7policy/:l7PolicyId`,
    l7Rules: `${vdc_api_path}/lbaas/l7policy/:l7PolicyId/l7rules`,
    l7Rule: `${vdc_api_path}/lbaas/l7policy/:l7PolicyId/l7rule/:l7RuleId`,
  },
};

export default path;
