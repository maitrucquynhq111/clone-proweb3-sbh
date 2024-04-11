type Props = { children: React.ReactNode };

const PageContainer = ({ children }: Props) => {
  return <div className="pw-p-4 md:pw-p-5 pw-h-full">{children}</div>;
};

export default PageContainer;
