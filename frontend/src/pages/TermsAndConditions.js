import Header from "../layouts/Header";
import { Link } from "react-router-dom";

const TermsAndConditions = () => {
    return (
        <>
            <Header />
            <div className="bg-[#E1F3F5] min-h-screen">
                <div className="container max-w-4xl mx-auto px-4 py-8 sm:py-12 font-poppins">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8">
                        <span className="text-[#093620]">SustainCred Terms of Use</span>
                    </h1>
                    <div className="space-y-6 sm:space-y-8">
                        <section>
                            <p className="text-gray-700 mb-4 text-xs sm:text-sm">
                                This Agreement (&ldquo;<strong>Agreement</strong>&rdquo;) sets forth the terms on which SustainCred Limited (&ldquo;<strong>SustainCred</strong>&rdquo;) will permit you (&ldquo;<strong>Customer</strong>&rdquo;) to use the Services (as defined below).
                            </p>
                            <p className="text-gray-700 mb-4 text-xs sm:text-sm">The parties agree as follows:</p>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#093620] mb-4">1. DEFINITIONS</h2>
                            <p className="text-gray-700 mb-4 text-xs sm:text-sm">The following definitions apply in this Agreement:</p>

                            <div className="space-y-4">
                                <h3 className="text-base sm:text-lg font-semibold text-[#672F16] mb-2">Confidential Information</h3>
                                <p className="text-gray-700 text-xs sm:text-sm">
                                    All confidential information disclosed by a Party to the other Party, whether orally or in writing, and whether before or after the Effective Date, which is either designated as confidential by the disclosing party at the time of disclosure or otherwise which would be understood to be confidential given the nature of the information. Confidential Information includes the fact that the Customer is using the Services, all Customer Data and all Reports, as originally compiled by the Services. Confidential Information excludes any aggregated or anonymized information derived by SustainCred from the Reports that is irreversibly disassociated with the Customer.
                                </p>

                                <h3 className="text-base sm:text-lg font-semibold text-[#672F16] mb-2">Customer Data</h3>
                                <p className="text-gray-700 text-xs sm:text-sm">
                                    All data submitted by Customer to SustainCred as a result of Customer's use of the Services.
                                </p>

                                <h3 className="text-base sm:text-lg font-semibold text-[#672F16] mb-2">Documentation</h3>
                                <p className="text-gray-700 text-xs sm:text-sm">
                                    Any user documentation, in all forms, provided to Customer by SustainCred relating to the Services.
                                </p>

                                <h3 className="text-base sm:text-lg font-semibold text-[#672F16] mb-2">Effective Date</h3>
                                <p className="text-gray-700 text-xs sm:text-sm">
                                    The date of this Agreement.
                                </p>

                                <h3 className="text-base sm:text-lg font-semibold text-[#672F16] mb-2">Intellectual Property Rights</h3>
                                <p className="text-gray-700 text-xs sm:text-sm">
                                    Patents, rights to inventions, copyright and neighbouring and related rights, trademarks, business names and domain names, rights in get-up, goodwill and the right to sue for passing off or unfair competition, rights in designs, rights in computer software, database rights, rights to use, and protect the confidentiality of, Confidential Information (including know-how) and all other intellectual property rights, in each case whether registered or unregistered and including all applications and rights to apply for and be granted, renewals or extensions of, and rights to claim priority from, such rights and all similar or equivalent rights or forms of protection which subsist or will subsist now or in the future in any part of the world.
                                </p>

                                <h3 className="text-base sm:text-lg font-semibold text-[#672F16] mb-2">Parties</h3>
                                <p className="text-gray-700 text-xs sm:text-sm">
                                    SustainCred and Customer, each referred to respectively as a Party.
                                </p>

                                <h3 className="text-base sm:text-lg font-semibold text-[#672F16] mb-2">Personal Data</h3>
                                <p className="text-gray-700 text-xs sm:text-sm">
                                    Any information relating to an identified or identifiable natural person, who can be identified, directly or indirectly, in particular by reference to an identifier such as a name, an identification number, location data, an online identifier or to one or more factors specific to the physical, physiological, genetic, mental, economic, cultural or social identity of that natural person.
                                </p>

                                <h3 className="text-base sm:text-lg font-semibold text-[#672F16] mb-2">Privacy Policy</h3>
                                <p className="text-gray-700 text-xs sm:text-sm">
                                    SustainCred privacy policy at SustainCred.com/privacy which sets out how Customer's and prospective customers' representatives' personal data will be processed.
                                </p>

                                <h3 className="text-base sm:text-lg font-semibold text-[#672F16] mb-2">Reports</h3>
                                <p className="text-gray-700 text-xs sm:text-sm">
                                    The results and outcomes of the Customer's use of the Services, specifically the greenhouse gas emission reports compiled by the Services on the basis of the Customer Data.
                                </p>

                                <h3 className="text-base sm:text-lg font-semibold text-[#672F16] mb-2">Services</h3>
                                <p className="text-gray-700 text-xs sm:text-sm">
                                    The web-based services, made available by SustainCred at <a href="https://dash.SustainCred.com/login" className="text-blue-600 hover:underline font-medium">dash.SustainCred.com/login</a>, specifically the SustainCred platform that calculates Carbon Credits in line with the Greenhouse Gas Protocol for Scope 1, 2 and 3 emissions developed by the World Resources Institute and the World Business Council for Sustainable Development or in line with another methodology.
                                </p>

                                <h3 className="text-base sm:text-lg font-semibold text-[#672F16] mb-2">Third Party Applications</h3>
                                <p className="text-gray-700 text-xs sm:text-sm">
                                    Any online applications or offline software products or Services that interoperate with the Services which are not provided by SustainCred.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#093620] mb-4">2. ACCESS TO AND USE OF THE SERVICES</h2>
                            <div className="space-y-4">
                                <h3 className="text-base sm:text-lg font-semibold text-[#672F16] mb-2">2.1 Use of the Services</h3>
                                <p className="text-gray-700 text-xs sm:text-sm">
                                    Subject to the terms and conditions of this Agreement, SustainCred grants to Customer a worldwide, non-exclusive, non-transferable (except as permitted by this Agreement), licence, without the right to grant sub-licence, for the Term of this Agreement, to use the Services and the Documentation solely in connection with Customer's internal business operations. Customer's right to use the Services is subject to and contingent upon Customer's compliance with this Agreement and SustainCred reserves all rights not expressly granted herein.
                                </p>

                                <h3 className="text-base sm:text-lg font-semibold text-[#672F16] mb-2">2.2 Technical Support Services</h3>
                                <p className="text-gray-700 text-xs sm:text-sm">
                                    SustainCred may provide Customer with reasonable technical support.
                                </p>

                                <h3 className="text-base sm:text-lg font-semibold text-[#672F16] mb-2">2.3 Use Restrictions</h3>
                                <p className="text-gray-700 text-xs sm:text-sm">
                                    Except as otherwise explicitly provided in this Agreement or as may be expressly permitted by applicable law, Customer will not, and will not permit or authorise third parties to:
                                </p>
                                <ol className="list-decimal list-inside mb-4 pl-4 text-gray-700 text-xs sm:text-sm">
                                    <li className="mb-2">Copy, Modify, Transmit, Distribute, Frame, Mirror, or Attempt to reverse engineer, disassemble, reverse compile or otherwise reduce to human-readable form all or any part of the Services and/or Documentation (as applicable), in any form or by any means</li>
                                    <li className="mb-2">Rent, Lease, Sell, Transfer, Distribute, Exploit, or otherwise permit third parties to use the Services or Documentation without SustainCred's written consent</li>
                                    <li className="mb-2">Use the Services or Documentation to provide services to third parties without SustainCred's written consent</li>
                                    <li className="mb-2">Use the Services or the Reports in any way that purports or suggests that there is any affiliation between the Parties</li>
                                    <li className="mb-2">Use the Services to store or transmit any infringing, obscene, defamatory or otherwise unlawful or tortious material, or any material that violates a third party's privacy rights or</li>
                                    <li className="mb-2">Interfere with, damage, disrupt the integrity or performance of the Services, including by circumventing or disabling any security or other technological features or measures of the Services</li>
                                </ol>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#093620] mb-4">3. CUSTOMER RESPONSIBILITIES</h2>
                            <div className="space-y-4">
                                <h3 className="text-base sm:text-lg font-semibold text-[#672F16] mb-2">3.1 Customer Data</h3>
                                <p className="text-gray-700 text-xs sm:text-sm">
                                    Customer is solely responsible for the accuracy, quality, integrity, legality, reliability, and appropriateness of all Customer Data.
                                </p>

                                <h3 className="text-base sm:text-lg font-semibold text-[#672F16] mb-2">3.2 Customer Equipment</h3>
                                <p className="text-gray-700 text-xs sm:text-sm">
                                    Customer is responsible for obtaining and maintaining any equipment and ancillary services needed to connect to, access or otherwise use the Services, including, without limitation, modems, hardware, software, and long distance or local telephone service. Customer shall be responsible for ensuring that such equipment and ancillary services are compatible with the Services.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#093620] mb-4">4. FEES AND PAYMENT</h2>
                            <div className="space-y-4">
                                <h3 className="text-base sm:text-lg font-semibold text-[#672F16] mb-2">4.1 Fees</h3>
                                <p className="text-gray-700 text-xs sm:text-sm">
                                    Customer will pay all fees specified in Order Forms. Except as otherwise specified herein or in an Order Form, (i) fees are based on Services and Content subscriptions purchased and not actual usage, (ii) payment obligations are non-cancelable and fees paid are non-refundable, and (iii) quantities purchased cannot be decreased during the relevant subscription term.
                                </p>

                                <h3 className="text-base sm:text-lg font-semibold text-[#672F16] mb-2">4.2 Invoicing and Payment</h3>
                                <p className="text-gray-700 text-xs sm:text-sm">
                                    You will provide us with valid and updated credit card information, or with a valid purchase order or alternative document reasonably acceptable to us. If you provide credit card information to us, you authorize us to charge such credit card for all Purchased Services listed in the Order Form for the initial subscription term and any renewal subscription term(s) as set forth in the "Term of Purchased Subscriptions" section below. Such charges shall be made in advance, either annually or in accordance with any different billing frequency stated in the applicable Order Form.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#093620] mb-4">5. PROPRIETARY RIGHTS AND LICENSES</h2>
                            <div className="space-y-4">
                                <h3 className="text-base sm:text-lg font-semibold text-[#672F16] mb-2">5.1 Reservation of Rights</h3>
                                <p className="text-gray-700 text-xs sm:text-sm">
                                    Subject to the limited rights expressly granted hereunder, We and Our licensors and Content Providers reserve all of Our/their right, title and interest in and to the Services and Content, including all of Our/their related intellectual property rights. No rights are granted to You hereunder other than as expressly set forth herein.
                                </p>

                                <h3 className="text-base sm:text-lg font-semibold text-[#672F16] mb-2">5.2 License by Us to Use Content</h3>
                                <p className="text-gray-700 text-xs sm:text-sm">
                                    We grant to You a worldwide, limited-term license, under Our applicable intellectual property rights and licenses, to use Content acquired by You pursuant to Order Forms, subject to those Order Forms, this Agreement and the Documentation.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#093620] mb-4">6. CONFIDENTIALITY</h2>
                            <div className="space-y-4">
                                <h3 className="text-base sm:text-lg font-semibold text-[#672F16] mb-2">6.1 Definition of Confidential Information</h3>
                                <p className="text-gray-700 text-xs sm:text-sm">
                                    "Confidential Information" means all information disclosed by a party ("Disclosing Party") to the other party ("Receiving Party"), whether orally or in writing, that is designated as confidential or that reasonably should be understood to be confidential given the nature of the information and the circumstances of disclosure.
                                </p>

                                <h3 className="text-base sm:text-lg font-semibold text-[#672F16] mb-2">6.2 Protection of Confidential Information</h3>
                                <p className="text-gray-700 text-xs sm:text-sm">
                                    The Receiving Party will use the same degree of care that it uses to protect the confidentiality of its own confidential information of like kind (but not less than reasonable care) to (i) not use any Confidential Information of the Disclosing Party for any purpose outside the scope of this Agreement and (ii) except as otherwise authorized by the Disclosing Party in writing, limit access to Confidential Information of the Disclosing Party to those of its and its Affiliates' employees and contractors who need that access for purposes consistent with this Agreement and who have signed confidentiality agreements with the Receiving Party containing protections not materially less protective of the Confidential Information than those herein.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#093620] mb-4">7. REPRESENTATIONS, WARRANTIES, EXCLUSIVE REMEDIES AND DISCLAIMERS</h2>
                            <div className="space-y-4">
                                <h3 className="text-base sm:text-lg font-semibold text-[#672F16] mb-2">7.1 Representations</h3>
                                <p className="text-gray-700 text-xs sm:text-sm">
                                    Each party represents that it has validly entered into this Agreement and has the legal power to do so.
                                </p>

                                <h3 className="text-base sm:text-lg font-semibold text-[#672F16] mb-2">7.2 Our Warranties</h3>
                                <p className="text-gray-700 text-xs sm:text-sm">
                                    We warrant that during an applicable subscription term (a) this Agreement, the Order Forms and the Documentation will accurately describe the applicable administrative, physical, and technical safeguards for protection of the security, confidentiality and integrity of Your Data, (b) We will not materially decrease the overall security of the Services, (c) the Services will perform materially in accordance with the applicable Documentation, and (d) subject to the "Integration with Non-SustainCred Applications" section above, We will not materially decrease the overall functionality of the Services.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#093620] mb-4">8. MUTUAL INDEMNIFICATION</h2>
                            <div className="space-y-4">
                                <h3 className="text-base sm:text-lg font-semibold text-[#672F16] mb-2">8.1 Indemnification by Us</h3>
                                <p className="text-gray-700 text-xs sm:text-sm">
                                    We will defend You against any claim, demand, suit or proceeding made or brought against You by a third party alleging that any Purchased Service infringes or misappropriates such third party's intellectual property rights (a "Claim Against You"), and will indemnify You from any damages, attorney fees and costs finally awarded against You as a result of, or for amounts paid by You under a settlement approved by Us in writing of, a Claim Against You, provided You (a) promptly give Us written notice of the Claim Against You, (b) give Us sole control of the defense and settlement of the Claim Against You (except that We may not settle any Claim Against You unless it unconditionally releases You of all liability), and (c) give Us all reasonable assistance, at Our expense.
                                </p>

                                <h3 className="text-base sm:text-lg font-semibold text-[#672F16] mb-2">8.2 Indemnification by You</h3>
                                <p className="text-gray-700 text-xs sm:text-sm">
                                    You will defend Us against any claim, demand, suit or proceeding made or brought against Us by a third party alleging that Your Data, or Your use of any Service or Content in breach of this Agreement, infringes or misappropriates such third party's intellectual property rights or violates applicable law (a "Claim Against Us"), and will indemnify Us from any damages, attorney fees and costs finally awarded against Us as a result of, or for any amounts paid by Us under a settlement approved by You in writing of, a Claim Against Us, provided We (a) promptly give You written notice of the Claim Against Us, (b) give You sole control of the defense and settlement of the Claim Against Us (except that You may not settle any Claim Against Us unless it unconditionally releases Us of all liability), and (c) give You all reasonable assistance, at Your expense.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#093620] mb-4">9. LIMITATION OF LIABILITY</h2>
                            <div className="space-y-4">
                                <h3 className="text-base sm:text-lg font-semibold text-[#672F16] mb-2">9.1 Limitation of Liability</h3>
                                <p className="text-gray-700 text-xs sm:text-sm">
                                    IN NO EVENT SHALL THE AGGREGATE LIABILITY OF EACH PARTY TOGETHER WITH ALL OF ITS AFFILIATES ARISING OUT OF OR RELATED TO THIS AGREEMENT EXCEED THE TOTAL AMOUNT PAID BY YOU AND YOUR AFFILIATES HEREUNDER FOR THE SERVICES GIVING RISE TO THE LIABILITY IN THE TWELVE MONTHS PRECEDING THE FIRST INCIDENT OUT OF WHICH THE LIABILITY AROSE. THE FOREGOING LIMITATION WILL APPLY WHETHER AN ACTION IS IN CONTRACT OR TORT AND REGARDLESS OF THE THEORY OF LIABILITY, BUT WILL NOT LIMIT YOUR AND YOUR AFFILIATES' PAYMENT OBLIGATIONS UNDER THE "FEES AND PAYMENT" SECTION ABOVE.
                                </p>

                                <h3 className="text-base sm:text-lg font-semibold text-[#672F16] mb-2">9.2 Exclusion of Consequential and Related Damages</h3>
                                <p className="text-gray-700 text-xs sm:text-sm">
                                    IN NO EVENT WILL EITHER PARTY OR ITS AFFILIATES HAVE ANY LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT FOR ANY LOST PROFITS, REVENUES, GOODWILL, OR INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, COVER, BUSINESS INTERRUPTION OR PUNITIVE DAMAGES, WHETHER AN ACTION IS IN CONTRACT OR TORT AND REGARDLESS OF THE THEORY OF LIABILITY, EVEN IF A PARTY OR ITS AFFILIATES HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES OR IF A PARTY'S OR ITS AFFILIATES' REMEDY OTHERWISE FAILS OF ITS ESSENTIAL PURPOSE. THE FOREGOING DISCLAIMER WILL NOT APPLY TO THE EXTENT PROHIBITED BY LAW.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#093620] mb-4">10. TERM AND TERMINATION</h2>
                            <div className="space-y-4">
                                <h3 className="text-base sm:text-lg font-semibold text-[#672F16] mb-2">10.1 Term of Agreement</h3>
                                <p className="text-gray-700 text-xs sm:text-sm">
                                    This Agreement commences on the date You first accept it and continues until all subscriptions hereunder have expired or have been terminated.
                                </p>

                                <h3 className="text-base sm:text-lg font-semibold text-[#672F16] mb-2">10.2 Termination</h3>
                                <p className="text-gray-700 text-xs sm:text-sm">
                                    A party may terminate this Agreement for cause (i) upon 30 days written notice to the other party of a material breach if such breach remains uncured at the expiration of such period, or (ii) if the other party becomes the subject of a petition in bankruptcy or any other proceeding relating to insolvency, receivership, liquidation or assignment for the benefit of creditors.
                                </p>

                                <h3 className="text-base sm:text-lg font-semibold text-[#672F16] mb-2">10.3 Refund or Payment upon Termination</h3>
                                <p className="text-gray-700 text-xs sm:text-sm">
                                    If this Agreement is terminated by You in accordance with the "Termination" section above, We will refund You any prepaid fees covering the remainder of the term of all subscriptions after the effective date of termination. If this Agreement is terminated by Us in accordance with the "Termination" section above, You will pay any unpaid fees covering the remainder of the term of all Order Forms after the effective date of termination. In no event will termination relieve You of Your obligation to pay any fees payable to Us for the period prior to the effective date of termination.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#093620] mb-4">11. GENERAL PROVISIONS</h2>
                            <div className="space-y-4">
                                <h3 className="text-base sm:text-lg font-semibold text-[#672F16] mb-2">11.1 Entire Agreement and Order of Precedence</h3>
                                <p className="text-gray-700 text-xs sm:text-sm">
                                    This Agreement is the entire agreement between You and Us regarding Your use of Services and Content and supersedes all prior and contemporaneous agreements, proposals or representations, written or oral, concerning its subject matter. No modification, amendment, or waiver of any provision of this Agreement will be effective unless in writing and signed by the party against whom the modification, amendment or waiver is to be asserted. The parties agree that any term or condition stated in Your purchase order or in any other of Your order documentation (excluding Order Forms) is void. In the event of any conflict or inconsistency among the following documents, the order of precedence shall be: (1) the applicable Order Form, (2) this Agreement, and (3) the Documentation.
                                </p>

                                <h3 className="text-base sm:text-lg font-semibold text-[#672F16] mb-2">11.2 Assignment</h3>
                                <p className="text-gray-700 text-xs sm:text-sm">
                                    Neither party may assign any of its rights or obligations hereunder, whether by operation of law or otherwise, without the other party's prior written consent (not to be unreasonably withheld); provided, however, either party may assign this Agreement in its entirety (including all Order Forms), without the other party's consent to its Affiliate or in connection with a merger, acquisition, corporate reorganization, or sale of all or substantially all of its assets.
                                </p>

                                <h3 className="text-base sm:text-lg font-semibold text-[#672F16] mb-2">11.3 Governing Law</h3>
                                <p className="text-gray-700 text-xs sm:text-sm">
                                    This Agreement shall be governed by the laws of India, without regard to its conflict of law principles. No choice of laws rules of any jurisdiction shall apply to this Agreement. The courts located in Hyderabad, India shall have exclusive jurisdiction to adjudicate any dispute arising out of or relating to this Agreement. Each party hereby consents to the exclusive jurisdiction of such courts.
                                </p>
                            </div>
                        </section>
                    </div>

                    <div className="mt-8 sm:mt-12">
                        <Link to="/" className="inline-flex items-center bg-[#2B6E2B] text-white 
                        font-medium py-2 px-4 sm:py-3 sm:px-6 rounded-full hover:bg-green-800 transition 
                        duration-300 text-sm sm:text-base">
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TermsAndConditions;