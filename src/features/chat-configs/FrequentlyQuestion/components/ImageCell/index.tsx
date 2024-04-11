import { memo } from 'react';
import { PlaceholderImage } from '~app/components';

type Props = {
  rowData: FrequentlyQuestion;
};

const ImageCell = ({ rowData }: Props): JSX.Element => {
  return (
    <div className="pw-flex pw-items-center">
      {rowData.answer.split(',').map((image) => (
        <div key={image} className="pw-w-10 pw-min-w-fit pw-h-10 pw-mr-2">
          <PlaceholderImage
            src={image}
            alt={image}
            className="pw-bg-cover pw-rounded-md pw-w-10 pw-h-10 pw-object-cover"
          />
        </div>
      ))}
    </div>
  );
};
export default memo(ImageCell);
