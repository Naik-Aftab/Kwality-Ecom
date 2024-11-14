"use client";
import Slider from "react-slick";
// import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material"; 

// const PrevArrow = (props) => {
//   const { className, style, onClick } = props;
//   return (
//     <div
//       className={className}
//       style={{ ...style, display: "block", left: "10px", zIndex: 1 }} // Customize styles here
//       onClick={onClick}
//     >
//       {/* <ArrowBackIos style={{ fontSize: 30, color: "black" }} /> Custom Icon */}
//     </div>
//   );
// };

// const NextArrow = (props) => {
//   const { className, style, onClick } = props;
//   return (
//     <div
//       className={className}
//       style={{ ...style, display: "block", right: "10px", zIndex: 1 }} // Customize styles here
//       onClick={onClick}
//     >
//       {/* <ArrowForwardIos style={{ fontSize: 30, color: "black" }} /> Custom Icon */}
//     </div>
//   );
// };

export const Banner = () => {
//   var settings = {
//     // dots: true,
//     infinite: true,
//     autoplay:true,
//     speed: 500,
//     autoplaySpeed: 3000,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     prevArrow: <PrevArrow />, 
//     nextArrow: <NextArrow />, 
//   };

  return (
    <div className="flex justify-center">
      {/* <Slider {...settings}> */}
        {/* <div> */}
          <img src="/banner.jpg" alt="Banner" style={{ maxHeight: '500px', width:'96vw',backgroundSize:'contain',borderRadius:'10px'}} />
        {/* </div> */}
        {/* <div>
          <img className="rounded-lg" src="/banner.jpg" alt="Banner" style={{ height: '500px', width:'100%'}} />
        </div> */}

      {/* </Slider> */}
    </div>
  );
};
