import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from "bcryptjs";

async function main() {
  await prisma.user.createMany({
    data: [
      {
        email: "alice@prisma.io",
        username: "Alice",
        password: bcrypt.hashSync("myPassword"),
        profileImageUrl:
          "https://local-wild-images.s3.us-east-1.amazonaws.com/profile1.png",
        location: "Eugene, Oregon",
      },
      {
        email: "bob@gmail.com",
        username: "Bob",
        password: bcrypt.hashSync("thisismypassword"),
        profileImageUrl:
          "https://local-wild-images.s3.us-east-1.amazonaws.com/profile2.jpg",
        location: "Denver, Colorado",
      },
      {
        email: "jeanne6@email.com",
        username: "Jeanne6",
        password: bcrypt.hashSync("myPassword"),
        profileImageUrl: "",
        location: "Upstate NY",
      },
      {
        email: "shawnymac@prisma.io",
        username: "Shawny_Mac",
        password: bcrypt.hashSync("myPassword"),
        profileImageUrl:
          "https://local-wild-images.s3.us-east-1.amazonaws.com/profile4.png",
        location: "Philadelphia, Pennsylvania",
      },
    ],
  });

  await prisma.post.createMany({
    data: [
      {
        imageUrl:
          "https://local-wild-images.s3.us-east-1.amazonaws.com/bird.jpg",
        title: "Taking Flight",
        caption: "A Coopers Hawk takes off from the trees",
        fullDescription:
          "I captured this shot while heading home for the day.  I couldn't believe my luck.  The hawk came out of nowhere.  Luckily I still had my camera out and was able to get a few shots before the bird flew too far away.  The focus is not great but I am still so grateful for the shot",
        partOfDay: "Late afternoon",
        datePhotographed: new Date(2023, 8, 5),
        photographerId: 1,
      },
      {
        imageUrl:
          "https://local-wild-images.s3.us-east-1.amazonaws.com/fox.jpg",
        title: "Fox Through Trees",
        caption: "A Red Fox peeking out",
        fullDescription:
          "I had heard there was a fox living in our local park but didn't have any luck spotting it until one incredible morning.  I captured the captivating shot of it cautiously peering through the underbrush on a misty morning. After hours of patiently observing the forest floor, I spotted the flicker of orange fur just beyond a tangle of branches. Aha!  My moment had arrived!  The fox, with its keen sense of curiosity and caution, cautiously lifted its head above the ferns, its eyes scanning the surroundings. The soft, dappled light of dawn filtered through the trees, casting a warm glow on the fox’s fur.  I feel this photo reveals the fox's sly, yet watchful expression, perfectly blending with its wild environment.",
        partOfDay: "Early morning",
        datePhotographed: new Date(2024, 6, 17),
        photographerId: 1,
      },
      {
        imageUrl:
          "https://local-wild-images.s3.us-east-1.amazonaws.com/bluejay.jpg",
        title: "Blue in Green",
        caption: "A Blue Jay lands in the grass for a snack",
        fullDescription:
          "I had been snapping some shots of this Blue Jay through the leaves of a tree.  It was hard to get good focus and a clear shot through the foliage.  Then, when I was about to settle on what I had, the bird landed down in the grass and I was able to get the best shot of that day!  It must have a nest nearby because I've been spotting it regularly when I go out for pictures.",
        partOfDay: "Mid morning",
        datePhotographed: new Date(2024, 4, 8),
        photographerId: 2,
      },
      {
        imageUrl:
          "https://local-wild-images.s3.us-east-1.amazonaws.com/bird3.jpg",
        title: "Spectacular Mystery",
        caption: "An unidentified bird sitting in the trees.",
        fullDescription:
          "I am not sure what kind of bird this is but it has the sweetest call.  I was fortunate to get the shot that I did because this thing moves fast!  It took a lot of patience for me to wait until it settled down long enogh to be able to focus in for a good shot.  If anyone knows what kind of bird it is, please comment!",
        partOfDay: "Early afternoon",
        datePhotographed: new Date(2024, 10, 17),
        photographerId: 2,
      },
      {
        imageUrl:
          "https://local-wild-images.s3.us-east-1.amazonaws.com/heron.jpg",
        title: "Heron Hunting",
        caption: "A Blue Heron catching a fish",
        fullDescription:
          "I had been sitting quietly at the edge of the marsh for what felt like hours, waiting for something to unfold. The morning mist still clung to the water, and the only sounds were the faint rustle of reeds swaying in the breeze and the occasional splash of a fish breaking the surface. Patience is a virtue when it comes to wildlife photography, and I had learned long ago that the perfect shot doesn't come on demand—it arrives in its own time.  Then, as if summoned by the silence itself, a blue heron appeared. Its long, slender neck curved gracefully as it stalked through the shallow waters, eyes fixed intently on the rippling surface below. I held my breath, fingers hovering over the camera, ready to capture the elegance of the bird. The light was soft, filtered through the early morning fog, casting a gentle glow over the heron’s silvery feathers.  I adjusted the lens for the close-up, every instinct telling me this was the moment I had been waiting for. The heron froze, its entire body tensed with a silent focus, as if time itself had slowed down. Its legs, seemingly suspended in mid-step, gave no hint of movement, and then, without warning, the heron darted forward. The speed was breathtaking—its beak sliced through the water like a needle through fabric.  For an instant, I saw the flash of silver as the fish was caught, held firmly in the heron’s long, sharp bill. The bird lifted its head with precise, almost ritualistic care, the fish wriggling helplessly. The water droplets hung in the air like diamonds, suspended in the perfect moment between life and capture. My camera clicked, the shutter sound barely audible over the soft lapping of the water.",
        partOfDay: "Early morning",
        datePhotographed: new Date(2024, 9, 11),
        photographerId: 3,
      },
      {
        imageUrl:
          "https://local-wild-images.s3.us-east-1.amazonaws.com/smallbird.jpg",
        title: "Small Bird",
        caption: "A small bird sitting in a tree",
        partOfDay: "Mid morning",
        datePhotographed: new Date(2024, 10, 2),
        photographerId: 3,
      },
      {
        imageUrl:
          "https://local-wild-images.s3.us-east-1.amazonaws.com/bird2.jpg",
        title: "Hawk Swoop",
        caption: "A Coopers Hawk swooping in to land on a branch",
        fullDescription:
          "A striking shot of a Cooper's Hawk during a quiet morning in a local forest preserve. Armed with patience and a keen eye, I spent hours observing the area from a hidden vantage point, waiting for the perfect moment. As the sun began to rise, the hawk swooped in to perch, its wings spread wide in mid-flight. With my camera in hand, I clicked the shutter just as the bird opened its talons to grip the branch!",
        partOfDay: "Early morning",
        datePhotographed: new Date(2024, 2, 6),
        photographerId: 4,
      },
      {
        imageUrl:
          "https://local-wild-images.s3.us-east-1.amazonaws.com/deer.jpg",
        title: "Doe Staring Back",
        caption: "A doe poses for my camera",
        fullDescription:
          "Deer are pretty easy to shoot where I live so it's easy to take them for granted, but I am really proud of this shot. The timing it took me to get the nervous doe to look towards my direction and emulate a pose was a mix of luck and skill.  I love that I was able to get so much detail from the high resolution shot only because she was not moving when I clicked the shutter.",
        partOfDay: "Early morning",
        datePhotographed: new Date(2024, 3, 21),
        photographerId: 4,
      },
      {
        imageUrl:
          "https://local-wild-images.s3.us-east-1.amazonaws.com/groundhog.jpg",
        title: "Focused In",
        caption: "A groundhog sitting focused",
        fullDescription:
          "I captured this charming shot of a groundhog lounging in the tall grass on a serene afternoon. After quietly setting up in a nearby field, I spent a lot of time waiting for the groundhog to emerge from its burrow. As the sun bathed the landscape in soft golden light, the curious groundhog slowly ventured out, sitting upright in the grass, its alert eyes scanning the surroundings.",
        partOfDay: "Mid afternoon",
        datePhotographed: new Date(2023, 5, 5),
        photographerId: 4,
      },
      {
        imageUrl:
          "https://local-wild-images.s3.us-east-1.amazonaws.com/rabbit.jpg",
        title: "Alert Rabbit",
        caption: "An alert rabbit in the grass",
        fullDescription:
          "I captured an intense moment of focus as this rabbit sat in the heart of a sunlit meadow. After patiently waiting for the perfect opportunity, I noticed the rabbit emerging from the underbrush, its ears perked and eyes wide with alertness. The soft breeze stirred the grasses around it as the rabbit paused, seemingly aware of every movement in its surroundings. With a quick yet steady shot, I froze the moment, highlighting the rabbit’s sharp instincts and the serene beauty of the meadow. I think this image perfectly conveys the delicate balance between calm and vigilance in the life of a wild rabbit.",
        partOfDay: "Early afternoon",
        datePhotographed: new Date(2023, 5, 5),
        photographerId: 4,
      },
    ],
  });

  await prisma.commentOnPost.createMany({
    data: [
      {
        commentText: "Absolutely beautiful!",
        commenterId: 1,
        postId: 3,
      },
      { commentText: "Incredible Picture!", commenterId: 1, postId: 4 },
      {
        commentText: "Sooooo cool!!!",
        commenterId: 2,
        postId: 5,
      },
      { commentText: "What a great shot!", commenterId: 2, postId: 6 },
      {
        commentText: "Amazing photograph!  What luck!!",
        commenterId: 3,
        postId: 2,
      },
      {
        commentText: "You should be really proud of this!  Just fantastic!!",
        commenterId: 3,
        postId: 1,
      },
      { commentText: "Wow!!!", commenterId: 4, postId: 2 },
      {
        commentText: "I love the great resolution you got on this!!!",
        commenterId: 4,
        postId: 3,
      },

      { commentText: "Excellent shot.", commenterId: 3, postId: 7 },
      { commentText: "Super cool!", commenterId: 1, postId: 8 },
      { commentText: "I love this", commenterId: 2, postId: 9 },
      { commentText: "So great", commenterId: 1, postId: 10 },
    ],
  });

  await prisma.commentReply.createMany({
    data: [
      {
        replyText: "I still can't believe I got this!",
        replyerId: 3,
        replyingTo: 3,
      },
      { replyText: "I know, right??", replyerId: 4, replyingTo: 9 },
      {
        replyText: "I hope to get a shot like this soon!",
        replyerId: 2,
        replyingTo: 9,
      },
    ],
  });
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
