// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { useNetworkMetrics } from 'contexts/Network';
import useEraTimeLeft from 'library/Hooks/useEraTimeLeft';
import { useTimeLeft } from 'library/Hooks/useTimeLeft';
import { fromNow } from 'library/Hooks/useTimeLeft/utils';
import { Timeleft } from 'library/StatBoxList/Timeleft';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { humanNumber } from 'Utils';

const ActiveEraStatBox = () => {
  const { status: connectionStatus } = useApi();
  const { t } = useTranslation('pages');
  const { metrics } = useNetworkMetrics();
  const { activeEra } = metrics;
  const {
    timeleft: eraTimeLeft,
    percentSurpassed,
    percentRemaining,
  } = useEraTimeLeft();

  const { timeleft, setFromNow } = useTimeLeft({
    refreshInterval: 60,
    refreshCallback: () => eraTimeLeft,
  });

  // re-set timer on era change (also covers network change).
  useEffect(() => {
    setFromNow(fromNow(eraTimeLeft));
  }, [connectionStatus, activeEra]);

  const params = {
    label: t('overview.timeRemainingThisEra'),
    timeleft: timeleft.formatted,
    graph: {
      value1: activeEra.index === 0 ? 0 : percentSurpassed,
      value2: activeEra.index === 0 ? 100 : percentRemaining,
    },
    tooltip: `Era ${humanNumber(activeEra.index)}` ?? undefined,
    helpKey: 'Era',
  };
  return <Timeleft {...params} />;
};

export default ActiveEraStatBox;
