import { Link } from 'react-router-dom';
import Header from '../layouts/Header';

const CookiePolicy = () => {
   return (
      <>
         <Header />
         <div className="bg-[#E1F3F5] min-h-screen">
            <div className="container max-w-4xl mx-auto px-4 py-8 sm:py-12 font-poppins">
               <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8">
                  <span className="text-[#093620]">Cookies Policy</span>
               </h1>
               <p className="text-gray-700 mb-6 sm:mb-8 font-semibold text-xs sm:text-sm">Last updated: September 20, 2024</p>
               <div className="space-y-6 sm:space-y-8">
                  <section>
                     <p className="text-gray-700 mb-4 text-xs sm:text-sm">
                        This Cookies Policy explains what Cookies are and how We use them. You should read this policy so You can understand what type of cookies We use, or the information We collect using Cookies and how that information is used. This Cookies Policy has been created with the help of the <a href="https://www.freeprivacypolicy.com/free-cookies-policy-generator/" className="text-blue-600 hover:underline font-medium">Free Cookies Policy Generator</a>.
                     </p>
                     <p className="text-gray-700 mb-4 text-xs sm:text-sm">
                        Cookies do not typically contain any information that personally identifies a user, but personal information that we store about You may be linked to the information stored in and obtained from Cookies. For further information on how We use, store and keep your personal data secure, see our Privacy Policy.
                     </p>
                     <p className="text-gray-700 text-xs sm:text-sm">
                        We do not store sensitive personal information, such as mailing addresses, account passwords, etc. in the Cookies We use.
                     </p>
                  </section>

                  <section>
                     <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#093620] mb-4">Interpretation and Definitions</h2>
                     <h3 className="text-base sm:text-lg font-semibold text-[#672F16] mb-2">Interpretation</h3>
                     <p className="text-gray-700 mb-4 text-xs sm:text-sm">
                        The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
                     </p>
                     <h3 className="text-base sm:text-lg font-semibold text-[#672F16] mb-2">Definitions</h3>
                     <p className="text-gray-700 mb-4 text-xs sm:text-sm">For the purposes of this Cookies Policy:</p>
                     <ul className="list-disc pl-5 sm:pl-8 mb-4 text-gray-700 text-xs sm:text-sm">
                        <li className="mb-2">Company (referred to as either "the Company", "We", "Us" or "Our" in this Cookies Policy) refers to sustaincred solutions private limited, Hyderabad, India.</li>
                        <li className="mb-2">Cookies means small files that are placed on Your computer, mobile device or any other device by a website, containing details of your browsing history on that website among its many uses.</li>
                        <li className="mb-2">Website refers to Sustaincred, accessible from <a href="https://sustaincred.com" className="text-blue-600 hover:underline font-medium">sustaincred.com</a></li>
                        <li className="mb-2">You means the individual accessing or using the Website, or a company, or any legal entity on behalf of which such individual is accessing or using the Website, as applicable.</li>
                     </ul>
                  </section>

                  <section>
                     <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#093620] mb-4">The use of the Cookies</h2>
                     <h3 className="text-base sm:text-lg font-semibold text-[#672F16] mb-2">Type of Cookies We Use</h3>
                     <p className="text-gray-700 mb-4 text-xs sm:text-sm">
                        Cookies can be "Persistent" or "Session" Cookies. Persistent Cookies remain on your personal computer or mobile device when You go offline, while Session Cookies are deleted as soon as You close your web browser.
                     </p>
                     <p className="text-gray-700 mb-4 text-xs sm:text-sm">We use both session and persistent Cookies for the purposes set out below:</p>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
                        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                           <h4 className="text-base sm:text-lg font-semibold text-[#093620] mb-3">Necessary / Essential Cookies</h4>
                           <ul className="space-y-2 text-gray-700 text-xs sm:text-sm">
                              <li><span className="font-medium">Type:</span> Session Cookies</li>
                              <li><span className="font-medium">Administered by:</span> Us</li>
                              <li><span className="font-medium">Purpose:</span> These Cookies are essential to provide You with services available through the Website and to enable You to use some of its features. They help to authenticate users and prevent fraudulent use of user accounts. Without these Cookies, the services that You have asked for cannot be provided, and We only use these Cookies to provide You with those services.</li>
                           </ul>
                        </div>
                        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                           <h4 className="text-base sm:text-lg font-semibold text-[#093620] mb-3">Functionality Cookies</h4>
                           <ul className="space-y-2 text-gray-700 text-xs sm:text-sm">
                              <li><span className="font-medium">Type:</span> Persistent Cookies</li>
                              <li><span className="font-medium">Administered by:</span> Us</li>
                              <li><span className="font-medium">Purpose:</span> These Cookies allow us to remember choices You make when You use the Website, such as remembering your login details or language preference. The purpose of these Cookies is to provide You with a more personal experience and to avoid You having to re-enter your preferences every time You use the Website.</li>
                           </ul>
                        </div>
                     </div>
                     <h3 className="text-base sm:text-lg font-semibold text-[#672F16] mb-2">Your Choices Regarding Cookies</h3>
                     <p className="text-gray-700 mb-4 text-xs sm:text-sm">
                        If You prefer to avoid the use of Cookies on the Website, first You must disable the use of Cookies in your browser and then delete the Cookies saved in your browser associated with this website. You may use this option for preventing the use of Cookies at any time.
                     </p>
                     <p className="text-gray-700 mb-4 text-xs sm:text-sm">
                        If You do not accept Our Cookies, You may experience some inconvenience in your use of the Website and some features may not function properly.
                     </p>
                     <p className="text-gray-700 mb-4 text-xs sm:text-sm">
                        If You'd like to delete Cookies or instruct your web browser to delete or refuse Cookies, please visit the help pages of your web browser.
                     </p>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                           <h4 className="text-base sm:text-lg font-semibold text-[#093620] mb-2">Chrome</h4>
                           <p className="text-gray-700 mb-2 text-xs sm:text-sm">Visit this page from Google:</p>
                           <a href="https://support.google.com/accounts/answer/32050" className="text-blue-600 hover:underline block truncate font-medium text-xs sm:text-sm" target="_blank" rel="noopener noreferrer">
                              Google Support: Clear Cache & Cookies
                           </a>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                           <h4 className="text-base sm:text-lg font-semibold text-[#093620] mb-2">Internet Explorer</h4>
                           <p className="text-gray-700 mb-2 text-xs sm:text-sm">Visit this page from Microsoft:</p>
                           <a href="http://support.microsoft.com/kb/278835" className="text-blue-600 hover:underline block truncate font-medium text-xs sm:text-sm" target="_blank" rel="noopener noreferrer">
                              Microsoft Support: Delete Cookies
                           </a>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                           <h4 className="text-base sm:text-lg font-semibold text-[#093620] mb-2">Firefox</h4>
                           <p className="text-gray-700 mb-2 text-xs sm:text-sm">Visit this page from Mozilla:</p>
                           <a href="https://support.mozilla.org/en-US/kb/delete-cookies-remove-info-websites-stored" className="text-blue-600 hover:underline block truncate font-medium text-xs sm:text-sm" target="_blank" rel="noopener noreferrer">
                              Mozilla Support: Delete Cookies
                           </a>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                           <h4 className="text-base sm:text-lg font-semibold text-[#093620] mb-2">Safari</h4>
                           <p className="text-gray-700 mb-2 text-xs sm:text-sm">Visit this page from Apple:</p>
                           <a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" className="text-blue-600 hover:underline block truncate font-medium text-xs sm:text-sm" target="_blank" rel="noopener noreferrer">
                              Apple Support: Manage Cookies
                           </a>
                        </div>
                     </div>
                     <p className="text-gray-700 mb-4 text-xs sm:text-sm">
                        For any other web browser, please visit your web browser's official web pages.
                     </p>
                     <h3 className="text-base sm:text-lg font-semibold text-[#672F16] mb-2">More Information about Cookies</h3>
                     <p className="text-gray-700 mb-4 text-xs sm:text-sm">
                        You can learn more about cookies: <a href="https://www.freeprivacypolicy.com/blog/cookies/" className="text-blue-600 hover:underline font-medium">Cookies: What Do They Do?</a>.
                     </p>
                  </section>

                  <section>
                     <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#093620] mb-4">Contact Us</h2>
                     <p className="text-gray-700 mb-4 text-xs sm:text-sm">If you have any questions about this Cookies Policy, You can contact us:</p>
                     <ul className="list-disc pl-5 sm:pl-8 mb-4 text-gray-700 text-xs sm:text-sm">
                        <li>By email: <a href="mailto:team@sustaincred.com" className="text-blue-600 font-semibold hover:underline">team@sustaincred.com</a></li>
                     </ul>
                  </section>
               </div>

               <div className="mt-8 sm:mt-12">
                  <Link to="/" className="inline-flex items-center bg-[#2B6E2B] text-white font-medium py-2 px-4 sm:py-3 sm:px-6 rounded-full hover:bg-green-800 transition duration-300 text-xs sm:text-sm">
                     Back to Home
                  </Link>
               </div>
            </div>
         </div>
      </>
   );
};

export default CookiePolicy;