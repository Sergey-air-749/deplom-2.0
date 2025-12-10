import {getRequestConfig} from 'next-intl/server';
import { notFound } from 'next/navigation';

// Массив поддерживаемых локалей
const locales = ['en', 'ru'];

export default getRequestConfig(async ({locale = 'ru'}) => {

  console.log(`./translationsPage/${locale}.json`);
  
  if (!locale || !locales.includes(locale)) {
    notFound();
    // console.log(12);
  }

  return {  
    locale,
    // Загружаем сообщения для текущей локали
    messages: (
      await import(`./translationsPage/${locale}.json`)
    ).default
  };
});

