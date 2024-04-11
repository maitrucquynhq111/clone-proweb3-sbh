type Props = {};

const Error404 = ({}: Props): JSX.Element => {
  return (
    <div className="pw-h-screen pw-w-full pw-flex-col pw-items-center pw-justify-center pw-flex">
      <p className="pw-text-7xl pw-font-bold">404</p>
      <p className="pw-text-3xl">Page not found!</p>
    </div>
  );
};

export default Error404;
