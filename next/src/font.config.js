import { Inter,Roboto, Open_Sans, Lato, Montserrat, Poppins, 
    Nunito, Source_Sans_3, Merriweather, Noto_Sans, 
    Quicksand, Work_Sans, Raleway, Ubuntu, Fira_Sans } from 'next/font/google';
  import localFont from 'next/font/local';
  
  // Google Fonts
  export const inter = Inter({ 
    subsets: ['latin'], 
    display: 'swap', 
    weight: ['400', '500', '600', '700'] 
  });
  
  export const roboto = Roboto({ 
    subsets: ['latin'], 
    display: 'swap', 
    weight: ['400', '500', '700'] 
  });
  
  export const openSans = Open_Sans({ 
    subsets: ['latin'], 
    display: 'swap', 
    weight: ['400', '600', '700'] 
  });
  
  export const lato = Lato({ 
    subsets: ['latin'], 
    display: 'swap', 
    weight: ['400', '700'] 
  });
  
  export const montserrat = Montserrat({ 
    subsets: ['latin'], 
    display: 'swap', 
    weight: ['400', '500', '600', '700'] 
  });
  
  export const poppins = Poppins({ 
    subsets: ['latin'], 
    display: 'swap', 
    weight: ['400', '500', '600', '700'] 
  });
  
  export const nunito = Nunito({ 
    subsets: ['latin'], 
    display: 'swap', 
    weight: ['400', '600', '700'] 
  });
  
  export const sourceSans = Source_Sans_3({ 
    subsets: ['latin'], 
    display: 'swap', 
    weight: ['400', '600', '700'] 
  });
  
  export const merriweather = Merriweather({ 
    subsets: ['latin'], 
    display: 'swap', 
    weight: ['400', '700'] 
  });
  
  export const notoSans = Noto_Sans({ 
    subsets: ['latin'], 
    display: 'swap', 
    weight: ['400', '600', '700'] 
  });
  
  export const quicksand = Quicksand({ 
    subsets: ['latin'], 
    display: 'swap', 
    weight: ['400', '500', '600', '700'] 
  });
  
  export const workSans = Work_Sans({ 
    subsets: ['latin'], 
    display: 'swap', 
    weight: ['400', '500', '600', '700'] 
  });
  
  export const raleway = Raleway({ 
    subsets: ['latin'], 
    display: 'swap', 
    weight: ['400', '500', '600', '700'] 
  });
  
  export const ubuntu = Ubuntu({ 
    subsets: ['latin'], 
    display: 'swap', 
    weight: ['400', '500', '700'] 
  });
  
  export const firaSans = Fira_Sans({ 
    subsets: ['latin'], 
    display: 'swap', 
    weight: ['400', '500', '600', '700'] 
  });
  

  // Font Usage Helper
  export const fontClasses = {
    inter: inter.className,
    roboto: roboto.className,
    openSans: openSans.className,
    lato: lato.className,
    montserrat: montserrat.className,
    poppins: poppins.className,
    nunito: nunito.className,
    sourceSans: sourceSans.className,
    merriweather: merriweather.className,
    notoSans: notoSans.className,
    quicksand: quicksand.className,
    workSans: workSans.className,
    raleway: raleway.className,
    ubuntu: ubuntu.className,
    firaSans: firaSans.className,
  };
  
  // Inline Styles Helper
  export const fontStyles = {
    inter: inter.style,
    roboto: roboto.style,
    openSans: openSans.style,
    lato: lato.style,
    montserrat: montserrat.style,
    poppins: poppins.style,
    nunito: nunito.style,
    sourceSans: sourceSans.style,
    merriweather: merriweather.style,
    notoSans: notoSans.style,
    quicksand: quicksand.style,
    workSans: workSans.style,
    raleway: raleway.style,
    ubuntu: ubuntu.style,
    firaSans: firaSans.style,
  };