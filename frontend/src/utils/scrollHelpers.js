export const scrollToElement = (id) => {
   const element = document.getElementById(id);
   if (element) {
      const yOffset = -79;
      const yPosition = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({
         top: yPosition,
         behavior: 'smooth',
      });
   }
};
