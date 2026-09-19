import { PrismaClient } from "@prisma/client";
import { customAlphabet } from "nanoid";

const prisma = new PrismaClient();

const nanoid = customAlphabet("123456789ABCDEFGHJKLMNPQRSTUVWXYZ", 8);

const generateProducts = () => {
  const now = new Date();

  const addMonths = (months: number) => {
    const date = new Date();
    date.setMonth(now.getMonth() + months);
    return date;
  };

  return [
    {
      productId: nanoid(),
      productName: "Sigiriya Rock Fortress Guided Tour",
      destination: "Sigiriya",
      category: "Tour",
      description:
        "Climb the ancient Lion Rock fortress of Sigiriya. This guided tour includes historical insights into King Kasyapa's palace, the famous frescoes, and the Mirror Wall.",
      imageUrl: "",
      price: 13500.0,
      inventoryCount: 30,
      validFrom: now,
      validUntil: addMonths(3),
      status: "ACTIVE",
    },
    {
      productId: nanoid(),
      productName: "Ella Train Ride & Nine Arches Bridge",
      destination: "Ella",
      category: "Experience",
      description:
        "Experience one of the most scenic train rides in the world from Kandy to Ella. Afterwards, visit the iconic Nine Arches Bridge and hike up Little Adam's Peak for sunset.",
      imageUrl: "",
      price: 4500.0,
      inventoryCount: 40,
      validFrom: now,
      validUntil: addMonths(2),
      status: "ACTIVE",
    },
    {
      productId: nanoid(),
      productName: "Yala National Park Leopard Safari",
      destination: "Yala",
      category: "Tour",
      description:
        "A half-day jeep safari in Yala National Park, known for having one of the highest leopard densities in the world. Spot elephants, crocodiles, and exotic birds.",
      imageUrl: "",
      price: 25000.0,
      inventoryCount: 15,
      validFrom: now,
      validUntil: addMonths(4),
      status: "ACTIVE",
    },
    {
      productId: nanoid(),
      productName: "Galle Fort Heritage Walk",
      destination: "Galle",
      category: "Activity",
      description:
        "Stroll through the cobblestone streets of the UNESCO World Heritage Galle Fort. Discover colonial Dutch architecture, boutique shops, and a stunning sunset by the lighthouse.",
      imageUrl: "",
      price: 6000.0,
      inventoryCount: 100,
      validFrom: now,
      validUntil: addMonths(6),
      status: "ACTIVE",
    },
    {
      productId: nanoid(),
      productName: "Mirissa Whale Watching Cruise",
      destination: "Mirissa",
      category: "Activity",
      description:
        "Set sail on the Indian Ocean to witness majestic blue whales and playful dolphins in their natural habitat. Includes a light breakfast and an expert marine guide.",
      imageUrl: "",
      price: 16500.0,
      inventoryCount: 45,
      validFrom: now,
      validUntil: addMonths(1),
      status: "ACTIVE",
    },
    {
      productId: nanoid(),
      productName: "Temple of the Tooth Relic Visit",
      destination: "Kandy",
      category: "Experience",
      description:
        "A spiritual journey to the Sri Dalada Maligawa in Kandy, which houses the sacred tooth relic of Lord Buddha. Witness traditional drumming and beautiful Kandyan architecture.",
      imageUrl: "",
      price: 4500.0,
      inventoryCount: 200,
      validFrom: now,
      validUntil: addMonths(5),
      status: "ACTIVE",
    },
    {
      productId: nanoid(),
      productName: "Nuwara Eliya Tea Plantation Tour",
      destination: "Nuwara Eliya",
      category: "Tour",
      description:
        "Explore the lush green tea estates of 'Little England'. Learn the art of Ceylon tea plucking, visit a working factory, and enjoy a fresh cup of premium highland tea.",
      imageUrl: "",
      price: 7500.0,
      inventoryCount: 60,
      validFrom: now,
      validUntil: addMonths(2),
      status: "ACTIVE",
    },
    {
      productId: nanoid(),
      productName: "Pigeon Island Snorkeling Adventure",
      destination: "Trincomalee",
      category: "Activity",
      description:
        "Take a boat ride to Pigeon Island National Park. Snorkel in crystal-clear waters to see vibrant coral reefs, blacktip reef sharks, and sea turtles.",
      imageUrl: "",
      price: 12000.0,
      inventoryCount: 25,
      validFrom: now,
      validUntil: addMonths(3),
      status: "ACTIVE",
    },
    {
      productId: nanoid(),
      productName: "Arugam Bay Surf Camp (5 Days)",
      destination: "Arugam Bay",
      category: "Package",
      description:
        "Catch the best waves in one of the world's top surfing spots. This 5-day package includes daily surf lessons, board rentals, beachfront accommodation, and breakfast.",
      imageUrl: "",
      price: 135000.0,
      inventoryCount: 8,
      validFrom: now,
      validUntil: addMonths(4),
      status: "ACTIVE",
    },
    {
      productId: nanoid(),
      productName: "Colombo City Tuk-Tuk Tour",
      destination: "Colombo",
      category: "Tour",
      description:
        "Zip through the bustling capital city in a classic tuk-tuk. Visit the Lotus Tower, Gangaramaya Temple, Independence Square, and enjoy street food at Galle Face Green.",
      imageUrl: "",
      price: 10500.0,
      inventoryCount: 20,
      validFrom: now,
      validUntil: addMonths(6),
      status: "ACTIVE",
    },
    {
      productId: nanoid(),
      productName: "Udawalawe Elephant Safari",
      destination: "Udawalawe",
      category: "Experience",
      description:
        "Get up close with wild Asian elephants in their natural habitat. Includes a visit to the Udawalawe Elephant Transit Home which cares for orphaned elephant calves.",
      imageUrl: "",
      price: 22500.0,
      inventoryCount: 12,
      validFrom: now,
      validUntil: addMonths(2),
      status: "ACTIVE",
    },
    {
      productId: nanoid(),
      productName: "Adam's Peak Sunrise Trek",
      destination: "Dalhousie",
      category: "Activity",
      description:
        "A midnight pilgrimage climb up Adam's Peak (Sri Pada). Reach the summit just in time to witness one of the most breathtaking and spiritually significant sunrises.",
      imageUrl: "",
      price: 6000.0,
      inventoryCount: 50,
      validFrom: now,
      validUntil: addMonths(1),
      status: "ACTIVE",
    },
    {
      productId: nanoid(),
      productName: "Hikkaduwa Coral Reef Scuba Diving",
      destination: "Hikkaduwa",
      category: "Activity",
      description:
        "Explore historic shipwrecks and thriving coral reefs off the southern coast. Includes 2 guided dives, equipment rental, and refreshments. PADI certification required.",
      imageUrl: "",
      price: 27000.0,
      inventoryCount: 10,
      validFrom: now,
      validUntil: addMonths(5),
      status: "ACTIVE",
    },
    {
      productId: nanoid(),
      productName: "Luxury Ayurveda Retreat (3 Nights)",
      destination: "Bentota",
      category: "Accommodation",
      description:
        "Rejuvenate your mind and body with a 3-night stay at a premium beachfront Ayurveda resort. Includes daily spa treatments, yoga sessions, and personalized wellness meals.",
      imageUrl: "",
      price: 195000.0,
      inventoryCount: 5,
      validFrom: now,
      validUntil: addMonths(3),
      status: "ACTIVE",
    },
    {
      productId: nanoid(),
      productName: "Galle Face Hotel Grand Dinner Buffet",
      destination: "Colombo",
      category: "Dinner Buffet",
      description:
        "Enjoy a lavish international dinner buffet at the historic Galle Face Hotel overlooking the Indian Ocean. Features live action stations, fresh seafood, and a wide array of local and western desserts.",
      imageUrl: "",
      price: 15000.0,
      inventoryCount: 100,
      validFrom: now,
      validUntil: addMonths(3),
      status: "ACTIVE",
    },
    {
      productId: nanoid(),
      productName: "Ultimate Sri Lanka Family Adventure (7 Days)",
      destination: "Sri Lanka",
      category: "Family Package",
      description:
        "A perfect one-week family getaway! Includes kid-friendly safari tours, easy nature walks, beach relaxation, and spacious family suites with daily breakfast. Ideal for all ages.",
      imageUrl: "",
      price: 450000.0,
      inventoryCount: 15,
      validFrom: now,
      validUntil: addMonths(6),
      status: "ACTIVE",
    },
    {
      productId: nanoid(),
      productName: "Pettah Markets Guided Walking Tour",
      destination: "Colombo",
      category: "Tour",
      description:
        "A fascinating 2-hour guided walking tour through the bustling streets of Pettah. Discover vibrant local markets, street food, and hidden colonial architecture.",
      imageUrl: "",
      price: 3500.0,
      inventoryCount: 40,
      validFrom: now,
      validUntil: addMonths(4),
      status: "ACTIVE",
    },
    {
      productId: nanoid(),
      productName: "Private Airport Transfer (BIA to Colombo)",
      destination: "Colombo",
      category: "Airport Transfer",
      description:
        "Hassle-free private airport transfer from Bandaranaike International Airport (BIA) to your hotel in Colombo. Includes meet-and-greet service and a comfortable air-conditioned luxury van.",
      imageUrl: "",
      price: 9000.0,
      inventoryCount: 200,
      validFrom: now,
      validUntil: addMonths(12),
      status: "ACTIVE",
    },
  ];
};

async function main() {
  console.log(`Start seeding ...`);
  const products = generateProducts();

  for (const product of products) {
    const p = await prisma.product.create({
      data: product,
    });
    console.log(`Created product with id: ${p.productId}`);
  }

  console.log(`Seeding finished.`);
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
