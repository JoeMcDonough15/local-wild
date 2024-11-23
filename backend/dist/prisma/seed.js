import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from "bcryptjs";
async function main() {
    const alice = await prisma.user.upsert({
        where: { email: "alice@prisma.io" },
        update: {},
        create: {
            email: "alice@prisma.io",
            username: "Alice",
            password: bcrypt.hashSync("myPassword"),
            profileImageUrl: "sammple/image.png",
            location: "Philadelphia",
            numYearsExperience: 4,
            favoriteSubject: "birds",
            posts: {
                create: {
                    imageUrl: "image.png",
                    title: "Coopers Hawk",
                    caption: "A Coopers Hawk crying out",
                    fullDescription: "I captured this shot while heading home for the day.  I couldn't believe my luck.  The hawk just landed right in front of me and started crying out.  Luckily I still had my camera out and was able to get a few shots before the bird flew away.",
                    partOfDay: "Early evening",
                    datePhotographed: new Date(),
                },
            },
        },
    });
    const bob = await prisma.user.upsert({
        where: { email: "bob@gmail.com" },
        update: {},
        create: {
            email: "bob@gmail.com",
            username: "Bob",
            password: bcrypt.hashSync("thisismypassword"),
            profileImageUrl: "sampleImage.jpg",
            location: "Denver",
            numYearsExperience: 2,
            favoriteSubject: "bears",
        },
    });
    console.log({ alice, bob });
}
main()
    .then(async () => {
    await prisma.$disconnect();
})
    .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
