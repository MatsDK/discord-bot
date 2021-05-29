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

export const IgnoredIcon = ({ active }) => {
  const color: string = active ? "#0080F6" : "#f5f5f5";

  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="14" cy="14" r="12.5" stroke={color} strokeWidth="3" />
      <line
        x1="4.00019"
        y1="5.88214"
        x2="23.0002"
        y2="22.8821"
        stroke={color}
        strokeWidth="3"
      />
    </svg>
  );
};

export const DropDownIcon = () => {
  return (
    <svg
      width="21"
      height="11"
      viewBox="0 0 21 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="2.21831"
        height="14.0493"
        transform="matrix(0.743295 -0.668964 0.743295 0.668964 0 1.60153)"
        fill="#d8d8d8"
      />
      <rect
        width="2.21831"
        height="14.1848"
        transform="matrix(0.743295 0.668964 -0.743295 0.668964 19.3511 0)"
        fill="#d8d8d8"
      />
    </svg>
  );
};

export const EditIcon = () => {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect y="20" width="5.98603" height="6" fill="#303030" />
      <rect
        width="8.47541"
        height="24.0481"
        transform="matrix(0.706282 0.70793 -0.706282 0.70793 16.9847 2.97562)"
        fill="#303030"
      />
      <rect
        width="8.47541"
        height="2.91084"
        transform="matrix(0.706282 0.70793 -0.706282 0.70793 20.0139 0)"
        fill="#303030"
      />
    </svg>
  );
};

export const RemoveIcon = ({ color }: { color?: string }) => {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="26.2791"
        height="3"
        transform="matrix(0.707106 -0.707108 0.707106 0.707108 0 18.5822)"
        fill={color || "#303030"}
      />
      <rect
        width="26.2791"
        height="3"
        transform="matrix(0.707106 -0.707108 0.707106 0.707108 0 18.5822)"
        fill={color || "#303030"}
      />
      <rect
        width="26.2791"
        height="3"
        transform="matrix(0.707106 -0.707108 0.707106 0.707108 0 18.5822)"
        fill={color || "#303030"}
      />
      <rect
        width="26.2791"
        height="3"
        transform="matrix(0.707106 0.707108 -0.707106 0.707108 2.41785 7.62939e-06)"
        fill={color || "#303030"}
      />
      <rect
        width="26.2791"
        height="3"
        transform="matrix(0.707106 0.707108 -0.707106 0.707108 2.41785 7.62939e-06)"
        fill={color || "#303030"}
      />
      <rect
        width="26.2791"
        height="3"
        transform="matrix(0.707106 0.707108 -0.707106 0.707108 2.41785 7.62939e-06)"
        fill={color || "#303030"}
      />
    </svg>
  );
};
