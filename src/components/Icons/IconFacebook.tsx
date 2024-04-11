const IconFacebook = ({ size = '28', className = '' }: { size?: string; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g clipPath="url(#clip0_2414_31127)">
      <path
        d="M25.6671 14.0717C25.6671 7.58799 20.4433 2.33215 14.0004 2.33215C7.55456 2.33361 2.33081 7.58799 2.33081 14.0732C2.33081 19.9313 6.59789 24.7876 12.1746 25.6684V17.4653H9.21414V14.0732H12.1775V11.4847C12.1775 8.5432 13.9202 6.91861 16.5846 6.91861C17.8621 6.91861 19.1964 7.14757 19.1964 7.14757V10.0351H17.725C16.2768 10.0351 15.8248 10.9407 15.8248 11.8697V14.0717H19.0593L18.5431 17.4638H15.8233V25.6669C21.4 24.7861 25.6671 19.9299 25.6671 14.0717Z"
        fill="#1877F2"
      />
    </g>
    <defs>
      <clipPath id="clip0_2414_31127">
        <rect width="23.3333" height="23.3333" fill="white" transform="translate(2.33325 2.33337)" />
      </clipPath>
    </defs>
  </svg>
);

export default IconFacebook;
