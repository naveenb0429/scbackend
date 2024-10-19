import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import CustomPagination from "./CustomPagination";

const Slider = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSlideChange = (index) => {
    setActiveIndex(index);
  };
  return (
    <div className="container max-w-7xl mx-auto px-7 hidden md:flex">
      <Swiper
        pagination={{
          el: ".swiper-pagination",
          clickable: true,
        }}
        modules={[Pagination]}
        onSlideChange={(swiper) => handleSlideChange(swiper.activeIndex)}
        className="mySwiper "
      >
        <SwiperSlide>
          <div className="grid grid-cols-3">
            <div className="col-span-2">
              <img
                src={require("../assets/slider_01.png")}
                className="w-full object-cover h-full"
                alt=""
              />
            </div>
            <div className="col-span-1">
              <CustomPagination
                activeIndex={activeIndex}
                totalSlides={3}
                onSlideChange={handleSlideChange}
              />
              <div className="my-auto bg-softprimary text-white rounded-r-2xl p-10 mt-12">
                <p className="font-semibold text-lg md:text-3xl">
                  Collaborative
                </p>
                <p className="md:text-lg mt-7">
                  Develop and manage your smart net zero journey with AI-powered
                  decision support on abatement levers and roadmap creation
                </p>
              </div>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="grid grid-cols-3">
            <div className="col-span-2">
              <img
                src={require("../assets/slider_01.png")}
                className="w-full object-cover"
                alt=""
              />
            </div>
            <div className="col-span-1">
              <CustomPagination
                activeIndex={activeIndex}
                totalSlides={3}
                onSlideChange={handleSlideChange}
              />
              <div className="my-auto bg-softprimary text-white rounded-r-2xl p-10 mt-12">
                <p className="font-semibold text-3xl">Collaborative</p>
                <p className="text-lg mt-7">
                  Develop and manage your smart net zero journey with AI-powered
                  decision support on abatement levers and roadmap creation
                </p>
              </div>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="grid grid-cols-3">
            <div className="col-span-2">
              <img
                src={require("../assets/slider_01.png")}
                className="w-full object-cover"
                alt=""
              />
            </div>
            <div className="col-span-1">
              <CustomPagination
                activeIndex={activeIndex}
                totalSlides={3}
                onSlideChange={handleSlideChange}
              />
              <div className="my-auto bg-softprimary text-white rounded-r-2xl p-10 mt-12">
                <p className="font-semibold text-3xl">Collaborative</p>
                <p className="text-lg mt-7">
                  Develop and manage your smart net zero journey with AI-powered
                  decision support on abatement levers and roadmap creation
                </p>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Slider;
