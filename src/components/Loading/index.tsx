import { Loader } from 'rsuite';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

type LoadingProps = {
  backdrop?: boolean;
  content?: string | React.ReactNode;
  vertical?: boolean;
  className?: string;
  size?: 'lg' | 'md' | 'sm' | 'xs';
};

const Loading = ({ backdrop, content, className = '', vertical = true, size = 'xs' }: LoadingProps): JSX.Element => {
  const { t } = useTranslation('common');
  const defaultContent = t('loading');

  return (
    <Loader
      className={cx('pw-z-50', className)}
      backdrop={backdrop}
      content={content || defaultContent}
      vertical={vertical}
      size={size}
    />
  );
};

export default Loading;
