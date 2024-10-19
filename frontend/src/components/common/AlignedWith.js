import GoldStandardLogo from '../../assets/images/logos/brand/gs-logo.svg';
import GreenhouseGasProtocolLogo from '../../assets/images/logos/brand/ghg-logo.svg';
import VerraLogo from '../../assets/images/logos/brand/verra-logo.svg';
import { ReactComponent as Line } from '../../assets/images/logos/brand/line.svg'

const AlignedWith = () => {
   return (
      <div className="bg-[#1A4D2E] py-8 px-4">
         <div className="max-w-7xl mx-auto">
            <h2 className="text-center font-lora mb-6">
               <div className='flex justify-center items-center space-x-1'>
                  <Line className="w-12 sm:w-20 text-[#E1F3F5]" />
                  <span className='text-[#FEFEFE] text-sm sm:text-base'>Aligned With</span>
                  <Line className="w-12 sm:w-20 text-[#E1F3F5]" />
               </div>
            </h2>
            <div className="flex justify-center items-center space-x-4 sm:space-x-8 md:space-x-20">
               <div>
                  <a href="https://www.goldstandard.org/" target='_blank' rel="noreferrer">
                     <img src={GoldStandardLogo} alt="Gold-Standard" className="h-10 sm:h-12 md:h-16 lg:h-20" />
                  </a>
               </div>
               <div>
                  <a href="https://ghgprotocol.org/" target='_blank' rel="noreferrer">
                     <img src={GreenhouseGasProtocolLogo} alt="Greenhouse-Gas-Protocol" className="h-10 sm:h-12 md:h-16 lg:h-20" />
                  </a>
               </div>
               <div>
                  <a href="https://verra.org/programs/verified-carbon-standard/" target='_blank' rel="noreferrer">
                     <img src={VerraLogo} alt="Verra" className="h-10 sm:h-12 md:h-16 lg:h-20" />
                  </a>
               </div>
            </div>
         </div>
      </div>
   );
};

export default AlignedWith;