import { memo, useEffect, useRef, useState } from 'react';
import cx from 'classnames';
import { Button, Checkbox, Popover, Whisper } from 'rsuite';
import { useTranslation } from 'react-i18next';
import { BsGear } from 'react-icons/bs';
import { HiChevronDown } from 'react-icons/hi';
import { useClickAway } from 'react-use';
import { ContactAnalytic } from '~app/utils/constants';
import { CONTACT_ANALYTIC_OPTIONS } from '~app/configs';
import { useContactStore } from '~app/features/contacts/hooks';
import { ContactAnalyticFilter, contactAnalyticData } from '~app/features/contacts/lists/config';

const MIN_OPTIONS_ANALYTICS = 1,
  MAX_OPTIONS_ANALYTICS = 4;

type Props = {
  filterValues: string;
  onChange(value: ExpectedAny): void;
};

const AnalyticOptionSelect = ({ filterValues, onChange }: Props) => {
  const { t } = useTranslation('contacts-table');
  const whisperRef = useRef<ExpectedAny>();
  const contentRef = useRef<ExpectedAny>();
  const [options, setOptions] = useContactStore((store) => store.analytics_options);
  const [optionsTemp, setOptionsTemp] = useState<ContactAnalyticFilter[]>(options);

  useEffect(() => {
    const localData = localStorage.getItem(CONTACT_ANALYTIC_OPTIONS);
    if (!localData) {
      const defaultOptions = contactAnalyticData.slice(0, 4);
      setOptionsTemp(defaultOptions);
      setOptions((prevState) => ({ ...prevState, analytics_options: defaultOptions }));
      localStorage.setItem(CONTACT_ANALYTIC_OPTIONS, JSON.stringify(defaultOptions));
      return;
    }
    const localOptions = JSON.parse(localData) as ContactAnalyticFilter[];
    setOptionsTemp(localOptions);
    setOptions((prevState) => ({ ...prevState, analytics_options: localOptions }));
  }, []);

  const handleChangeOption = (option: ContactAnalyticFilter) => {
    const existed = optionsTemp.findIndex((o) => o.value === option.value);
    if (existed !== -1) {
      return setOptionsTemp(
        optionsTemp.length > MIN_OPTIONS_ANALYTICS ? optionsTemp.filter((o) => o.value !== option.value) : optionsTemp,
      );
    }
    setOptionsTemp(optionsTemp.length === MAX_OPTIONS_ANALYTICS ? optionsTemp : [...optionsTemp, option]);
  };

  const handleConfirm = () => {
    localStorage.setItem(CONTACT_ANALYTIC_OPTIONS, JSON.stringify(optionsTemp.sort((a, b) => a.priority - b.priority)));
    setOptions((prevState) => ({ ...prevState, analytics_options: optionsTemp }));
    const existedOption = optionsTemp.some((option) => option.value === filterValues);
    !existedOption && onChange('');
  };

  useClickAway(contentRef, () => {
    setOptionsTemp(options);
  });

  return (
    <>
      <Whisper
        trigger="click"
        placement="autoVerticalEnd"
        ref={whisperRef}
        speaker={({ onClose, left, top, className }, ref) => {
          return (
            <Popover ref={ref} style={{ left, top }} arrow={false} className={className}>
              <div ref={contentRef}>
                <div className="pw-px-2">
                  <h6 className="pw-text-lg pw-mb-1">{t('display_setting')}</h6>
                  <span className="pw-text-xs pw-text-neutral-placeholder pw-font-semibold">
                    {t('display_setting_description')}
                  </span>
                </div>
                {contactAnalyticData.map((option, index) => (
                  <div
                    key={option.value}
                    className={cx(
                      'pw-flex pw-items-center pw-justify-between pw-p-2 pw-border-b pw-border-neutral-divider pw-cursor-pointer',
                      {
                        'pw-border-b-0': index + 1 === contactAnalyticData.length,
                      },
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChangeOption(option);
                    }}
                  >
                    <span className="pw-text-base">{t(`analytic.${ContactAnalytic[option.value].name}`)}</span>
                    <Checkbox
                      checked={optionsTemp.some((o) => o.value === option.value)}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChangeOption(option);
                      }}
                    />
                  </div>
                ))}
                <Button
                  appearance="primary"
                  size="lg"
                  className="pw-w-full pw-shadow-revert !pw-font-bold"
                  onClick={() => {
                    handleConfirm();
                    onClose();
                  }}
                >
                  {t('common:modal-confirm')}
                </Button>
              </div>
            </Popover>
          );
        }}
      >
        <Button appearance="primary" size="lg">
          <div className="pw-flex pw-items-center pw-justify-between pw-gap-x-2">
            <BsGear size={20} />
            <HiChevronDown size={20} />
          </div>
        </Button>
      </Whisper>
    </>
  );
};

export default memo(AnalyticOptionSelect);
