import React from "react";

export const Category = () => {
  return (
    <div className="flex">
      <div className="max-w-sm mx-auto overflow-hidden">
        <div className="flex justify-center mt-4">
          <img
            src="/chiken.png"
            alt="Card Image"
            className="h-32 w-32 object-cover rounded-full"
          />
        </div>

        <div className="text-center mt-4 mb-4">
          <h5 className="text-xl font-bold">Chicken</h5>
        </div>
      </div>
      <div className="max-w-sm mx-auto overflow-hidden">
        <div className="flex justify-center mt-4">
          <img
            src="/egg.png"
            alt="Card Image"
            className="h-32 w-32 object-cover rounded-full"
          />
        </div>

        <div className="text-center mt-4 mb-4">
          <h5 className="text-xl font-bold">Eggs</h5>
        </div>
      </div>
      <div className="max-w-sm mx-auto overflow-hidden">
        <div className="flex justify-center mt-4">
          <img
            src="/mutton.png"
            alt="Card Image"
            className="h-32 w-32 object-cover rounded-full "
          />
        </div>

        <div className="text-center mt-4 mb-4">
          <h5 className="text-xl font-bold">Mutton</h5>
        </div>
      </div>
      <div className="max-w-sm mx-auto overflow-hidden">
        <div className="flex justify-center mt-4">
          <img
            src="/fish.png"
            alt="Card Image"
            className="h-32 w-32 object-cover rounded-full "
          />
        </div>

        <div className="text-center mt-4 mb-4">
          <h5 className="text-xl font-bold">Fish</h5>
        </div>
      </div>

      <div className="max-w-sm mx-auto overflow-hidden">
        <div className="flex justify-center mt-4">
          <img
            src="/prawn.png"
            alt="Card Image"
            className="h-32 w-32 object-cover rounded-full "
          />
        </div>

        <div className="text-center mt-4 mb-4">
          <h5 className="text-xl font-bold">Prawns</h5>
        </div>
      </div>
    </div>
  );
};
