import cx from 'classnames';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsGrid3X3 } from 'react-icons/bs';
import { HiChevronDown } from 'react-icons/hi';
import { Button, Checkbox, CheckboxGroup, Popover, Whisper } from 'rsuite';
import { saveLocalTableColumns } from '~app/features/pos/utils';
import { useTableColumnsStore } from '~app/utils/hooks';

type Props = {
  tableKey: string;
  defaultColumns: Column[];
};

const TableColumnsControl = ({ tableKey, defaultColumns }: Props) => {
  const { t } = useTranslation();
  const whisperRef = useRef<ExpectedAny>(null);
  const [columns, setStore] = useTableColumnsStore((store) => store?.table_columns?.[tableKey]);

  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<string[]>([]);

  const handleConfirm = () => {
    setStore((store) => {
      const newColumns = [...defaultColumns].map((item) => {
        if (values.includes(item.id)) return { ...item, checked: true };
        return { ...item, checked: false };
      });
      const newTableColumns = { ...store.table_columns };
      newTableColumns[tableKey] = newColumns;
      saveLocalTableColumns(newTableColumns);
      return { ...store, table_columns: newTableColumns };
    });
    whisperRef.current.close();
  };

  const handleInitValue = useCallback(() => {
    const values: string[] = [];
    if (!columns) {
      defaultColumns.forEach((item) => {
        if (item.checked) values.push(item.id);
      });
    } else {
      columns.forEach((item) => {
        if (item.checked) values.push(item.id);
      });
    }
    setValues(values);
  }, [columns, defaultColumns]);

  useEffect(() => handleInitValue(), []);

  return (
    <Whisper
      ref={whisperRef}
      placement="autoVerticalEnd"
      trigger="click"
      onOpen={() => setOpen(true)}
      onClose={() => {
        setOpen(false);
        handleInitValue();
      }}
      speaker={({ left, top, className }, ref) => {
        return (
          <Popover ref={ref} className={cx('!pw-rounded-none', className)} style={{ left, top }} arrow={false} full>
            <div className="pw-p-4 pw-pl-3 pw-bg-neutral-white pw-table-columns-control">
              <CheckboxGroup
                className="!pw-grid pw-grid-cols-2 pw-items-center"
                value={values}
                onChange={(value) => setValues(value as string[])}
              >
                {defaultColumns.map((item) => {
                  return (
                    <Checkbox key={item.id} value={item.id} className="pw-col-span-1">
                      <span className="pw-text-sm pw-text-neutral-primary">{t(item.label)}</span>
                    </Checkbox>
                  );
                })}
              </CheckboxGroup>
            </div>
            <div className="pw-py-3 pw-px-4 pw-flex pw-justify-end pw-gap-x-4 pw-shadow-inner">
              <Button
                type="button"
                className="pw-button-secondary !pw-py-1.5 !pw-px-4"
                onClick={() => whisperRef.current?.close()}
              >
                <span className="pw-text-sm pw-font-bold pw-text-neutral-primary">{t('common:back')}</span>
              </Button>
              <Button type="button" className="pw-button-primary !pw-py-1.5 !pw-px-4" onClick={handleConfirm}>
                <span className="pw-text-sm pw-font-bold pw-text-neutral-white">{t('common:modal-confirm')}</span>
              </Button>
            </div>
          </Popover>
        );
      }}
    >
      <Button appearance="primary" size="lg">
        <div className="pw-flex pw-items-center pw-justify-between pw-gap-x-2">
          <BsGrid3X3 size={20} />
          <HiChevronDown
            size={20}
            className={cx('pw-transition-all pw-duration-100 pw-ease-in', {
              'pw-rotate-180': open,
            })}
          />
        </div>
      </Button>
    </Whisper>
  );
};

export default memo(TableColumnsControl);
