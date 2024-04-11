type Props = {};

const Error500 = ({}: Props): JSX.Element => {
  return (
    <div className="pw-h-screen pw-w-full pw-flex-col pw-items-center pw-justify-center pw-flex">
      <p className="pw-text-7xl pw-font-bold">500</p>
      <p className="pw-text-3xl">Interal server error!</p>
    </div>
  );
};

export default Error500;
