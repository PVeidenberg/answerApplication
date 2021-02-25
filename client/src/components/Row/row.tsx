import React from "react";
import './row.css';

export interface RowProps {
  userName: string;
  answer: string;
}

export const Row: React.FC<RowProps> = ({
    userName,
    answer,
}) => {

  return <div className="row">
      <h5 className="white">{`${userName} :`}</h5>
      <h5 className="white">{`${answer}`}</h5>
  </div>
};
