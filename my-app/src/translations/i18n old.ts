import {getRequestConfig} from 'next-intl/server';
import { notFound } from 'next/navigation';

 

// export default getRequestConfig(async () => {
//   // Static for now, we'll change this later
//   const locale = 'en';
 
//   console.log(`./translationsPage/${locale}.json`);

//   return {
//     locale,
//     messages: (await import(`./translationsPage/${locale}.json`)).default
//   };
// });



// Массив поддерживаемых локалей
const locales = ['en', 'ru'];


export default getRequestConfig(async ({locale}) => {

  console.log(`./translationsPage/${locale}.json`);
  
  if (!locale || !locales.includes(locale)) {
    //строчка ниже notFound();
    notFound();
    console.log(12);
  }

  return {  
    locale,
    // Загружаем сообщения для текущей локали
    messages: (
      await import(`./translationsPage/${locale}.json`)
    ).default
  };
});

