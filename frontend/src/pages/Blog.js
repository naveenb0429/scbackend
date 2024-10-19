import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { blogs } from "../constants";

const Blog = () => {
  const { pathname } = useLocation();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const id = pathname.split("/")[2];
    const selectedBlog = blogs.find((item) => item.uid === parseInt(id));
    if (selectedBlog) setBlog(selectedBlog);
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-16 text-base sm:text-lg">
        {blog ? (
          <>
            <p className="text-gray-600 font-semibold mb-2">{blog.date}</p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-softprimary mb-6 sm:mb-8">{blog.title}</h1>

            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
              <div>
                <p className="text-gray-800 leading-relaxed">{blog.main_desc}</p>
              </div>
              <div className="mt-4 md:mt-0">
                <img
                  src={blog.image}
                  className="w-full h-64 sm:h-80 object-cover object-center rounded-lg shadow-md"
                  alt={blog.title}
                />
              </div>
            </div>

            {blog.uid === 1 && (
              <div className="space-y-6 sm:space-y-8">
                <p className="font-semibold text-lg sm:text-xl">
                  There are several benefits to move away from fossil fuels and
                  towards renewable energy, such as:
                </p>
                <ul className="list-disc pl-5 sm:pl-6 space-y-3 sm:space-y-4">
                  <li>
                    <span className="font-semibold">Environmental benefits:</span>{" "}
                    Renewable energy sources produce little to no greenhouse gas
                    emissions, helping to mitigate climate change and reduce air
                    pollution.
                  </li>
                  <li>
                    <span className="font-semibold">Energy security:</span>{" "}
                    Renewable energy sources are often locally available,
                    reducing dependence on imported fossil fuels and enhancing
                    energy security.
                  </li>
                  <li>
                    <span className="font-semibold">Economic benefits:</span>{" "}
                    The renewable energy sector creates jobs and stimulates
                    economic growth, particularly in rural areas.
                  </li>
                  <li>
                    <span className="font-semibold">
                      Stable energy prices:
                    </span>{" "}
                    Renewable energy sources have lower and more stable
                    operational costs compared to fossil fuels, leading to more
                    predictable energy prices.
                  </li>
                  <li>
                    <span className="font-semibold">
                      Improved public health:
                    </span>{" "}
                    By reducing air pollution, renewable energy can lead to
                    better public health outcomes and lower healthcare costs.
                  </li>
                </ul>
              </div>
            )}

            {blog.uid === 2 && (
              <div className="space-y-6 sm:space-y-8">
                <p>
                  Solar energy is a clean, renewable source of power that has
                  gained significant popularity in recent years. Here are some
                  key points about solar energy:
                </p>
                <ul className="list-disc pl-5 sm:pl-6 space-y-3 sm:space-y-4">
                  <li>
                    <span className="font-semibold">How it works:</span> Solar
                    panels convert sunlight into electricity through the
                    photovoltaic effect.
                  </li>
                  <li>
                    <span className="font-semibold">
                      Types of solar technology:
                    </span>{" "}
                    Photovoltaic (PV) systems and concentrated solar power (CSP)
                    are the two main types.
                  </li>
                  <li>
                    <span className="font-semibold">Applications:</span>{" "}
                    Residential rooftop systems, large-scale solar farms, and
                    various consumer products.
                  </li>
                  <li>
                    <span className="font-semibold">
                      Environmental impact:
                    </span>{" "}
                    Solar energy produces no direct emissions and has a much
                    lower carbon footprint compared to fossil fuels.
                  </li>
                  <li>
                    <span className="font-semibold">
                      Economic considerations:
                    </span>{" "}
                    Initial costs can be high, but prices are decreasing, and
                    long-term savings can be significant.
                  </li>
                </ul>
              </div>
            )}

            <img src={blog.image_2} className="mt-8 sm:mt-12 w-full rounded-lg shadow-md" alt="" />
          </>
        ) : (
          <p className="text-center text-gray-600">Loading blog post...</p>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
