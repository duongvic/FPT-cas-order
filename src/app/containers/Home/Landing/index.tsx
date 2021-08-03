import { selectAccount } from 'app/containers/Auth/selectors';
import { selectRegions } from 'app/containers/Orders/selectors';
import { actions } from 'app/containers/Orders/slice';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Banner from './Banner';
import Content0 from './Content0';
import Content1 from './Content1';
import Content2 from './Content2';
import Content3 from './Content3';

export function LandingPage() {
  useEffect(() => {
    if (window.location.hash) window.location.href = window.location.hash;
    else window.onbeforeunload = () => window.scrollTo(0, 0);
  }, []);
  const regions = useSelector(selectRegions);

  const dispatch = useDispatch();

  useEffect(() => {
    if (regions.length === 0) {
      dispatch(actions.getRegions());
    }
  }, [dispatch]);
  return (
    <>
      <Banner id="Banner0_1" key="Banner0_1" />
      <Content0 id="Content0_0" key="Content0_0" />
      <Content1 />
      <Content2 />
      <Content3 />
    </>
  );
}
