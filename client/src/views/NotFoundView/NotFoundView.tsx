import React from "react";

import { Header } from "../../components/Header/Header";

export const NotFoundView: React.FC = () => {
  return (
    <div>
      <Header />
      <h2 className="question-heading white">Wrong URL mate!</h2>
    </div>
  );
};
