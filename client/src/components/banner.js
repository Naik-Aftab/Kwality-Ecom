"use client";
import Slider from "react-slick";
// import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material"; 

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", left: "10px", zIndex: 1 }} // Customize styles here
      onClick={onClick}
    >
      {/* <ArrowBackIos style={{ fontSize: 30, color: "black" }} /> Custom Icon */}
    </div>
  );
};

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", right: "10px", zIndex: 1 }} // Customize styles here
      onClick={onClick}
    >
      {/* <ArrowForwardIos style={{ fontSize: 30, color: "black" }} /> Custom Icon */}
    </div>
  );
};

export const Banner = () => {
  var settings = {
    // dots: true,
    infinite: true,
    autoplay:true,
    speed: 500,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <PrevArrow />, 
    nextArrow: <NextArrow />, 
  };

  return (
    <div className="container py-5">
      <Slider {...settings}>
        <div>
          <img className="rounded-lg" src="/banner-bg.png" alt="Banner" style={{ background: '#d3ebc0' }} />
        </div>
        <div>
          <img className="rounded-lg" src="/banner-bg.png" alt="Banner" style={{ background: '#d3ebc0' }} />
        </div>
        <div>
          <img className="rounded-lg" src="/banner-bg.png" alt="Banner" style={{ background: '#d3ebc0' }} />
        </div>
      </Slider>
    </div>
  );
};
