// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useConnect } from '../../contexts/Connect';
import { ReactComponent as TalismanSVG } from '../../img/talisman_icon.svg';
import { ReactComponent as PolkadotJSSVG } from '../../img/dot_icon.svg';
import { Separator } from './Wrapper';
import { useModal } from '../../contexts/Modal';

export const Wallets = (props: any) => {
  const { setSection } = props;

  const modal = useModal();
  const {
    extensions,
    activeWallet,
    activeAccount,
    walletErrors,
    connectToWallet,
    disconnectFromWallet,
  }: any = useConnect();

  let { accounts } = useConnect();

  // remove active account from connect list
  accounts = accounts.filter((item: any) => item.address !== activeAccount);

  // trigger modal resize on extensions change
  useEffect(() => {
    modal.setResize();
  }, [extensions]);

  const handleWalletConnect = async (name: string) => {
    if (activeWallet !== name) {
      await connectToWallet(name);
    }
    setSection(1);
  };

  // remove active wallet from extensions list
  const activeExtension =
    extensions.find((wallet: any) => wallet.extensionName === activeWallet) ??
    null;
  const extensionsList = extensions.filter(
    (wallet: any) => wallet.extensionName !== activeWallet
  );

  return (
    <>
      <h2>Select Wallet</h2>

      {activeWallet !== null && (
        <button
          type="button"
          className="item"
          onClick={() => {
            disconnectFromWallet();
          }}
        >
          <div>
            {activeWallet === 'talisman' && (
              <TalismanSVG width="1.5rem" height="1.5rem" />
            )}
            {activeWallet === 'polkadot-js' && (
              <PolkadotJSSVG width="1.5rem" height="1.5rem" />
            )}
            &nbsp; {activeWallet}
          </div>
          <div className="danger">Disconnect</div>
        </button>
      )}
      <Separator />

      {activeExtension !== null && (
        <button
          type="button"
          className="item"
          key={`wallet_${activeExtension.extensionName}`}
          onClick={() => {
            handleWalletConnect(activeExtension.extensionName);
          }}
        >
          <div>
            {activeExtension.extensionName === 'talisman' && (
              <TalismanSVG width="1.5rem" height="1.5rem" />
            )}
            {activeExtension.extensionName === 'polkadot-js' && (
              <PolkadotJSSVG width="1.5rem" height="1.5rem" />
            )}
            &nbsp; {activeExtension.extensionName}
          </div>
          <div className="neutral">
            {activeWallet === activeExtension.extensionName && 'Accounts'}
            <FontAwesomeIcon
              icon={faChevronRight}
              transform="shrink-5"
              className="icon"
            />
          </div>
        </button>
      )}

      {extensionsList.map((wallet: any) => {
        const { extensionName, title } = wallet;
        const error = walletErrors[wallet.name] ?? null;
        const disabled = activeWallet !== wallet.name && activeWallet !== null;

        return (
          <button
            type="button"
            className="item"
            key={`wallet_${extensionName}`}
            disabled={disabled}
            onClick={() => {
              handleWalletConnect(extensionName);
            }}
          >
            <div>
              {extensionName === 'talisman' && (
                <TalismanSVG width="1.5rem" height="1.5rem" />
              )}
              {extensionName === 'polkadot-js' && (
                <PolkadotJSSVG width="1.5rem" height="1.5rem" />
              )}
              &nbsp; {error || title}
            </div>
            <div className="neutral">
              <FontAwesomeIcon
                icon={faChevronRight}
                transform="shrink-5"
                className="icon"
              />
            </div>
          </button>
        );
      })}
    </>
  );
};
