const DefaultAvatar = ({ size = '40' }: { size?: string }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_2463_12782)">
        <rect width="40" height="40" fill="#C8FACD" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M20 23C17.2498 23 15 25.3318 15 28C15 28.5523 14.5523 29 14 29C13.4477 29 13 28.5523 13 28C13 24.2499 16.1228 21 20 21C23.8772 21 27 24.2499 27 28C27 28.5523 26.5523 29 26 29C25.4477 29 25 28.5523 25 28C25 25.3318 22.7502 23 20 23Z"
          fill="#00AB55"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M20 13C18.8954 13 18 13.8954 18 15C18 16.1046 18.8954 17 20 17C21.1046 17 22 16.1046 22 15C22 13.8954 21.1046 13 20 13ZM16 15C16 12.7909 17.7909 11 20 11C22.2091 11 24 12.7909 24 15C24 17.2091 22.2091 19 20 19C17.7909 19 16 17.2091 16 15Z"
          fill="#00AB55"
        />
      </g>
      <defs>
        <clipPath id="clip0_2463_12782">
          <rect width="40" height="40" rx="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default DefaultAvatar;
