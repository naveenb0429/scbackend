import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import { Link } from "react-router-dom";
import { blogs } from "../constants";

const Blogs = () => {
  return (
    <>
      <Header />
      <section className="bg-[#E1F3F5] min-h-screen font-poppins px-4 sm:px-6 py-8 sm:py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-[#093620] space-y-3 sm:space-y-5 mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold">Blog Library</h1>
            <p className="text-base sm:text-lg">
              Comprehensive white papers, guides, and reports about carbon accounting
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {blogs.map((item, index) => (
              <Link to={`/blogs/${item?.uid}`} key={index} className="group">
                <div className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 group-hover:shadow-xl">
                  <div className="overflow-hidden">
                    <img
                      src={item?.image}
                      className="w-full h-48 sm:h-56 object-cover transition-transform duration-300 group-hover:scale-110"
                      alt={item?.title}
                    />
                  </div>
                  <div className="p-4 sm:p-6 bg-gradient-to-b from-[#093620] to-[#0936208a] backdrop-blur-sm">
                    <p className="text-xs sm:text-sm text-gray-300 mb-2 sm:mb-3">{item?.date}</p>
                    <h2 className="font-semibold text-lg sm:text-xl text-white mb-2 sm:mb-3 leading-tight">{item?.title}</h2>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Blogs;
