export const PollsIcon = ({ active }) => {
  const color: string = active ? "#0080F6" : "#f5f5f5";

  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect y="11.5294" width="5.6" height="16.4706" fill={color} />
      <rect x="11.2" width="5.6" height="28" fill={color} />
      <rect x="22.4" y="16.4706" width="5.6" height="11.5294" fill={color} />
    </svg>
  );
};

export const CommandsIcon = ({ active }) => {
  const color: string = active ? "#0080F6" : "#f5f5f5";

  return (
    <svg
      width="28"
      height="30"
      viewBox="0 0 28 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="28" height="23.8362" rx="7" fill={color} />
      <rect
        width="10.782"
        height="7.78272"
        transform="matrix(0.684812 -0.72872 0.684812 0.72872 11 23.8571)"
        fill={color}
      />
    </svg>
  );
};
