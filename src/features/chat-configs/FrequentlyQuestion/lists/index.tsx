import { useEffect, useRef } from 'react';
import { columnOptions } from './config';
import { ModalPlacement, ModalSize, ModalTypes } from '~app/modals/types';
import { Table } from '~app/components';
import { useGetFrequentlyQuestion } from '~app/services/queries';

type ModalData = {
  modal: ModalTypes;
  size?: ModalSize;
  placement?: ModalPlacement;
  pageId: string;
  suggestMessageEnable: boolean;
  detail: FrequentlyQuestion;
  questions: FrequentlyQuestion[];
};

type Props = {
  activePage: Page | null;
  questions: FrequentlyQuestion[];
  setModalData: (value: ModalData | null) => void;
};

const FrequentlyQuestionsList = ({ activePage, questions, setModalData }: Props): JSX.Element => {
  const tableRef = useRef<ExpectedAny>();

  useEffect(() => {
    if (activePage) {
      tableRef?.current?.setVariables({ business_has_page_id: activePage.id });
    }
  }, [activePage]);

  const onRowClick = (rowData: ExpectedAny) => {
    setModalData({
      modal: ModalTypes.FrequentlyQuestionDetails,
      placement: ModalPlacement.Right,
      size: ModalSize.Xsmall,
      pageId: activePage?.id || '',
      suggestMessageEnable: activePage?.business_has_page_setting?.suggest_message_enable || false,
      detail: rowData,
      questions,
    });
  };

  return (
    <div className="pw-mt-4">
      <Table<ExpectedAny, ExpectedAny>
        ref={tableRef}
        columnOptions={columnOptions({ onRowClick })}
        query={useGetFrequentlyQuestion}
        variables={{
          business_has_page_id: activePage?.id || '',
        }}
        onRowClick={onRowClick}
        showPagination={false}
        wordWrap="break-word"
      />
    </div>
  );
};
export default FrequentlyQuestionsList;
