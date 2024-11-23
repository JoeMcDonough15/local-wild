import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
// async function main() {
//   const alice = await prisma.user.upsert({
//     where: { email: "alice@prisma.io" },
//     update: {},
//     create: {
//       email: "alice@prisma.io",
//       username: "Alice",
//       profileImageUrl: "sammple/image.png",
//       location: "Philadelphia",
//       numYearsExperience: 4,
//       favoriteSubject: "birds",
//       posts: {
//         create: {
//           title: "Check out Prisma with Next.js",
//           content: "https://www.prisma.io/nextjs",
//           published: true,
//         },
//       },
//     },
//   });
//   const bob = await prisma.user.upsert({
//     where: { email: "bob@prisma.io" },
//     update: {},
//     create: {
//       email: "alice@prisma.io",
//       username: "Alice",
//       profileImageUrl: "sammple/image.png",
//       location: "Philadelphia",
//       numYearsExperience: 4,
//       favoriteSubject: "birds",
//       posts: {
//         create: {
//           title: "Check out Prisma with Next.js",
//           content: "https://www.prisma.io/nextjs",
//           published: true,
//         },
//       },
//     },
//   });
//   console.log({ alice, bob });
// }
// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });
