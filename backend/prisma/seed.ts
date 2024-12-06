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
        profileImageUrl:
          "https://local-wild-images.s3.us-east-1.amazonaws.com/profile3.png",
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
        caption: "A Cooper's Hawk takes off from the trees",
        fullDescription:
          "I captured this shot while on vacation in Pennsylvania.  I couldn't believe my luck.  The hawk came from out of nowhere.  Luckily I still had my camera out and was able to get a few shots before the bird flew too far away.  The focus is not great but I am still so grateful for the shot",
        partOfDay: "Late afternoon",
        locationString: "Core Creek Park, Pennsylvania",
        lat: 40.1948603,
        lng: -74.9093707,
        datePhotographed: new Date(2023, 8, 5),
        photographerId: 1,
      },
      {
        imageUrl:
          "https://local-wild-images.s3.us-east-1.amazonaws.com/fox.jpg",
        title: "Fox Through Trees",
        caption: "A Red Fox peeking out",
        fullDescription:
          "I had heard there was a fox living near one of the park trails but didn't have any luck spotting it until one incredible morning.  I captured the captivating shot of it cautiously peering through the underbrush on a misty morning. After hours of patiently observing the forest floor, I spotted the flicker of orange fur just beyond a tangle of branches. Aha!  My moment had arrived!  The fox, with its keen sense of curiosity and caution, cautiously lifted its head above the ferns, its eyes scanning the surroundings. The soft, dappled light of dawn filtered through the trees, casting a warm glow on the fox’s fur.  I feel this photo reveals the fox's sly, yet watchful expression, perfectly blending with its wild environment.",
        partOfDay: "Early morning",
        locationString: "Mount Hood National Forest",
        lat: 45.3688046,
        lng: -121.8184487,
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
        locationString: "Sargents, Colorado",
        lat: 38.2997087,
        lng: -106.4439006,
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
        locationString: "Gunnison National Forest, Colorado",
        lat: 38.639841,
        lng: -106.5596121,
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
        locationString: "Tupper Lake Park, New York",
        lat: 44.2332535,
        lng: -74.4537124,
        photographerId: 3,
      },
      {
        imageUrl:
          "https://local-wild-images.s3.us-east-1.amazonaws.com/smallbird.jpg",
        title: "Small Bird",
        caption: "A small bird sitting in a tree",
        partOfDay: "Mid morning",
        fullDescription:
          "Got this picture of a bird right in my backyard while I was eating breakfast.  Luckily, my camera was not far and I was able to get a few photos before the bird flew away.",
        datePhotographed: new Date(2024, 10, 2),
        photographerId: 3,
      },
      {
        imageUrl:
          "https://local-wild-images.s3.us-east-1.amazonaws.com/bird2.jpg",
        title: "Hawk Swoop",
        caption: "A Cooper's Hawk swooping in to land on a branch",
        fullDescription:
          "A striking shot of a Cooper's Hawk during a quiet morning in a local forest preserve. Armed with patience and a keen eye, I spent hours observing the area from a hidden vantage point, waiting for the perfect moment. As the sun began to rise, the hawk swooped in to perch, its wings spread wide in mid-flight. With my camera in hand, I clicked the shutter just as the bird opened its talons to grip the branch!",
        partOfDay: "Early morning",
        locationString: "Woodfield Reservation, New Jersey",
        lat: 40.3686692,
        lng: -74.6974581,
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
        locationString: "Washington Crossing State Park, New Jersey",
        lat: 40.3053972,
        lng: -74.85678,
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
        locationString: "Lahaska, Pennsylvania",
        lat: 40.3403432,
        lng: -75.0299605,
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
        locationString: "Tyler Park, Bucks County, Pennsylvania",
        lat: 40.231548,
        lng: -74.954861,
        datePhotographed: new Date(2023, 5, 5),
        photographerId: 4,
      },
      {
        imageUrl:
          "https://local-wild-images.s3.us-east-1.amazonaws.com/bear-stare.png",
        title: "Bear Stare",
        caption: "A grizzly bear chewing some grass",
        fullDescription:
          "As I crouched low in the tall grasses of British Columbia Wildlife Park, the world seemed to fall away. The only sound was the whisper of the wind through the trees and the steady rhythm of my breathing. It was early morning, just as the first rays of sunlight pierced through the mist, casting a soft golden glow across the landscape. I had been waiting for hours, my camera ready, my eyes trained on the dense thicket where I knew something was stirring. Then, there it was—a massive, powerful figure emerging from the shadows. A grizzly bear. Its dark fur seemed to shimmer as it moved, muscles rippling under its thick coat. I held my breath, my heart racing, as it ambled across the clearing, its massive paws leaving prints in the soft earth. But instead of the aggressive stance I was used to seeing in most grizzly encounters, this one was calm, almost serene. To my surprise, the bear dropped to its haunches and began chewing on a patch of fresh grass. Its large jaws worked slowly, almost meditative, as it grazed in the afternoon sun. The sight was nothing like the fierce, wild animal most people imagine when they think of a grizzly. It was a peaceful moment, a rare glimpse into a side of nature that few ever get to witness. I could feel my hands steady as I adjusted the lens, capturing the scene. The sunlight flickered off the bear’s fur, and I clicked the shutter, hoping to preserve this quiet, unexpected moment. As the bear chewed and looked out over the park, its eyes briefly met mine—an unspoken understanding, a brief connection between two creatures in a vast and untamed world.",
        partOfDay: "afternoon",
        locationString: "BC Wildlife Park, Canada",
        lat: 50.73229,
        lng: -119.9787075,
        datePhotographed: new Date(2022, 4, 3),
        photographerId: 1,
      },
      {
        imageUrl:
          "https://local-wild-images.s3.us-east-1.amazonaws.com/dolphin.png",
        title: "Dolphin Jump",
        caption: "A dolphin leaps out of the water in the Everglades",
        fullDescription:
          "I had been out on the water for hours, the stillness of the Everglades stretching out around me like an endless canvas. The air was thick with humidity, and the soft murmur of the mangroves whispered through the mist. I wasn’t expecting much—just another quiet morning, hoping to catch a glimpse of the elusive wildlife that calls this place home. Then, out of nowhere, a splash. The water rippled in an arc, and there, just below the surface, a sleek shape emerged—a dolphin. It moved effortlessly, its dorsal fin cutting through the water like a knife. For a moment, I forgot to breathe, my fingers frozen on the camera.  With a gentle leap, the dolphin arced into the air, its body catching the sunlight before slipping back into the depths. I snapped the shutter, capturing that fleeting moment of grace. In that brief instant, everything felt aligned—the wild beauty of the Everglades, the playful spirit of the dolphin, and the quiet thrill of being in the right place at the right time.",
        partOfDay: "Sunrise",
        locationString: "Everglades National Park, Florida",
        lat: 25.2863834,
        lng: -80.8983519,
        datePhotographed: new Date(2021, 2, 3),
        photographerId: 1,
      },
      {
        imageUrl:
          "https://local-wild-images.s3.us-east-1.amazonaws.com/wild-cat.png",
        title: "Wild Cat On The Rocks",
        caption: "A wild cat lying on rocks at the park",
        fullDescription:
          "I was deep in the Oregon woods, the forest thick with moss and the scent of pine. The quiet was overwhelming, and I could feel the weight of the trees above me as I moved cautiously, camera in hand. I’d been tracking signs of a wild cat for days—paw prints in the mud, a rustle in the underbrush—but nothing had prepared me for the moment it appeared. A flicker of movement to my right. Slowly, I turned, heart racing. There, slipping silently between the trees, was a wild cat—its coat a perfect blend with the shadows, its eyes gleaming with quiet intelligence. For a heartbeat, we just stared at each other, before it melted back into the forest, its movements as fluid and graceful as the wind. I snapped the shot, capturing that fleeting, elusive presence. It was over in seconds, but the image stayed with me. A reminder that sometimes the wildest creatures remain hidden, not out of fear, but out of sheer majesty.",
        locationString: "Quartz Park, Eugene, Oregon",
        partOfDay: "Early afternoon",
        lat: 44.0266835,
        lng: -122.9186825,
        datePhotographed: new Date(2024, 1, 23),
        photographerId: 1,
      },
      {
        imageUrl:
          "https://local-wild-images.s3.us-east-1.amazonaws.com/lynx-stretch.png",
        title: "Lynx Stretch",
        caption: "A lynx stretching out in the snow",
        fullDescription:
          "It was early morning at the Greenwood Wildlife Rehabilitation Center in Colorado, the world still blanketed in snow, the air crisp and biting. I had been keeping my distance, watching the animals slowly wake from the quiet of the night. The lynx, a patient recovering here after an injury, was just beginning to stir.  I caught sight of it in the distance, its sleek form emerging from a cluster of pine trees. The lynx stretched, its powerful legs extending with graceful precision, its body arching like a perfect curve against the white landscape. The snow around it glittered in the soft light, and for a moment, everything seemed still, as if time itself had paused.  I raised my camera and clicked the shutter, capturing that rare moment of wild elegance. The lynx paused for just a beat, its piercing gaze meeting mine, before it padded off into the snow, its movements as fluid as ever. It was a reminder that even in captivity, the spirit of the wild is never truly gone.",
        partOfDay: "Afternoon",
        locationString:
          "Greenwood Wildlife Rehabilitation Center, Longmont, Colorado",
        lat: 40.207273,
        lng: -105.2185143,
        datePhotographed: new Date(2024, 7, 13),
        photographerId: 2,
      },
      {
        imageUrl:
          "https://local-wild-images.s3.us-east-1.amazonaws.com/raccoon.png",
        title: "Raccoon Walking",
        caption: "A raccoon walking around the park at dusk",
        fullDescription:
          "The park was quiet as dusk settled in, the fading light casting long shadows across the path. I had been walking slowly, hoping to spot something—anything—as the day turned to night. The air was cooler now, the sound of rustling leaves the only thing breaking the silence.  And then I saw it: a raccoon, emerging from the thicket with that curious, sly gait of theirs. It moved across the grass, its eyes glinting in the low light, pausing every few steps to sniff the air or check its surroundings. Its fur was thick and textured, blending perfectly with the twilight shadows. I snapped a few quick shots, capturing the way the raccoon moved with that perfect mix of caution and confidence, as if it owned the park at this hour.  For a few moments, we shared the space, the world around us hushed as the night began to fall. As the raccoon disappeared into the underbrush, I couldn’t help but smile. It was a reminder that the world keeps turning, even when the sun goes down—full of little mysteries waiting to be noticed.",
        partOfDay: "dusk",
        locationString: "Bear Creek Trail, Telluride, Colorado",
        lat: 37.9342556,
        lng: -107.8119607,
        datePhotographed: new Date(2020, 10, 3),
        photographerId: 2,
      },
      {
        imageUrl:
          "https://local-wild-images.s3.us-east-1.amazonaws.com/elk-family.png",
        title: "Elk Family",
        caption: "Family of elk on a field",
        fullDescription:
          "It was a perfect afternoon—warm sunlight streaming through the trees, the air soft and fragrant with pine. I had been slowly making my way through the meadow, camera in hand, when I saw them: a family of elk grazing peacefully in the golden light.  The adults were calm, their massive antlers catching the sun’s rays, while the young calves stayed close, their legs wobbly but determined as they nibbled at the fresh grass. The whole scene was serene—an image of quiet family life in the wild. I crouched low, careful not to disturb them, and waited for the right moment.  As a calf wandered just a little too far from its mother, she gently nudged it back into the fold, and I clicked the shutter. The warmth of the moment filled the frame—a snapshot of tender protection, wild and unspoken, framed perfectly by the afternoon light. It was one of those rare, beautiful moments when the world seems to pause, and you’re lucky enough to witness it.",
        partOfDay: "Afternoon",
        locationString: "Albany County, Wyoming",
        lat: 42.4131211,
        lng: -105.5771062,
        datePhotographed: new Date(2019, 5, 16),
        photographerId: 2,
      },
      {
        imageUrl:
          "https://local-wild-images.s3.us-east-1.amazonaws.com/bull-elk.png",
        title: "Bull Elk",
        caption: "Bull Elk with large antlers",
        fullDescription:
          "The sun was beginning to dip lower, casting a warm amber glow across the meadow. I had been following the elk family, but as the light shifted, something caught my eye on the far edge of the field. There, standing tall and proud against the backdrop of the forest, was a solitary bull elk.  His antlers were impressive—massive, branching out in elegant, sharp lines, catching the last of the sunlight. He stood still for a moment, surveying the land with a regal air, as if he owned the entire valley. His presence was commanding, yet there was a calmness to him, like a silent guardian of the wild.  I quietly lifted my camera, the stillness of the scene almost reverent. The bull elk turned his head, eyes meeting mine for just an instant, before he slowly began to move, his powerful muscles rippling under his coat. I captured the shot, freezing that moment of wild majesty in time, a reminder of the quiet strength that roams the land, unseen by most but felt by all.",
        partOfDay: "Afternoon",
        locationString: "Albany County, Wyoming",
        lat: 42.4131211,
        lng: -105.5771062,
        datePhotographed: new Date(2019, 5, 16),
        photographerId: 2,
      },
      {
        imageUrl:
          "https://local-wild-images.s3.us-east-1.amazonaws.com/red-fox-in-snow.png",
        title: "Fox and Mouse",
        caption: "A red fox hunting a mouse in the snow",
        fullDescription:
          "The Dellbrücker Heide was quiet that second morning of my vacation, the mist still lingering in the low-lying areas of the heathland. I moved slowly through the tall grasses, the world bathed in soft, early light. Everything seemed to be holding its breath, as if waiting for something to happen.  And then, through the haze, I spotted it—a red fox, its russet coat vivid against the muted backdrop. It was crouched low in the grass, its sharp eyes locked on something just ahead. The tension in the air was palpable as the fox’s muscles coiled, preparing to strike. I held my breath, my camera ready, knowing this moment would be fleeting.  In a sudden blur of motion, the fox pounced, disappearing into the tall grasses for a split second before emerging with a small, thrashing mouse in its jaws. The entire scene unfolded in mere seconds, but I managed to snap the shot—capturing the grace and precision of a predator at work.  As the fox disappeared back into the heath, its meal in tow, I couldn’t help but marvel at the untamed beauty of the moment. It was a reminder of the quiet, relentless rhythms of nature, where survival is always in motion.",
        partOfDay: "late afternoon",
        locationString: "Dellbrücker Heide, Germany",
        lat: 50.9853162,
        lng: 7.0607678,
        datePhotographed: new Date(2018, 6, 29),
        photographerId: 3,
      },
      {
        imageUrl:
          "https://local-wild-images.s3.us-east-1.amazonaws.com/family-of-bears.png",
        title: "Bear Family",
        caption: "A family of bears grazing",
        fullDescription:
          "While on a work trip, I was able to sneak away to the San Juan National Forest.  It was a peaceful mid-afternoon in the meadow, the sun high and warm, casting long shadows across the rolling hills. The air was filled with the scent of fresh grass and earth, the quiet hum of insects drifting on the breeze. I had been watching the landscape for some time when I spotted them—a family of bears, moving lazily through the tall grass.  The mother, large and strong, moved with a quiet grace, her cubs trailing behind her, their fur still thick and soft. They were grazing, plucking at the tender shoots of grass with slow, deliberate movements. Every now and then, one of the cubs would playfully nudge the other, their playful antics breaking the otherwise serene atmosphere.  I lowered myself to the ground, careful not to disturb them, and clicked the shutter. The moment was pure—an unguarded family scene in the wild, a snapshot of the tenderness and bond between mother and cubs. As they continued to forage in the afternoon sun, I felt a sense of privilege in witnessing such a rare, quiet moment of wild life—beautiful, simple, and full of heart.",
        partOfDay: "mid-afternoon",
        datePhotographed: new Date(2016, 9, 3),
        locationString: "San Juan National Forest, Colorado",
        lat: 37.5526338,
        lng: -107.7432327,
        photographerId: 3,
      },

      {
        imageUrl:
          "https://local-wild-images.s3.us-east-1.amazonaws.com/orca-flip.png",
        title: "Blue Whale Flip",
        caption: "A large Blue Whale flipping in the ocean",
        fullDescription:
          "It was a dream come true, sailing out on the open ocean, the vast blue stretching endlessly in all directions. The ship was cutting through the water, and passengers were scattered along the deck, eyes scanning the horizon for any signs of life. I had been watching for hours when suddenly, a massive splash broke the stillness.  A blue whale, its immense body rising from the depths, flipped gracefully into the air—its sheer size almost impossible to comprehend. Time seemed to slow as the whale arced through the water, its enormous tail fin slapping the surface with a thunderous sound that reverberated through the air. I could hardly believe it as I raised my camera, clicking the shutter just as it came down with a splash, sending waves rippling across the ocean.  In that brief moment, I was completely aware of the whale’s power and grace, a creature so vast it seemed to command the entire sea. The ship felt small beneath me, a mere speck in the presence of this magnificent creature. I knew I had captured something rare—a fleeting, extraordinary moment of life in the deep blue, a reminder of the wild beauty that still roams our oceans.",
        partOfDay: "Early evening",
        lat: 36.5305668,
        lng: -54.8122022,
        datePhotographed: new Date(2023, 11, 3),
        photographerId: 4,
      },
      {
        imageUrl:
          "https://local-wild-images.s3.us-east-1.amazonaws.com/rams-on-hill.png",
        title: "Rams on A Hill",
        caption: "A group of rams playing on a hillside",
        fullDescription:
          "I had been exploring the rugged beauty of Nedre Heidal, Norway, for days, the mountains towering above me, their peaks dusted with snow. It was a perfect day—cool air, clear skies, and the quiet serenity of the Norwegian countryside. I was hiking up a hillside, taking in the sweeping views, when I saw them: a group of rams grazing near the crest of the hill, their thick coats blending with the colors of the landscape.  Their curved horns gleamed in the sunlight, casting shadows on their muscular frames as they moved slowly through the grass, completely at ease. There was a quiet strength in their presence, as though they were the guardians of this ancient land, unfazed by my intrusion. I crouched down, trying to remain as unobtrusive as possible, my camera ready.  One of the rams turned toward me, his eyes sharp and focused, as if measuring my presence. For a brief moment, our gaze locked, and then, just as effortlessly, he turned away and resumed grazing with the others. I clicked the shutter, capturing the quiet dignity of the group against the backdrop of Norway's wild beauty.  In that moment, I was reminded of the timeless rhythms of nature—of how, even while on vacation, I had stumbled upon a scene that felt like a small, unspoken piece of this land’s ancient story.",
        partOfDay: "Mid-Afternoon",
        locationString: "Nedre Heidal, Norway",
        lat: 61.7014892,
        lng: 9.4058274,
        datePhotographed: new Date(2024, 11, 14),
        photographerId: 4,
      },
      {
        imageUrl:
          "https://local-wild-images.s3.us-east-1.amazonaws.com/butterfly.png",
        title: "Butterfly Landing",
        caption: "A beautiful butterfly lands on a flower",
        fullDescription:
          "It was one of those rare moments when everything aligned perfectly. I had been photographing all morning, the warm sunlight dancing through the leaves, casting a golden glow over the meadow. I crouched down to get a closer look at a vibrant patch of wildflowers when I saw a butterfly, its wings a burst of yellow and black, gliding toward a blossom.  It landed gently, the light catching the fine details of its wings as they opened and closed in the soft breeze. The flower seemed to hold its breath, as if it, too, was in awe of the delicate creature now perched upon it. My camera clicked silently, and in that fraction of a second, I captured the perfect close-up: even getting the delicate details of the butterfly’s wings!  Everything else faded away—the only thing in the frame was this fleeting moment of beauty. The butterfly stayed for just a heartbeat before fluttering away, but I knew I had captured something special.",
        partOfDay: "Morning",
        locationString: "Frederick County, Maryland",
        lat: 39.5421695,
        lng: -77.177758,
        datePhotographed: new Date(2024, 12, 3),
        photographerId: 4,
      },
      {
        imageUrl:
          "https://local-wild-images.s3.us-east-1.amazonaws.com/black-bear.png",
        title: "Black Bear in the Park",
        caption: "A black bear just hanging out",
        fullDescription:
          "The trails of Mt. Pisgah State Park were quiet that afternoon, the forest alive with the soft sounds of rustling leaves and distant birdcalls. I had been hiking through the woods, the scent of pine and earth thick in the air, when a flicker of movement caught my eye. I paused, scanning the trees, and there it was—a black bear, moving gracefully through the underbrush.  Its dark coat blended almost perfectly with the shadows of the forest, but its size and presence were undeniable. The bear was foraging, sniffing around the base of a tree, unaware of my presence. I crouched low, careful not to make a sound, my camera in hand, hoping for the perfect shot.  The bear lifted its head, and for a moment, our eyes met—quiet curiosity on both sides. I held my breath, not wanting to startle it, and clicked the shutter just as it turned back to its task, ambling deeper into the forest. It was a brief encounter, but one that filled me with awe. In that moment, I was reminded of the untamed beauty of Mt. Pisgah—where the wild still roams, and the quiet majesty of creatures like this black bear can be seen in the heart of Pennsylvania’s wilderness.",
        partOfDay: "afternoon",
        locationString: "Mount Pisgah State Park, Pennsylvania",
        lat: 41.803795,
        lng: -76.6717296,
        datePhotographed: new Date(2024, 8, 20),
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
      {
        postId: 1,
        commenterId: 4,
        commentText: "Nature at its finest – a true moment captured in time.",
      },
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
