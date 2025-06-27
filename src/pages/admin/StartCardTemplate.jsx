import React from "react";

const StartCardTemplate = ({ title, value, icon: Icon, color }) => {
  return (
    <div className={`flex items-center justify-between p-4 rounded-lg shadow-md text-white w-full md:w-[22%] ${color}`}>
      <div>
        <h4 className="text-sm opacity-80">{title}</h4>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
      <div className="text-4xl opacity-60">
        {Icon && <Icon />}
      </div>
    </div>
  );
};

export default StartCardTemplate;
