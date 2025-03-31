import { FC } from 'react';

export interface TimeProps {
  className?: string;
  seconds: number;
}

const padZero = (num: number) => String(num).padStart(2, '0');

const getMinutesNum = (seconds: number) => padZero(Math.floor(seconds / 60));
const getSecondsNum = (seconds: number) => padZero(seconds % 60);

export const Time: FC<TimeProps> = ({ className = '', seconds }) => {
  return (
    <span className={`${className} text-5xl`}>
      {getMinutesNum(seconds)}:{getSecondsNum(seconds)}
    </span>
  );
};
