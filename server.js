const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.static(__dirname));

// --- 50 CATEGORIES WITH 50 UNIQUE WORDS EACH ---
const gameDatabase = {
    "Animals": ["Lion", "Tiger", "Elephant", "Giraffe", "Kangaroo", "Panda", "Cheetah", "Zebra", "Gorilla", "Koala", "Leopard", "Wolf", "Fox", "Bear", "Hippo", "Rhino", "Camel", "Deer", "Rabbit", "Squirrel", "Otter", "Sloth", "Beaver", "Badger", "Hedgehog", "Mole", "Weasel", "Meerkat", "Hyena", "Jaguar", "Cougar", "Lynx", "Wombat", "Platypus", "Chimpanzee", "Baboon", "Lemur", "Skunk", "Raccoon", "Opossum", "Walrus", "Seal", "Dolphin", "Whale", "Shark", "Octopus", "Squid", "Starfish", "Jellyfish", "Seahorse"],
    "Electronics": ["Smartphone", "Laptop", "Television", "Tablet", "Smartwatch", "Headphones", "Speaker", "Camera", "Drone", "Projector", "Router", "Microphone", "Keyboard", "Mouse", "Monitor", "Printer", "Scanner", "Console", "VR Headset", "Powerbank", "Charger", "Earbuds", "Camcorder", "Thermostat", "Smart Plug", "Calculator", "E-Reader", "Flash Drive", "Hard Drive", "Processor", "Graphics Card", "Motherboard", "Webcam", "Pager", "Radio", "Walkie Talkie", "Amplifier", "Smart Lock", "Intercom", "GPS Navigator", "Fitness Tracker", "Gimbal", "Endoscope", "Soundbar", "Subwoofer", "Mixer", "Dictaphone", "Projector Screen", "Smart Mirror", "Stylus Pen"],
    "Countries": ["Japan", "Canada", "Brazil", "Australia", "Germany", "Egypt", "India", "France", "Italy", "Mexico", "United Kingdom", "United States", "China", "Russia", "South Africa", "Argentina", "New Zealand", "Spain", "Sweden", "Switzerland", "Norway", "Netherlands", "Greece", "Turkey", "South Korea", "Thailand", "Vietnam", "Singapore", "Malaysia", "Indonesia", "Philippines", "Saudi Arabia", "United Arab Emirates", "Ireland", "Portugal", "Belgium", "Denmark", "Finland", "Austria", "Poland", "Ukraine", "Peru", "Chile", "Colombia", "Venezuela", "Kenya", "Nigeria", "Morocco", "Iceland", "New Zealand"],
    "Birds": ["Eagle", "Falcon", "Hawk", "Owl", "Parrot", "Penguin", "Ostrich", "Flamingo", "Peacock", "Swan", "Duck", "Goose", "Pigeon", "Dove", "Raven", "Crow", "Sparrow", "Robin", "Blue Jay", "Cardinal", "Hummingbird", "Woodpecker", "Toucan", "Pelican", "Albatross", "Seagull", "Stork", "Heron", "Crane", "Kingfisher", "Pheasant", "Turkey", "Quail", "Vulture", "Condor", "Canary", "Finch", "Mockingbird", "Nightingale", "Magpie", "Swallow", "Swift", "Puffin", "Kiwi", "Roadrunner", "Cuckoo", "Cockatoo", "Macaw", "Lovebird", "Emu"],
    "Foods": ["Pizza", "Burger", "Sushi", "Pasta", "Taco", "Salad", "Steak", "Soup", "Sandwich", "Pancakes", "Waffles", "Omelette", "Burrito", "Lasagna", "Ramen", "Dumplings", "Curry", "Kebab", "Paella", "Risotto", "Croissant", "Bagel", "Muffin", "Donut", "Cheesecake", "Ice Cream", "Chocolate", "Apple Pie", "Brownie", "Macarons", "Hot Dog", "Nuggets", "French Fries", "Potato Chips", "Popcorn", "Pretzels", "Nachos", "Quesadilla", "Fish and Chips", "Meatballs", "Fried Chicken", "Ribs", "Lobster", "Shrimp", "Crab Cake", "Wonton", "Spring Roll", "Dim Sum", "Bacon", "Sausage"],
    "Fruits": ["Apple", "Banana", "Orange", "Strawberry", "Grape", "Watermelon", "Mango", "Pineapple", "Peach", "Cherry", "Blueberry", "Raspberry", "Blackberry", "Kiwi", "Pear", "Plum", "Apricot", "Pomegranate", "Coconut", "Avocado", "Lemon", "Lime", "Grapefruit", "Mandarin", "Clementine", "Fig", "Date", "Papaya", "Guava", "Passionfruit", "Dragonfruit", "Lychee", "Rambutan", "Mangosteen", "Durian", "Cranberry", "Gooseberry", "Mulberry", "Persimmon", "Quince", "Tamarind", "Melon", "Cantaloupe", "Honeydew", "Nectarine", "Olive", "Jackfruit", "Starfruit", "Elderberry", "Boysenberry"],
    "Vegetables": ["Carrot", "Broccoli", "Tomato", "Potato", "Onion", "Garlic", "Spinach", "Lettuce", "Cucumber", "Pepper", "Zucchini", "Eggplant", "Cabbage", "Cauliflower", "Asparagus", "Celery", "Mushroom", "Corn", "Peas", "Beans", "Pumpkin", "Squash", "Sweet Potato", "Radish", "Turnip", "Beetroot", "Ginger", "Kale", "Artichoke", "Leek", "Chives", "Parsnip", "Okra", "Brussel Sprout", "Bok Choy", "Watercress", "Fennel", "Shallot", "Yam", "Cassava", "Taro", "Chickpeas", "Lentils", "Soybean", "Alfalfa", "Bamboo Shoot", "Water Chestnut", "Rhubarb", "Endive", "Arugula"],
    "Sports": ["Football", "Basketball", "Baseball", "Soccer", "Tennis", "Cricket", "Rugby", "Golf", "Volleyball", "Badminton", "Table Tennis", "Ice Hockey", "Field Hockey", "Boxing", "Wrestling", "Karate", "Taekwondo", "Judo", "Fencing", "Archery", "Shooting", "Weightlifting", "Gymnastics", "Athletics", "Swimming", "Diving", "Water Polo", "Rowing", "Sailing", "Surfing", "Skateboarding", "Snowboarding", "Skiing", "Ice Skating", "Cycling", "Motorcycling", "Formula One", "NASCAR", "Horse Racing", "Polo", "Lacrosse", "Handball", "Squash", "Racquetball", "Billiards", "Bowling", "Darts", "Cheerleading", "Curling", "Bobsleigh"],
    "Clothing": ["T-Shirt", "Shirt", "Pants", "Jeans", "Shorts", "Skirt", "Dress", "Suit", "Jacket", "Coat", "Sweater", "Hoodie", "Cardigan", "Blouse", "Vest", "Raincoat", "Windbreaker", "Tuxedo", "Overalls", "Jumpsuit", "Pyjamas", "Robes", "Socks", "Underwear", "Swimsuit", "Bikini", "Trunks", "Tie", "Bowtie", "Scarf", "Gloves", "Mittens", "Hat", "Cap", "Beanie", "Beret", "Belt", "Suspenders", "Shoes", "Sneakers", "Boots", "Sandals", "Slippers", "Heels", "Flats", "Loafers", "Slippers", "Apron", "Uniform", "Jersey"],
    "Jobs": ["Doctor", "Teacher", "Engineer", "Scientist", "Artist", "Writer", "Lawyer", "Chef", "Pilot", "Astronaut", "Firefighter", "Police Officer", "Nurse", "Dentist", "Pharmacist", "Architect", "Designer", "Programmer", "Journalist", "Photographer", "Musician", "Actor", "Director", "Accountant", "Manager", "Secretary", "Receptionist", "Salesperson", "Cashier", "Waiter", "Bartender", "Barista", "Baker", "Butcher", "Farmer", "Fisherman", "Carpenter", "Plumber", "Electrician", "Mechanic", "Welder", "Mason", "Painter", "Tailor", "Barber", "Beautician", "Driver", "Pilot", "Captain", "Soldier"],
    "Vehicles": ["Car", "Truck", "Motorcycle", "Bicycle", "Scooter", "Bus", "Train", "Subway", "Tram", "Airplane", "Helicopter", "Jet", "Rocket", "Spaceship", "Boat", "Ship", "Yacht", "Submarine", "Ferry", "Cruise", "Ambulance", "Fire Engine", "Police Car", "Taxi", "Tractor", "Bulldozer", "Excavator", "Forklift", "Crane Truck", "Golf Cart", "Snowmobile", "Segway", "Hoverboard", "Unicycle", "Skateboard", "Rollerblades", "Caravan", "Van", "Minivan", "SUV", "Convertible", "Limousine", "Hot Air Balloon", "Glider", "Parachute", "Jet Ski", "Canoe", "Kayak", "Raft", "Gondola"],
    "Instruments": ["Piano", "Guitar", "Violin", "Flute", "Drums", "Trumpet", "Saxophone", "Clarinet", "Harp", "Cello", "Accordion", "Xylophone", "Maracas", "Tambourine", "Ukulele", "Banjo", "Mandolin", "Harmonica", "Bagpipes", "Trombone", "Tuba", "Oboe", "Bassoon", "Viola", "Double Bass", "Electric Guitar", "Bass Guitar", "Synthesizer", "Keyboard", "Drum Machine", "Triangle", "Cymbal", "Gong", "Chimes", "Castanets", "Lute", "Sitar", "Didgeridoo", "Theremin", "Kalimba", "Ocarina", "Recorder", "Bugle", "Cornet", "French Horn", "Organ", "Harpsichord", "Bongos", "Congas", "Melodica"],
    "Movies": ["Action", "Comedy", "Drama", "Horror", "Thriller", "Romance", "Sci-Fi", "Fantasy", "Mystery", "Documentary", "Animation", "Anime", "Western", "Musical", "Biography", "History", "War", "Crime", "Adventure", "Family", "Superhero", "Zombie", "Vampire", "Monster", "Alien", "Disaster", "Spy", "Martial Arts", "Slasher", "Psychological", "Supernatural", "Found Footage", "Cyberpunk", "Steampunk", "Dystopian", "Post-Apocalyptic", "Noir", "Neo-Noir", "Mockumentary", "Satire", "Parody", "Short Film", "Indie", "Arthouse", "Experimental", "Silent Movie", "Classic", "Epic", "Anthology", "Courtroom"],
    "Furniture": ["Chair", "Table", "Desk", "Sofa", "Bed", "Wardrobe", "Cabinet", "Bookshelf", "Dresser", "Nightstand", "Ottoman", "Recliner", "Stool", "Bench", "Armchair", "Loveseat", "Futon", "Sideboard", "Buffet", "Console Table", "Coffee Table", "End Table", "Vanity", "Chest of Drawers", "Coat Rack", "Shoe Rack", "Hat Stand", "Wine Rack", "Pantry", "Credenza", "Chaise Lounge", "Bean Bag", "Hammock", "Cradle", "Crib", "Bunk Bed", "Mattress", "Headboard", "Footstool", "Bar Stool", "Folding Chair", "Folding Table", "Desk Chair", "Gaming Chair", "Chaiselongue", "Display Case", "Locker", "Safe", "Filing Cabinet", "Workbench"],
    "Colors": ["Red", "Blue", "Green", "Yellow", "Orange", "Purple", "Pink", "Brown", "Black", "White", "Gray", "Silver", "Gold", "Cyan", "Magenta", "Turquoise", "Teal", "Indigo", "Violet", "Lavender", "Maroon", "Navy", "Beige", "Cream", "Ivory", "Khaki", "Olive", "Lime Green", "Emerald", "Mint", "Peach", "Coral", "Salmon", "Crimson", "Scarlet", "Ruby", "Sapphire", "Amber", "Topaz", "Bronze", "Copper", "Plum", "Mauve", "Lilac", "Mustard", "Tan", "Chocolate", "Charcoal", "Burgundy", "Turquoise"],
    "Shapes": ["Circle", "Square", "Triangle", "Rectangle", "Oval", "Diamond", "Hexagon", "Pentagon", "Octagon", "Heptagon", "Nonagon", "Decagon", "Star", "Heart", "Crescent", "Cross", "Arrow", "Cube", "Sphere", "Cylinder", "Cone", "Pyramid", "Prism", "Torus", "Ellipsoid", "Parallelogram", "Trapezoid", "Rhombus", "Kite", "Semi-Circle", "Ring", "Sector", "Helix", "Spiral", "Wave", "Line", "Dot", "Crescent", "Zigzag", "Polygon", "Polyhedron", "Tetrahedron", "Octahedron", "Dodecahedron", "Icosahedron", "Capsule", "Oval", "Heart", "Diamond", "Star"],
    "School": ["Pencil", "Pen", "Notebook", "Textbook", "Eraser", "Ruler", "Compass", "Protractor", "Scissors", "Glue", "Tape", "Marker", "Crayon", "Chalk", "Blackboard", "Whiteboard", "Desk", "Chair", "Backpack", "Lunchbox", "Binder", "Folder", "Calculator", "Locker", "Library", "Classroom", "Gymnasium", "Auditorium", "Cafeteria", "Playground", "Teacher", "Student", "Principal", "Homework", "Exam", "Quiz", "Report Card", "Diploma", "Degree", "Subject", "Math", "Science", "History", "English", "Geography", "Art", "Music", "Recess", "Assembly", "Schedule"],
    "Buildings": ["House", "Apartment", "Skyscraper", "Hotel", "Hospital", "School", "University", "Library", "Museum", "Theater", "Cinema", "Mall", "Supermarket", "Restaurant", "Cafe", "Bank", "Office", "Factory", "Warehouse", "Airport", "Station", "Church", "Temple", "Mosque", "Synagogue", "Cathedral", "Castle", "Palace", "Fortress", "Tower", "Lighthouse", "Windmill", "Barn", "Stable", "Greenhouse", "Garage", "Cottage", "Cabin", "Villa", "Mansion", "Bungalow", "Barracks", "Stadium", "Arena", "Gym", "Observatory", "Aquarium", "Zoo", "Prison", "Court"],
    "Nature": ["Mountain", "Hill", "Valley", "Plains", "Desert", "Forest", "Jungle", "Swamp", "River", "Lake", "Ocean", "Sea", "Waterfall", "Canyon", "Cave", "Island", "Peninsula", "Beach", "Coast", "Bay", "Gulf", "Strait", "Geyser", "Volcano", "Glacier", "Iceberg", "Meadow", "Prairie", "Savanna", "Tundra", "Oasis", "Reef", "Lagoon", "Delta", "Stream", "Pond", "Spring", "Cliff", "Dune", "Plateau", "Ridge", "Summit", "Slope", "Crater", "Geode", "Fossil", "Rock", "Stone", "Pebble", "Sand"],
    "Weather": ["Sunny", "Cloudy", "Rainy", "Snowy", "Windy", "Stormy", "Foggy", "Misty", "Hazy", "Thundery", "Lightning", "Rainbow", "Tornado", "Hurricane", "Typhoon", "Blizzard", "Hail", "Sleet", "Drizzle", "Shower", "Flood", "Drought", "Heatwave", "Frost", "Freeze", "Gale", "Breeze", "Monsoon", "Cyclone", "Dust Storm", "Sandstorm", "Avalanche", "Melt", "Dew", "Humidity", "Temperature", "Thermometer", "Barometer", "Anemometer", "Radar", "Satellite", "Forecast", "Climate", "Atmosphere", "Ozone", "Sky", "Sun", "Moon", "Cloud", "Raindrop"],
    "Kitchen": ["Refrigerator", "Oven", "Stove", "Microwave", "Toaster", "Blender", "Mixer", "Kettle", "Dishwasher", "Sink", "Faucet", "Countertop", "Cabinet", "Drawer", "Pantry", "Table", "Chair", "Plate", "Bowl", "Cup", "Glass", "Mug", "Knife", "Fork", "Spoon", "Chopsticks", "Pan", "Pot", "Skillet", "Wok", "Baking Sheet", "Cutting Board", "Peeler", "Grater", "Colander", "Strainer", "Whisk", "Spatula", "Ladle", "Tongs", "Rolling Pin", "Can Opener", "Corkscrew", "Timer", "Scale", "Thermometer", "Apron", "Oven Mitt", "Sponge", "Trash Can"],
    "Bathroom": ["Toilet", "Sink", "Faucet", "Mirror", "Bathtub", "Shower", "Curtain", "Mat", "Towel", "Washcloth", "Soap", "Shampoo", "Conditioner", "Body Wash", "Toothbrush", "Toothpaste", "Mouthwash", "Floss", "Razor", "Shaving Cream", "Hairdryer", "Straightener", "Curler", "Comb", "Brush", "Tissue", "Toilet Paper", "Plunger", "Brush Holder", "Hamper", "Scales", "Cabinet", "Shelf", "Robes", "Slippers", "Lotion", "Deodorant", "Perfume", "Cologne", "Makeup", "Tweezers", "Clippers", "File", "Cotton Swabs", "Sponges", "Bath Bomb", "Salt", "Drain", "Vent", "Light"],
    "Tools": ["Hammer", "Screwdriver", "Pliers", "Wrench", "Saw", "Drill", "Tape Measure", "Level", "Utility Knife", "Chisel", "File", "Clamp", "Vise", "Wire Stripper", "Soldering Iron", "Sandpaper", "Paintbrush", "Roller", "Scraper", "Trowel", "Shovel", "Rake", "Hoe", "Spade", "Axe", "Hatchet", "Sledgehammer", "Mallet", "Crowbar", "Bolt Cutter", "Shears", "Pruner", "Ladders", "Flashlight", "Generator", "Compressor", "Sander", "Grinder", "Router", "Planer", "Nail", "Screw", "Bolt", "Nut", "Washer", "Anchor", "Hook", "Chain", "Rope", "Wire"],
    "Hobbies": ["Reading", "Writing", "Painting", "Drawing", "Photography", "Gardening", "Cooking", "Baking", "Knitting", "Crochet", "Sewing", "Embroidery", "Woodworking", "Pottery", "Sculpting", " Origami", "Chess", "Checkers", "Cards", "Board Games", "Video Games", "Puzzles", "Stamps", "Coins", "Antiques", "Fishing", "Hunting", "Camping", "Hiking", "Climbing", "Birdwatching", "Stargazing", "Magic", "Juggling", "Dancing", "Singing", "Acting", "Modeling", "Yoga", "Pilates", "Meditation", "Running", "Swimming", "Cycling", "Skating", "Surfing", "Sailing", "Traveling", "Journaling", "Blogging"],
    "Languages": ["English", "Spanish", "French", "German", "Italian", "Portuguese", "Russian", "Chinese", "Japanese", "Korean", "Hindi", "Arabic", "Bengali", "Punjabi", "Marathi", "Telugu", "Tamil", "Gujarati", "Urdu", "Turkish", "Vietnamese", "Thai", "Malay", "Indonesian", "Filipino", "Persian", "Dutch", "Polish", "Ukrainian", "Romanian", "Greek", "Czech", "Slovak", "Hungarian", "Swedish", "Norwegian", "Danish", "Finnish", "Hebrew", "Hindi", "Sanskrit", "Latin", "Gaelic", "Welsh", "Maori", "Zulu", "Swahili", "Amharic", "Somali", "Esperanto"],
    "Body Parts": ["Head", "Face", "Hair", "Forehead", "Eye", "Eyebrow", "Eyelash", "Ear", "Nose", "Cheek", "Mouth", "Lip", "Tooth", "Tongue", "Jaw", "Chin", "Neck", "Throat", "Shoulder", "Arm", "Elbow", "Forearm", "Wrist", "Hand", "Finger", "Thumb", "Chest", "Breast", "Rib", "Stomach", "Abdomen", "Navel", "Waist", "Hip", "Back", "Spine", "Leg", "Thigh", "Knee", "Shin", "Ankle", "Foot", "Toes", "Heel", "Skin", "Muscle", "Bone", "Heart", "Lung", "Brain"],
    "Ocean": ["Whale", "Dolphin", "Shark", "Orca", "Seal", "Sea Lion", "Walrus", "Manatee", "Otter", "Penguin", "Pelican", "Albatross", "Seagull", "Turtle", "Snake", "Fish", "Salmon", "Tuna", "Cod", "Clownfish", "Seahorse", "Eel", "Octopus", "Squid", "Cuttlefish", "Nautilus", "Crab", "Lobster", "Shrimp", "Krill", "Barnacle", "Starfish", "Urchin", "Cucumber", "Anemone", "Coral", "Sponge", "Jellyfish", "Stingray", "Manta Ray", "Clam", "Oyster", "Mussel", "Scallop", "Snail", "Slug", "Kelps", "Seaweed", "Plankton", "Reef"],
    "Space": ["Sun", "Moon", "Earth", "Mars", "Jupiter", "Saturn", "Venus", "Mercury", "Uranus", "Neptune", "Pluto", "Asteroid", "Comet", "Meteor", "Meteorite", "Star", "Constellation", "Galaxy", "Nebula", "Black Hole", "Supernova", "Universe", "Cosmos", "Orbit", "Gravity", "Rocket", "Spaceship", "Shuttle", "Satellite", "Telescope", "Observatory", "Astronaut", "Cosmonaut", "Rover", "Probe", "Space Station", "Eclipse", "Solstice", "Equinox", "Lightyear", "Parsec", "Galaxy", "Cluster", "Quasar", "Pulsar", "Dark Matter", "Energy", "Alien", "UFO", "Planet"],
    "Cities": ["Tokyo", "New York", "London", "Paris", "Rome", "Cairo", "Mumbai", "Beijing", "Moscow", "Sydney", "Rio de Janeiro", "Buenos Aires", "Cape Town", "Toronto", "Mexico City", "Los Angeles", "Chicago", "Miami", "Berlin", "Madrid", "Amsterdam", "Vienna", "Athens", "Istanbul", "Dubai", "Singapore", "Bangkok", "Seoul", "Hong Kong", "Shanghai", "Mumbai", "Delhi", "Bangalore", "Jakarta", "Manila", "Kuala Lumpur", "Hanoi", "Melbourne", "Auckland", "Vancouver", "Montreal", "Lima", "Santiago", "Bogota", "Nairobi", "Johannesburg", "Casablanca", "Dublin", "Edinburgh", "Stockholm"],
    "Toys": ["Doll", "Action Figure", "Teddy Bear", "Plushie", "Barbie", "Lego", "Blocks", "Puzzle", "Board Game", "Card Game", "Video Game", "Console", "Handheld", "Car", "Truck", "Train", "Airplane", "Helicopter", "Rocket", "Robot", "Dinosaur", "Monster", "Soldier", "Cowboy", "Pirate", "Ninja", "Superhero", "Wizard", "Fairy", "Princess", "Yoyo", "Top", "Frisbee", "Boomerang", "Kite", "Marble", "Dice", "Domino", "Cards", "Spinner", "Rubiks Cube", "Slime", "Clay", "Playdough", "Paint", "Crayon", "Marker", "Bubble", "Water Gun", "Nerf Gun"],
    "Holidays": ["Christmas", "Halloween", "Thanksgiving", "Easter", "Hanukkah", "Ramadan", "Diwali", "Eid", "New Year", "Chinese New Year", "Valentines Day", "St Patricks Day", "April Fools", "Earth Day", "Mothers Day", "Fathers Day", "Labor Day", "Memorial Day", "Independence Day", "Veterans Day", "Halloween", "Bonfire Night", "Oktoberfest", "Carnival", "Mardi Gras", "Day of the Dead", "Hanami", "Mid-Autumn", "Thanksgiving", "Boxing Day", "Kwanzaa", "Bodhi Day", "Vesak", "Navratri", "Holi", "Yom Kippur", "Rosh Hashanah", "Passover", "Purim", "Shavuot", "Sukkot", "Advent", "Epiphany", "Pentecost", "Ascension", "Ramadan", "Eid al-Fitr", "Eid al-Adha", "Muharram", "Ashura"],
    "Groceries": ["Milk", "Eggs", "Bread", "Butter", "Cheese", "Yogurt", "Cream", "Ice Cream", "Chicken", "Beef", "Pork", "Bacon", "Sausage", "Fish", "Shrimp", "Rice", "Pasta", "Flour", "Sugar", "Salt", "Pepper", "Oil", "Vinegar", "Sauce", "Ketchup", "Mustard", "Mayo", "Cereal", "Oatmeal", "Honey", "Jam", "Coffee", "Tea", "Juice", "Soda", "Water", "Apples", "Bananas", "Oranges", "Potatoes", "Onions", "Carrots", "Tomatoes", "Garlic", "Chips", "Cookies", "Chocolate", "Candy", "Nuts", "Seeds"],
    "Insects": ["Ant", "Bee", "Wasp", "Hornet", "Butterfly", "Moth", "Fly", "Mosquito", "Gnat", "Beetle", "Ladybug", "Weevil", "Dragonfly", "Damselfly", "Grasshopper", "Cricket", "Locust", "Mantis", "Cockroach", "Termite", "Flea", "Louse", "Tick", "Mite", "Spider", "Scorpion", "Centipede", "Millipede", "Caterpillar", "Maggot", "Grub", "Pupa", "Larva", "Cocoon", "Chrysalis", "Cicada", "Aphid", "Scale", "Thrip", "Whitefly", "Stink Bug", "Bed Bug", "Shield Bug", "Assassin Bug", "Water Strider", "Backswimmer", "Water Boatman", "Diving Beetle", "Firefly", "Glowworm"],
    "Gardening": ["Soil", "Compost", "Fertilizer", "Mulch", "Seeds", "Seedlings", "Bulbs", "Plants", "Flowers", "Shrubs", "Trees", "Grass", "Lawn", "Weeds", "Pests", "Shovel", "Spade", "Rake", "Hoe", "Trowel", "Fork", "Pruner", "Shears", "Lopper", "Saw", "Mower", "Trimmer", "Edger", "Hose", "Nozzle", "Sprinkler", "Can", "Glove", "Boot", "Hat", "Apron", "Kneeler", "Cart", "Wheelbarrow", "Pot", "Planter", "Box", "Trellis", "Stake", "Tie", "Label", "Greenhouse", "Shed", "Patio", "Fence"],
    "Office Supplies": ["Paper", "Notebook", "Pad", "Envelope", "Folder", "Binder", "Divider", "Label", "Card", "Pen", "Pencil", "Marker", "Highlighter", "Crayon", "Chalk", "Eraser", "Fluid", "Tape", "Glue", "Paste", "Stapler", "Staples", "Remover", "Clip", "Pin", "Tack", "Band", "Dispenser", "Scissors", "Cutter", "Ruler", "Punch", "Trimmer", "Shredder", "Calculator", "Organizer", "Tray", "Rack", "Drawer", "Box", "File", "Cabinet", "Desk", "Chair", "Lamp", "Clock", "Calendar", "Planner", "Whiteboard", "Board"],
    "Shapes": ["Circle", "Square", "Triangle", "Rectangle", "Oval", "Diamond", "Hexagon", "Pentagon", "Octagon", "Star", "Heart", "Crescent", "Cross", "Arrow", "Cube", "Sphere", "Cylinder", "Cone", "Pyramid", "Prism", "Torus", "Helix", "Spiral", "Line", "Dot", "Wave", "Zigzag", "Ring", "Sector", "Segment", "Arc", "Tangent", "Radius", "Diameter", "Chord", "Vertex", "Edge", "Face", "Angle", "Polygon", "Polyhedron", "Tetrahedron", "Octahedron", "Dodecahedron", "Icosahedron", "Parallelogram", "Trapezoid", "Rhombus", "Kite"],
    "Trees & Plants": ["Oak", "Pine", "Maple", "Birch", "Willow", "Cedar", "Redwood", "Sequoia", "Banyan", "Baobab", "Palm", "Coconut", "Banana", "Bamboo", "Fern", "Moss", "Ivy", "Cactus", "Succulent", "Aloe Vera", "Rose", "Tulip", "Daisy", "Sunflower", "Orchid", "Lily", "Lotus", "Lavender", "Mint", "Basil", "Oregano", "Rosemary", "Thyme", "Sage", "Parsley", "Cilantro", "Dill", "Grass", "Clover", "Weed", "Mushroom", "Toadstool", "Fungus", "Lichen", "Vine", "Bush", "Shrub", "Hedge", "Algae", "Seaweed"],
    "Wild West": ["Cowboy", "Cowgirl", "Sheriff", "Deputy", "Outlaw", "Bandit", "Gunslinger", "Rancher", "Farmer", "Prospector", "Miner", "Blacksmith", "Saloon", "Hotel", "Bank", "Jail", "Church", "School", "Store", "House", "Barn", "Stable", "Corral", "Horse", "Pony", "Mule", "Donkey", "Cattle", "Steer", "Bull", "Wagon", "Stagecoach", "Train", "Tracks", "Station", "Pistol", "Revolver", "Rifle", "Shotgun", "Knife", "Lasso", "Rope", "Saddle", "Spurs", "Boots", "Hat", "Vest", "Badge", "Gold", "Silver"],
    "Amusement Park": ["Roller Coaster", "Ferris Wheel", "Carousel", "Merry-Go-Round", "Drop Tower", "Bumper Cars", "Go-Karts", "Water Slide", "Wave Pool", "Lazy River", "Log Flume", "Pirate Ship", "Swing Ride", "Teacups", "Haunted House", "Funhouse", "Maze", "Arcade", "Games", "Prizes", "Ticket", "Booth", "Gate", "Turnstile", "Queue", "Line", "Show", "Concert", "Parade", "Fireworks", "Cotton Candy", "Popcorn", "Pretzel", "Churro", "Hot Dog", "Burger", "Fries", "Soda", "Water", "Ice Cream", "Souvenir", "Shop", "Map", "Bench", "Trash Can", "Restroom", "First Aid", "Locker", "Parking", "Tram"],
    "Seasons": ["Spring", "Summer", "Autumn", "Fall", "Winter", "Equinox", "Solstice", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "January", "February", "Blossom", "Bud", "Flower", "Green", "Warm", "Hot", "Sun", "Beach", "Vacation", "Harvest", "Leaf", "Gold", "Orange", "Cool", "Rain", "Snow", "Ice", "Frost", "Cold", "Coat", "Boot", "Holidays", "New Year", "Festival", "Break", "Term", "Semester", "Solstice", "Equinox", "Equator", "Hemisphere"],
    "Castle Life": ["King", "Queen", "Prince", "Princess", "Duke", "Duchess", "Lord", "Lady", "Knight", "Squire", "Page", "Guard", "Soldier", "Archer", "Wizard", "Witch", "Jester", "Fool", "Bard", "Minstrel", "Cook", "Baker", "Servant", "Maid", "Blacksmith", "Weaver", "Tailor", "Carpenter", "Mason", "Farmer", "Castle", "Keep", "Tower", "Wall", "Gatehouse", "Drawbridge", "Moat", "Courtyard", "Hall", "Throne", "Crown", "Scepter", "Sword", "Shield", "Armor", "Helmet", "Banner", "Flag", "Feast", "Tournament"],
    "Beaches": ["Sand", "Water", "Wave", "Ocean", "Sea", "Surf", "Tide", "Current", "Beach", "Shore", "Coast", "Bay", "Lagoon", "Reef", "Island", "Sun", "Sky", "Cloud", "Breeze", "Wind", "Shell", "Conch", "Pebble", "Stone", "Rock", "Cliff", "Dune", "Palm Tree", "Coconut", "Crab", "Gull", "Fish", "Starfish", "Urchin", "Jellyfish", "Towel", "Blanket", "Umbrella", "Chair", "Lounger", "Mat", "Bag", "Lotion", "Sunglasses", "Hat", "Swimsuit", "Trunks", "Bikini", "Sandcastle", "Bucket"],
    "Camping": ["Tent", "Pegs", "Poles", "Tarp", "Hammer", "Sleeping Bag", "Mat", "Cot", "Pillow", "Blanket", "Backpack", "Pack", "Sack", "Bag", "Stove", "Fuel", "Match", "Lighter", "Firewood", "Kindling", "Campfire", "Grill", "Grate", "Pot", "Pan", "Kettle", "Plate", "Bowl", "Cup", "Mug", "Knife", "Fork", "Spoon", "Cooler", "Ice", "Food", "Water", "Bottle", "Flask", "Lantern", "Flashlight", "Headlamp", "Battery", "Compass", "Map", "GPS", "Knife", "Axe", "Saw", "Rope"],
    "Prehistoric": ["Dinosaur", "Mammoth", "Mastodon", "Tiger", "Bear", "Wolf", "Rhino", "Camel", "Sloth", "Armadillo", "Deer", "Bison", "Horse", "Eagle", "Vulture", "Owl", "Crocodile", "Alligator", "Turtle", "Snake", "Lizard", "Frog", "Toad", "Fish", "Shark", "Ray", "Crab", "Lobster", "Shrimp", "Clam", "Snail", "Slug", "Insect", "Spider", "Scorpion", "Centipede", "Millipede", "Worm", "Plant", "Tree", "Fern", "Moss", "Fungus", "Rock", "Stone", "Pebble", "Sand", "Cave", "Bone", "Fossil"],
    "Dances": ["Waltz", "Tango", "Foxtrot", "Quickstep", "Samba", "Cha-Cha", "Rumba", "Paso Doble", "Jive", "Salsa", "Bachata", "Merengue", "Mambo", "Reggaeton", "Cumbia", "Ballet", "Tap", "Jazz", "Modern", "Contemporary", "Hip Hop", "Breakdance", "Popping", "Locking", "House", "Disco", "Swing", "Lindy Hop", "Charleston", "Rock and Roll", "Folk", "Square Dance", "Line Dance", "Contra", "Maypole", "Morris", "Flamenco", "Pasodoble", "Bolero", "Fandango", "Zumba", "Aerobics", "Macarena", "Twist", "Shimmy", "Shuffle", "Waltz", "Polka", "Mazurka", "Galop"],
    "Fairy Tales": ["Fairy", "Elf", "Gnome", "Goblin", "Troll", "Ogre", "Giant", "Dragon", "Unicorn", "Pegasus", "Phoenix", "Griffon", "Mermaid", "Merman", "Centaur", "Minotaur", "Sphinx", "Werewolf", "Vampire", "Ghost", "Witch", "Wizard", "Sorcerer", "Mage", "Enchanter", "King", "Queen", "Prince", "Princess", "Knight", "Castle", "Tower", "Forest", "Woods", "Cottage", "House", "Hut", "Cave", "Mountain", "River", "Lake", "Sea", "Ocean", "Island", "Kingdom", "Empire", "Village", "Town", "City", "World"],
    "Spices & Herbs": ["Salt", "Pepper", "Cinnamon", "Nutmeg", "Clove", "Ginger", "Turmeric", "Cardamom", "Cumin", "Coriander", "Fennel", "Anise", "Mustard", "Paprika", "Chili", "Cayenne", "Saffron", "Vanilla", "Garlic", "Onion", "Basil", "Oregano", "Thyme", "Rosemary", "Sage", "Parsley", "Cilantro", "Dill", "Mint", "Spearmint", "Peppermint", "Lemongrass", "Bay Leaf", "Tarragon", "Marjoram", "Chives", "Allium", "Horseradish", "Wasabi", "Ginger", "Galangal", "Mace", "Allspice", "Sumac", "Zaatar", "Curry", "Garam Masala", "Five Spice", "Bouquet Garni", "Herbes de Provence"],
    "Superheroes": ["Hero", "Heroine", "Vigilante", "Protector", "Guardian", "Avenger", "Defender", "Champion", "Leader", "Sidekick", "Mentor", "Ally", "Friend", "Villain", "Mastermind", "Criminal", "Thug", "Minion", "Monster", "Alien", "Robot", "Cyborg", "Mutant", "Power", "Ability", "Strength", "Speed", "Flight", "Invisibility", "Vision", "Hearing", "Healing", "Telepathy", "Telekinesis", "Magic", "Gadget", "Suit", "Costume", "Mask", "Cape", "Logo", "Belt", "Weapon", "Base", "Lair", "HQ", "City", "World", "Universe", "Multiverse"],
    "Astronomy": ["Universe", "Cosmos", "Galaxy", "Cluster", "Nebula", "Star", "Sun", "Planet", "Moon", "Asteroid", "Comet", "Meteor", "Orbit", "Gravity", "Space", "Time", "Light", "Speed", "Distance", "Year", "Parsec", "Telescope", "Lens", "Mirror", "Mount", "Camera", "Filter", "Observatory", "Dome", "Satellite", "Rocket", "Shuttle", "Station", "Rover", "Probe", "Astronaut", "Scientist", "Physics", "Math", "Data", "Image", "Map", "Chart", "Catalog", "Discovery", "Theory", "Law", "Constant", "System", "Horizon"],
    "School Subjects": ["Math", "Arithmetic", "Algebra", "Geometry", "Calculus", "Statistics", "Science", "Biology", "Chemistry", "Physics", "Geology", "Astronomy", "History", "Geography", "Civics", "Economics", "Sociology", "Psychology", "English", "Literature", "Grammar", "Composition", "Speech", "Drama", "Art", "Drawing", "Painting", "Sculpture", "Crafts", "Music", "Singing", "Band", "Orchestra", "Choir", "Language", "Spanish", "French", "German", "Latin", "Greek", "Gym", "Sports", "Fitness", "Health", "Hygiene", "Computers", "Coding", "Typing", "Shop", "Cooking"]
};

const rooms = {};

io.on('connection', (socket) => {

    // --- CREATE ROOM ---
    socket.on('createRoom', ({ rounds }) => {
        const roomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
        rooms[roomCode] = {
            code: roomCode,
            hostId: socket.id,
            maxRounds: parseInt(rounds) || 5,
            currentRound: 1,
            players: [],
            gameStarted: false,
            currentCategory: null,
            currentWord: null,
            imposterId: null,
            playedCombinations: [] // Anti-repeat track record system
        };
        socket.emit('roomCreated', roomCode);
    });

    // --- JOIN ROOM ---
    socket.on('joinRoom', ({ roomCode, playerName }) => {
        const room = rooms[roomCode];
        if (!room) return socket.emit('errorMsg', 'Room not found.');
        if (room.gameStarted) return socket.emit('errorMsg', 'Game already in progress.');
        if (room.players.length >= 10) return socket.emit('errorMsg', 'Room is full.');

        const newPlayer = {
            id: socket.id,
            name: playerName || `Player ${room.players.length + 1}`,
            points: 0,
            isImposter: false
        };

        room.players.push(newPlayer);
        socket.join(roomCode);
        
        io.to(roomCode).emit('roomUpdated', {
            roomCode,
            players: room.players,
            hostId: room.hostId,
            gameStarted: room.gameStarted
        });
    });

    // --- START GAME / ROUND ---
    socket.on('startGame', ({ roomCode }) => {
        const room = rooms[roomCode];
        if (!room || room.hostId !== socket.id) return;

        room.gameStarted = true;
        startNewRound(roomCode);
    });

    function startNewRound(roomCode) {
        const room = rooms[roomCode];
        const categories = Object.keys(gameDatabase);
        
        let chosenCategory = "";
        let chosenWord = "";
        let attempts = 0;

        // Smart system: Tries to pick a word that hasn't been played in this room yet
        while (attempts < 100) {
            chosenCategory = categories[Math.floor(Math.random() * categories.length)];
            const wordList = gameDatabase[chosenCategory];
            chosenWord = wordList[Math.floor(Math.random() * wordList.length)];
            
            const comboKey = `${chosenCategory}:${chosenWord}`;
            if (!room.playedCombinations.includes(comboKey)) {
                room.playedCombinations.push(comboKey);
                break;
            }
            attempts++;
        }

        room.currentCategory = chosenCategory;
        room.currentWord = chosenWord;
        
        // Pick random imposter
        const imposterIndex = Math.floor(Math.random() * room.players.length);
        room.players.forEach((p, idx) => {
            p.isImposter = (idx === imposterIndex);
            if (p.isImposter) room.imposterId = p.id;
        });

        // Send customized private data packages to individual clients
        room.players.forEach((player) => {
            io.to(player.id).emit('roundStarted', {
                category: room.currentCategory,
                word: player.isImposter ? null : room.currentWord,
                isImposter: player.isImposter,
                currentRound: room.currentRound,
                maxRounds: room.maxRounds,
                players: room.players
            });
        });
    }

    // --- SUBMIT VOTE ---
    socket.on('castVote', ({ roomCode, votedPlayerId }) => {
        const room = rooms[roomCode];
        if (!room) return;

        let pointsSummaryHtml = "";
        const imposter = room.players.find(p => p.isImposter);

        if (votedPlayerId === room.imposterId) {
            pointsSummaryHtml = `<h3 style="color:#48bb78; font-size:1.5rem; margin-bottom:10px;">Imposter Caught!</h3>
            <p>The group successfully voted out <strong>${imposter.name}</strong>.</p>
            <p style="margin-top:10px; color:#cc2366;">The secret word was indeed: <strong>${room.currentWord}</strong></p><br>`;
            room.players.forEach(p => {
                if (!p.isImposter) p.points += 1;
            });
        } else {
            const victim = room.players.find(p => p.id === votedPlayerId);
            pointsSummaryHtml = `<h3 style="color:#f56565; font-size:1.5rem; margin-bottom:10px;">Wrong Accusation!</h3>
            <p>The group voted out <strong>${victim.name}</strong> instead of the imposter.</p>
            <p style="margin-top:10px; color:#cc2366;">The real imposter was <strong>${imposter.name}</strong>!</p>
            <p>The secret word was: <strong>${room.currentWord}</strong></p><br>`;
            imposter.points += 2;
        }

        io.to(roomCode).emit('roundResult', {
            pointsSummaryHtml,
            players: room.players,
            isGameOver: room.currentRound >= room.maxRounds
        });
    });

    // --- ADVANCE TO NEXT ROUND ---
    socket.on('nextRound', ({ roomCode }) => {
        const room = rooms[roomCode];
        if (!room || room.hostId !== socket.id) return;

        room.currentRound++;
        startNewRound(roomCode);
    });

    // --- RESTART GAME ---
    socket.on('restartGame', ({ roomCode }) => {
        const room = rooms[roomCode];
        if (!room || room.hostId !== socket.id) return;

        room.currentRound = 1;
        room.gameStarted = false;
        room.players.forEach(p => p.points = 0);
        room.playedCombinations = []; // Clear history tracking on new party start
        
        io.to(roomCode).emit('roomUpdated', {
            roomCode,
            players: room.players,
            hostId: room.hostId,
            gameStarted: room.gameStarted
        });
    });

    // --- DISCONNECT ---
    socket.on('disconnect', () => {
        for (const roomCode in rooms) {
            const room = rooms[roomCode];
            const pIdx = room.players.findIndex(p => p.id === socket.id);
            if (pIdx !== -1) {
                room.players.splice(pIdx, 1);
                if (room.players.length === 0) {
                    delete rooms[roomCode];
                } else {
                    if (room.hostId === socket.id) room.hostId = room.players[0].id;
                    io.to(roomCode).emit('roomUpdated', {
                        roomCode,
                        players: room.players,
                        hostId: room.hostId,
                        gameStarted: room.gameStarted
                    });
                }
                break;
            }
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
