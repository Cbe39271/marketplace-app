import { FC, useState } from 'react';
import styled from 'styled-components';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { TokenIcon } from '@components/app';
import { useAppTranslation } from '@hooks';
import { Text, Icon, Button, SearchList, ZapIcon, SearchListItem } from '@components/common';
import { formatUsd, humanize } from '@utils';

const MaxButton = styled(Button)`
  border-radius: ${({ theme }) => theme.globalRadius};
  width: min-content;
  margin-left: 0.5rem;
  text-transform: capitalize;
`;

const RatesContainer = styled.div``;

const InterestRateInputContainer = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: row;
`;

const StyledAmountInput = styled.input<{ readOnly?: boolean; error?: boolean }>`
  font-size: 2.4rem;
  font-weight: 700;
  background: transparent;
  outline: none;
  border: none;
  color: ${({ theme }) => theme.colors.txModalColors.textContrast};
  padding: 0;
  font-family: inherit;
  appearance: textfield;
  width: 80%;

  &::placeholder {
    color: ${({ theme }) => theme.colors.txModalColors.textContrast};
  }

  ${({ readOnly, theme }) =>
    readOnly &&
    `
    color: ${theme.colors.txModalColors.text};
    cursor: default;

    &::placeholder {
      color: ${theme.colors.txModalColors.text};
    }
  `}

  ${({ error, theme }) => error && `color: ${theme.colors.txModalColors.error};`}

  ${() => `
    ::-webkit-outer-spin-button,
    ::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    };
  `}
`;

const InputPercent = styled.span`
  font-size: 2.4rem;
`;

const ContrastText = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`;

const StyledText = styled(Text)`
  color: ${({ theme }) => theme.colors.txModalColors.text};
  max-width: 11rem;
`;

const TokenExtras = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 0.8rem;

  ${StyledText} {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
`;

const AmountInputContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: 0.8rem;
  column-gap: 5rem;
`;

const AmountTitle = styled(Text)`
  color: ${({ theme }) => theme.colors.txModalColors.text};
  text-overflow: ellipsis;
`;

const PositionData = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.globalRadius};
  background: ${({ theme }) => theme.colors.txModalColors.backgroundVariant};
  padding: ${({ theme }) => theme.layoutPadding};
  font-size: 1.4rem;
  flex: 1;
`;

const TokenName = styled.div`
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: center;
  font-size: 1.3rem;
  max-height: 3rem;
`;

const TokenListIcon = styled(Icon)`
  position: absolute;
  top: 0.8rem;
  right: 0.4rem;
  color: ${({ theme }) => theme.colors.txModalColors.onBackgroundVariantColor};
`;

const TokenIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const ZappableTokenButton = styled(Button)<{ selected?: boolean; viewAll?: boolean }>`
  display: block;
  font-size: 1.2rem;
  height: 2.4rem;
  padding: 0 0.8rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: -webkit-fill-available;
  // NOTE - hack fallback if fill-available is not supported
  max-width: 6.6rem;
  max-width: max-content;

  ${({ selected, theme }) =>
    selected &&
    `
      background-color: ${theme.colors.secondary};
      color: ${theme.colors.titlesVariant};
    `}
  ${({ viewAll }) =>
    viewAll &&
    `
      flex-shrink: 0;
    `}
`;

const ZappableTokensList = styled.div`
  display: flex;
  // NOTE This will make the list with css grid, an alternative to flexbox wrapping.
  // We should leave this piece of code here because I think we will need to change the style.
  // grid-template-columns: repeat(auto-fit, minmax(3rem, max-content));
  // grid-auto-flow: column;
  // flex-wrap: wrap;
  overflow: hidden;
  margin-top: 0.8rem;
  grid-gap: 0.8rem;
  width: 100%;
`;

const ZapMessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-radius: ${({ theme }) => theme.globalRadius};
  background: ${({ theme }) => theme.colors.txModalColors.backgroundVariant};
  padding: 0.8rem;
  font-size: 1.2rem;
  width: 100%;
  overflow: hidden;
`;

const TokenSelector = styled.div<{ onClick?: () => void; center?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: ${({ center }) => (center ? '100%' : '8.4rem')};
  height: ${({ center }) => (center ? '12.6rem' : undefined)};
  border-radius: ${({ theme }) => theme.globalRadius};
  background: ${({ theme }) => theme.colors.txModalColors.backgroundVariant};
  color: ${({ theme }) => theme.colors.txModalColors.textContrast};
  fill: ${({ theme }) => theme.colors.txModalColors.text};
  flex-shrink: 0;
  padding: 0 0.7rem;
  gap: 0.7rem;
  user-select: none;
  position: relative;
  ${({ onClick }) => onClick && 'cursor: pointer;'}
`;

const TokenInfo = styled.div<{ center?: boolean }>`
  display: flex;
  justify-content: ${({ center }) => (center ? 'center' : 'flex-start')};
  gap: ${({ theme }) => theme.txModal.gap};
  overflow: hidden;
`;

const StyledSearchList = styled(SearchList)`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  transform-origin: bottom left;
`;

const Header = styled.div`
  font-size: 1.6rem;
  text-transform: capitalize;
  color: ${({ theme }) => theme.colors.txModalColors.text};
`;

const scaleTransitionTime = 300;

const StyledTxTokenInput = styled(TransitionGroup)`
  display: grid;
  // min-height: 15.6rem;
  width: 100%;
  border-radius: ${({ theme }) => theme.globalRadius};
  grid-gap: 0.8rem;

  .scale-enter {
    opacity: 0;
    transform: scale(0);
    transition: opacity ${scaleTransitionTime}ms ease, transform ${scaleTransitionTime}ms ease;
  }

  .scale-enter-active {
    opacity: 1;
    transform: scale(1);
  }

  .scale-exit {
    opacity: 1;
    transform: scale(1);
  }

  .scale-exit-active {
    opacity: 0;
    transform: scale(0);
    transition: opacity ${scaleTransitionTime}ms ease, transform ${scaleTransitionTime}ms cubic-bezier(1, 0.5, 0.8, 1);
  }
`;

const amountToNumber = (amount: string) => {
  const parsedAmount = amount.replace(/[%,$ ]/g, '');
  return parseInt(parsedAmount);
};

export interface TxRateInputProps {
  frate?: string;
  drate?: string;
  headerText: string;
  amount: string;
  maxAmount?: string;
  setRateChange?: (type: string, amount: string) => void;
  // openedTokenSearch: boolean;
  // setOpenedTokenSearch: (x: bool) => void;
  // setSelectedToken: (x: string) => void;
  // selectedToken: TokenView;
  // List: TokenView[];
  // openedCreditSearch: boolean;
  // setOpenedCreditSearch: (x: bool) => void;
  // setSelectedCredit: (x: string) => void;
  // selectedCredit: TokenView;
  // List: TokenView[];
  readOnly?: boolean;
  hideAmount?: boolean;
  inputError?: boolean;
}

export const TxRateInput: FC<TxRateInputProps> = ({
  frate,
  drate,
  headerText,
  inputError,
  amount,
  setRateChange,
  // openedTokenSearch,
  // setOpenedTokenSearch,
  // selectedToken,
  // setSelectedToken,
  // tokenList,
  // openedCreditSearch,
  // setOpenedCreditSearch,
  // selectedCredit,
  // setSelectedCredit,
  // creditList,
  maxAmount,
  readOnly,
  hideAmount,
  children,
  ...props
}) => {
  const { t } = useAppTranslation('common');

  return (
    <>
      <StyledTxTokenInput {...props}>
        <>{headerText && <Header>{headerText}</Header>}</>

        {/* TODO: put in common rates e.g. LIBOR (avg. COMP,AAVE,etc.) or personal algo */}
        {/* {openedSearch && (
          <CSSTransition in={openedSearch} appear={true} timeout={scaleTransitionTime} classNames="scale">
            <StyledSearchList
              list={listItems}
              headerText={searchListHeader}
              selected={selectedItem}
              setSelected={(item) => (onSelectedTokenChange ? onSelectedTokenChange(item.id) : undefined)}
              onCloseList={() => setOpenedSearch(false)}
            />
          </CSSTransition>
        )} */}

        {/* NOTE Using fragments here because: https://github.com/yearn/yearn-finance-v3/pull/565 */}
        <>
          <PositionData>
            <AmountInputContainer>
              <RatesContainer>
                <AmountTitle ellipsis>
                  {'Drawn Down Rate' || t('components.transaction.deposit.rates-title')}
                </AmountTitle>
                <InterestRateInputContainer>
                  <StyledAmountInput
                    value={frate}
                    onChange={setRateChange ? (e) => setRateChange('f', e.target.value) : undefined}
                    placeholder={'15.00'}
                    readOnly={readOnly}
                    error={inputError}
                    type="number"
                    aria-label={headerText}
                  />
                  <InputPercent>%</InputPercent>
                </InterestRateInputContainer>
              </RatesContainer>
              <RatesContainer>
                <AmountTitle ellipsis>{'Facility Rate' || t('components.transaction.deposit.rates-title')}</AmountTitle>
                <InterestRateInputContainer>
                  <StyledAmountInput
                    value={drate}
                    onChange={setRateChange ? (e) => setRateChange('d', e.target.value) : undefined}
                    placeholder={'25.00'}
                    readOnly={readOnly}
                    error={inputError}
                    type="number"
                    aria-label={headerText}
                  />
                  <InputPercent>%</InputPercent>
                </InterestRateInputContainer>
              </RatesContainer>
            </AmountInputContainer>
          </PositionData>
        </>
      </StyledTxTokenInput>
    </>
  );
};
