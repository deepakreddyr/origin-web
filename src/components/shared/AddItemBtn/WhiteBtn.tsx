import React from 'react';

const WhiteBtn = (props: any) => {
  const { isItemPresent, handleDecrease, quantity } = props;
  const { handleIncrease, handleAddItem } = props;
  return (
    <div>
      {isItemPresent ? (
        <div
          className={`flex h-[2.5vw]  mob:h-[8.1vw] items-center justify-center border-[2px] border-primary-200  rounded-full ${
            // addButtonType === BUTTON_TYPE_MAP.YELLOW?
            'bg-white'
            // : 'bg-white'
          }  w-max  p-[.3vw] mob:px-[.7vw] `}
        >
          <button
            className={` h-[1.5vw] w-[1.5vw] mob:h-[6vw] mob:w-[6vw] mob:text-[5.1vw] text-[1.67vw] pb-[.3vw]  flex items-center justify-center bg-primary rounded-full  ${
              // addButtonType === BUTTON_TYPE_MAP.YELLOW ?
              // '':
              'border border-primary-200'
            }  `}
            onClick={handleDecrease}
          >
            -
          </button>
          <div className="w-[1.1vw] mx-[.5vw]  mob:mx-[3vw] flex items-center justify-center">
            <p className="text-[1.1vw] mob:text-[4.1vw]">{quantity}</p>
          </div>
          <button
            className={` h-[1.5vw] w-[1.5vw] mob:h-[6vw] mob:w-[6vw] mob:text-[5.1vw] text-[1.4vw]  pb-[.3vw] flex items-center justify-center bg-primary rounded-full  ${'border border-primary-200'}  `}
            onClick={handleIncrease}
          >
            +
          </button>
        </div>
      ) : (
        <button
          className="bg-primary flex items-center gap-[0vw] mob:gap-[0.6vw] h-[2.5vw]  mob:h-[7.85vw] rounded-full   pl-[1.1vw]  mob:pl-[4.1vw] mob:pr-[2vw] pr-[.4vw] py-[.4vw] font-slab text-[.97vw] font-bold  mob:text-[3.6vw]  "
          onClick={handleAddItem}
        >
          Add{' '}
          <div className="bg-primary h-[1.67vw] w-[1.67vw] mob:h-[6vw] mob:w-[6vw] rounded-full text-[1.5vw] mob:text-[4.1vw] font-medium flex items-center justify-center mt-[-.3vw] ">
            +
          </div>
        </button>
        // ADD_BUTTONS_MAP[addButtonType]
        // <YellowButton handler={handleAddItem} />
        // <button
        //     className="bg-primary rounded-full px-[1.67vw] text-[.83vw] py-[.4vw] font-secondary-bold "
        //     onClick={handleAddItem}
        // >
        //     Add +
        // </button>
      )}
    </div>
  );
};

export default WhiteBtn;
