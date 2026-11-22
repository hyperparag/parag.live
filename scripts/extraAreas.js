/**
 * Countries whose list differs from the site's original one
 * (public/country.json). Used by scripts/buildCitySearch.js.
 *
 *   replace: { COUNTRY_CODE: { "card title": ["city", ...], ... } }
 *            The list for that country is replaced, so every original name must
 *            be repeated with its original spelling. The build prints a warning
 *            if one is missing.
 *   add:     { COUNTRY_CODE: { "card title": ["city", ...] } }
 *            Added to the original list (the card title must be the original one
 *            if the city belongs in an existing card).
 */

module.exports = {
  replace: {
    // Bangladesh: 8 divisions, 64 districts. The 10 original areas keep their
    // spelling (Barisal, Bogra, Chittagong, Comilla, Rangpur City, Raozan Upazila).
    BD: {
      "Barishal Division": ["Barguna", "Barisal", "Bhola", "Jhalokati", "Patuakhali", "Pirojpur"],
      "Chattogram Division": [
        "Bandarban",
        "Brahmanbaria",
        "Chandpur",
        "Chittagong",
        "Comilla",
        "Cox's Bazar",
        "Feni",
        "Khagrachhari",
        "Lakshmipur",
        "Noakhali",
        "Rangamati",
        "Raozan Upazila",
      ],
      "Dhaka Division": [
        "Dhaka",
        "Faridpur",
        "Gazipur",
        "Gopalganj",
        "Kishoreganj",
        "Madaripur",
        "Manikganj",
        "Munshiganj",
        "Narayanganj",
        "Narsingdi",
        "Rajbari",
        "Shariatpur",
        "Tangail",
      ],
      "Khulna Division": [
        "Bagerhat",
        "Chuadanga",
        "Jessore",
        "Jhenaidah",
        "Khulna",
        "Kushtia",
        "Magura",
        "Meherpur",
        "Narail",
        "Satkhira",
      ],
      "Mymensingh Division": ["Jamalpur", "Mymensingh", "Netrokona", "Sherpur"],
      "Rajshahi Division": [
        "Bogra",
        "Chapai Nawabganj",
        "Joypurhat",
        "Naogaon",
        "Natore",
        "Pabna",
        "Rajshahi",
        "Sirajganj",
      ],
      "Rangpur Division": [
        "Dinajpur",
        "Gaibandha",
        "Kurigram",
        "Lalmonirhat",
        "Nilphamari",
        "Panchagarh",
        "Rangpur City",
        "Thakurgaon",
      ],
      "Sylhet Division": ["Habiganj", "Moulvibazar", "Sunamganj", "Sylhet"],
    },

    // Australia: the 15 original cities plus every city of 50,000+ people that
    // none of them covers, grouped by state.
    AU: {
      "Australian Capital Territory": ["Canberra"],
      "New South Wales": [
        "Central Coast",
        "Coffs Harbour",
        "Newcastle",
        "Port Macquarie",
        "Sydney",
        "Wollongong",
      ],
      "Northern Territory": ["Darwin"],
      Queensland: [
        "Brisbane",
        "Bundaberg",
        "Cairns",
        "Gold Coast",
        "Hervey Bay",
        "Mackay",
        "Rockhampton",
        "Sunshine Coast",
        "Toowoomba",
        "Townsville",
      ],
      "South Australia": ["Adelaide"],
      Tasmania: ["Hobart", "Launceston"],
      Victoria: ["Ballarat", "Bendigo", "Geelong", "Melbourne"],
      "Western Australia": ["Bunbury", "Mandurah", "Perth"],
    },
  },

  add: {
    // United Kingdom: the original list is regions (Wales, Devon, Kent, East
    // Midlands...). These are cities of 150,000+ people that no listed city or
    // region covers.
    GB: {
      "United Kingdom": [
        "Bournemouth",
        "Hull",
        "Milton Keynes",
        "Preston",
        "Reading",
        "Stoke-on-Trent",
        "Sunderland",
        "Swindon",
        "York",
      ],
    },
  },
};
