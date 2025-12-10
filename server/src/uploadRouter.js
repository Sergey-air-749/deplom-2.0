const { createUploadthing } = require("uploadthing/express");
require('dotenv').config();

// Получаем функцию для создания маршрутизаторов файлов
const f = createUploadthing();

// Определяем ваш FileRouter.
const uploadRouter = {
  // Название маршрута: "imageUploader"
  fileUploader: f({
    // Разрешаем только изображения с максимальным размером 4MB
    blob: {
      maxFileSize: "50MB"
    },
  })

  .onUploadComplete(async ({ metadata, file }) => {
    console.log(file);
    // console.log("✅ Загрузка завершена для файла:", file.name);
    // console.log("URL файла:", file.url);
    // console.log("Метаданные (userId):", metadata.userId || "Гость");

    return { uploadedUrl: file.url };
  }),

};

module.exports = { uploadRouter };