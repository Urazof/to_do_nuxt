/**
 * DEPRECATED: Этот файл больше не используется
 * Подключение к MongoDB теперь происходит в server/plugins/mongodb.ts
 *
 * Файлы в папке server/plugins/ загружаются автоматически Nitro
 * и не требуют регистрации в nuxt.config.ts
 */

// import { connect } from 'mongoose';
//
// export default async () => {
//     const config = useRuntimeConfig();
//
//     try {
//         await connect(config.mongodbUri);
//         console.log('Connected to MongoDB');
//     } catch (e) {
//         console.error(e);
//     }
// };
