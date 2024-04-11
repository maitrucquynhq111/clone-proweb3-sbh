import cx from 'classnames';
import { PlaceholderImage } from '~app/components';

type Props = {
  note: string;
  media: string[];
};

const Note = ({ note, media }: Props): JSX.Element => {
  return (
    <>
      {note && <span className="pw-text-sm pw-text-neutral-placeholder">{note}</span>}
      {media.length > 0 && (
        <div className={cx('pw-w-20 pw-h-20 pw-flex', { 'pw-mt-6': !!note })}>
          {media.map((image) => (
            <PlaceholderImage key={image} src={image} alt={image} className="pw-w-full pw-h-full pw-mr-4" />
          ))}
        </div>
      )}
    </>
  );
};

export default Note;
