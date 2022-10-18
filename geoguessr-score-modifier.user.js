// ==UserScript==
// @name         GeoGuessr Score Modifier
// @description  Adds a new scoring system that rewards guessing in the right regions/states of countries
// @version      0.1.3
// @author       miraclewhips
// @match        *://*.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?domain=geoguessr.com
// @grant        none
// @copyright    2022, miraclewhips (https://github.com/miraclewhips)
// @license      MIT
// @downloadURL    https://github.com/miraclewhips/geoguessr-score-modifier/raw/master/geoguessr-score-modifier.user.js
// @updateURL    https://github.com/miraclewhips/geoguessr-score-modifier/raw/master/geoguessr-score-modifier.user.js
// ==/UserScript==



// COUNTRY DETAILS
// https://docs.google.com/spreadsheets/d/1iYxFcZcKM2i9BBDbjwbmoddv2UwkCdXuGv4PGl2eNy8
const COUNTRY_DATA = {
	"ad": {
		 "name": "Andorra",
		 "north": 42.65656551,
		 "south": 42.42848713,
		 "west": 1.409309467,
		 "east": 1.786015588,
		 "land_area": 468
	},
	"ae": {
		 "name": "United Arab Emirates",
		 "north": 26.06198879,
		 "south": 24.74174436,
		 "west": 54.9896658,
		 "east": 56.36361834,
		 "land_area": 83600
	},
	"al": {
		 "name": "Albania",
		 "north": 42.66110394,
		 "south": 39.64588744,
		 "west": 19.30000333,
		 "east": 21.05278228,
		 "land_area": 27398
	},
	"ar": {
		 "name": "Argentina",
		 "north": -21.7925099,
		 "south": -55.05164071,
		 "west": -73.55933666,
		 "east": -53.64156954,
		 "land_area": 2736690
	},
	"at": {
		 "name": "Austria",
		 "north": 49.02721957,
		 "south": 46.39347094,
		 "west": 9.531168607,
		 "east": 17.16009527,
		 "land_area": 82445
	},
	"au": {
		 "name": "Australia",
		 "north": -10.69842644,
		 "south": -43.63681185,
		 "west": 112.9205175,
		 "east": 153.6390334,
		 "land_area": 7633565
	},
	"au-cc": {
		 "name": "Cocos (Keeling) Islands",
		 "north": -12.07263747,
		 "south": -12.2089472,
		 "west": 96.81675357,
		 "east": 96.92954142,
		 "land_area": 14
	},
	"au-cx": {
		 "name": "Christmas Island",
		 "north": -10.4125523,
		 "south": -10.57020359,
		 "west": 105.5322588,
		 "east": 105.7131899,
		 "land_area": 135
	},
	"bd": {
		 "name": "Bangladesh",
		 "north": 26.62852998,
		 "south": 21.64697616,
		 "west": 88.00632566,
		 "east": 92.69073515,
		 "land_area": 134208
	},
	"be": {
		 "name": "Belgium",
		 "north": 51.50172246,
		 "south": 49.495234,
		 "west": 2.536254936,
		 "east": 6.403676881,
		 "land_area": 30278
	},
	"bg": {
		 "name": "Bulgaria",
		 "north": 44.24584568,
		 "south": 41.25882192,
		 "west": 22.35477079,
		 "east": 28.63075566,
		 "land_area": 108612
	},
	"bm": {
		 "name": "Bermuda",
		 "north": 32.38990051,
		 "south": 32.24446075,
		 "west": -64.88819908,
		 "east": -64.64577845,
		 "land_area": 54
	},
	"bo": {
		 "name": "Bolivia",
		 "north": -9.677739218,
		 "south": -22.94273969,
		 "west": -69.60171421,
		 "east": -57.48098151,
		 "land_area": 1083301
	},
	"br": {
		 "name": "Brazil",
		 "north": 5.313216993,
		 "south": -33.75530305,
		 "west": -73.99930719,
		 "east": -34.69972983,
		 "land_area": 8460415
	},
	"bt": {
		 "name": "Bhutan",
		 "north": 28.25097574,
		 "south": 26.74320972,
		 "west": 88.78045654,
		 "east": 92.10626734,
		 "land_area": 38394
	},
	"bw": {
		 "name": "Botswana",
		 "north": -17.74721459,
		 "south": -26.89562101,
		 "west": 19.9865959,
		 "east": 29.37277305,
		 "land_area": 566730
	},
	"by": {
		 "name": "Belarus",
		 "north": 56.17714398,
		 "south": 51.26672203,
		 "west": 23.14891817,
		 "east": 32.77758085,
		 "land_area": 202900
	},
	"ca": {
		 "name": "Canada",
		 "north": 70.1644755,
		 "south": 41.94950483,
		 "west": -141.0265531,
		 "east": -52.60250313,
		 "land_area": 9093507
	},
	"ch": {
		 "name": "Switzerland",
		 "north": 47.7892163,
		 "south": 45.82918184,
		 "west": 5.94201274,
		 "east": 10.51766314,
		 "land_area": 39997
	},
	"cl": {
		 "name": "Chile",
		 "north": -17.39661438,
		 "south": -55.71391897,
		 "west": -75.60845382,
		 "east": -66.59698614,
		 "land_area": 743812
	},
	"cn": {
		 "name": "China",
		 "north": 53.58791087,
		 "south": 18.30546354,
		 "west": 73.51780544,
		 "east": 122.6614859,
		 "land_area": 9326410
	},
	"cn-hk": {
		 "name": "Hong Kong",
		 "north": 22.56334007,
		 "south": 22.18109379,
		 "west": 113.8365559,
		 "east": 114.4044117,
		 "land_area": 1106
	},
	"cn-mo": {
		 "name": "Macau",
		 "north": 22.21725972,
		 "south": 22.11169942,
		 "west": 113.5285942,
		 "east": 113.5984604,
		 "land_area": 28.2
	},
	"co": {
		 "name": "Colombia",
		 "north": 12.48154085,
		 "south": -4.265380456,
		 "west": -78.98742897,
		 "east": -66.84822005,
		 "land_area": 1038700
	},
	"cr": {
		 "name": "Costa Rica",
		 "north": 11.21575542,
		 "south": 8.211166038,
		 "west": -85.89772496,
		 "east": -82.55343757,
		 "land_area": 51060
	},
	"cz": {
		 "name": "Czech Republic",
		 "north": 51.06563891,
		 "south": 48.55611092,
		 "west": 12.04351241,
		 "east": 18.87369591,
		 "land_area": 77187
	},
	"de": {
		 "name": "Germany",
		 "north": 54.92680924,
		 "south": 47.26612667,
		 "west": 5.867770296,
		 "east": 15.05007035,
		 "land_area": 348672
	},
	"dk": {
		 "name": "Denmark",
		 "north": 57.69889887,
		 "south": 54.55893089,
		 "west": 8.058759197,
		 "east": 12.79590635,
		 "land_area": 42434
	},
	"do": {
		 "name": "Dominican Republic",
		 "north": 19.93232461,
		 "south": 17.59446606,
		 "west": -72.01248137,
		 "east": -68.28895103,
		 "land_area": 48320
	},
	"ec": {
		 "name": "Ecuador",
		 "north": 1.474744387,
		 "south": -4.972956729,
		 "west": -80.98650746,
		 "east": -75.25334958,
		 "land_area": 256369
	},
	"ee": {
		 "name": "Estonia",
		 "north": 59.64776995,
		 "south": 57.54178495,
		 "west": 21.86914453,
		 "east": 28.15332381,
		 "land_area": 42388
	},
	"eg": {
		 "name": "Egypt",
		 "north": 31.61221307,
		 "south": 22.00064908,
		 "west": 24.69124291,
		 "east": 36.86183752,
		 "land_area": 995450
	},
	"es": {
		 "name": "Spain",
		 "north": 43.77588894,
		 "south": 36.00775674,
		 "west": -9.36406744,
		 "east": 3.292490335,
		 "land_area": 498980
	},
	"fi": {
		 "name": "Finland",
		 "north": 70.09981582,
		 "south": 59.8098925,
		 "west": 20.56178657,
		 "east": 31.62844596,
		 "land_area": 303816
	},
	"fo": {
		 "name": "Faroe Islands",
		 "north": 62.37428625,
		 "south": 61.39137404,
		 "west": -7.665612463,
		 "east": -6.243975752,
		 "land_area": 1393
	},
	"fr": {
		 "name": "France",
		 "north": 51.11910211,
		 "south": 42.31963189,
		 "west": -4.784665045,
		 "east": 8.234164328,
		 "land_area": 543940
	},
	"fr-re": {
		 "name": "Réunion",
		 "north": -20.86492198,
		 "south": -21.39489059,
		 "west": 55.20768701,
		 "east": 55.83301217,
		 "land_area": 2511
	},
	"gb": {
		 "name": "United Kingdom",
		 "north": 58.63622123,
		 "south": 49.96990343,
		 "west": -8.189851793,
		 "east": 1.773652892,
		 "land_area": 241930
	},
	"gh": {
		 "name": "Ghana",
		 "north": 11.18866458,
		 "south": 4.715042383,
		 "west": -3.254050396,
		 "east": 1.202019809,
		 "land_area": 227533
	},
	"gl": {
		 "name": "Greenland",
		 "north": 75.49228953,
		 "south": 59.81925136,
		 "west": -73.0670176,
		 "east": -17.30041354,
		 "land_area": 2166086
	},
	"gr": {
		 "name": "Greece",
		 "north": 41.7912949,
		 "south": 34.90425795,
		 "west": 19.94148847,
		 "east": 26.68180124,
		 "land_area": 130647
	},
	"gt": {
		 "name": "Guatemala",
		 "north": 17.79520214,
		 "south": 13.73492657,
		 "west": -92.21259312,
		 "east": -88.25389245,
		 "land_area": 107159
	},
	"hr": {
		 "name": "Croatia",
		 "north": 46.53821634,
		 "south": 42.42445615,
		 "west": 13.49181827,
		 "east": 19.43295092,
		 "land_area": 55974
	},
	"hu": {
		 "name": "Hungary",
		 "north": 48.62315297,
		 "south": 45.7103333,
		 "west": 16.07901864,
		 "east": 22.92371549,
		 "land_area": 89608
	},
	"id": {
		 "name": "Indonesia",
		 "north": 5.622846459,
		 "south": -11.04394817,
		 "west": 95.0703069,
		 "east": 125.2677185,
		 "land_area": 1811569
	},
	"ie": {
		 "name": "Ireland",
		 "north": 55.37563262,
		 "south": 51.42441711,
		 "west": -10.51546622,
		 "east": -6.007144907,
		 "land_area": 68883
	},
	"il": {
		 "name": "Israel / Palestine",
		 "north": 33.28412124,
		 "south": 29.48525894,
		 "west": 34.20635389,
		 "east": 35.91548053,
		 "land_area": 26330
	},
	"in": {
		 "name": "India",
		 "north": 32.41118501,
		 "south": 7.99239616,
		 "west": 68.14242382,
		 "east": 97.03765189,
		 "land_area": 2973190
	},
	"is": {
		 "name": "Iceland",
		 "north": 66.52719792,
		 "south": 63.37601603,
		 "west": -24.51365907,
		 "east": -13.51096881,
		 "land_area": 100250
	},
	"it": {
		 "name": "Italy",
		 "north": 47.09881337,
		 "south": 36.61106444,
		 "west": 6.569713105,
		 "east": 18.58082347,
		 "land_area": 294140
	},
	"jo": {
		 "name": "Jordan",
		 "north": 32.74183473,
		 "south": 29.18990168,
		 "west": 34.95571111,
		 "east": 36.5529455,
		 "land_area": 88802
	},
	"jp": {
		 "name": "Japan",
		 "north": 45.47761411,
		 "south": 31.12402243,
		 "west": 129.6351583,
		 "east": 145.8637222,
		 "land_area": 364546
	},
	"ke": {
		 "name": "Kenya",
		 "north": 4.972548549,
		 "south": -4.757791572,
		 "west": 33.90454501,
		 "east": 41.57488448,
		 "land_area": 569140
	},
	"kg": {
		 "name": "Kyrgyzstan",
		 "north": 43.27955228,
		 "south": 39.22080697,
		 "west": 69.27635176,
		 "east": 80.22693287,
		 "land_area": 191801
	},
	"kh": {
		 "name": "Cambodia",
		 "north": 14.67256773,
		 "south": 10.3766962,
		 "west": 102.2807174,
		 "east": 107.6513765,
		 "land_area": 176515
	},
	"kr": {
		 "name": "South Korea",
		 "north": 38.66592945,
		 "south": 33.17174024,
		 "west": 125.9048119,
		 "east": 129.5909189,
		 "land_area": 99909
	},
	"la": {
		 "name": "Laos",
		 "north": 22.41189938,
		 "south": 13.9505485,
		 "west": 100.0758448,
		 "east": 107.622867,
		 "land_area": 230800
	},
	"lb": {
		 "name": "Lebanon",
		 "north": 34.64224406,
		 "south": 33.0497147,
		 "west": 35.09018273,
		 "east": 36.61315206,
		 "land_area": 10230
	},
	"lk": {
		 "name": "Sri Lanka",
		 "north": 9.863871579,
		 "south": 5.889733032,
		 "west": 79.72192265,
		 "east": 81.88999015,
		 "land_area": 62732
	},
	"ls": {
		 "name": "Lesotho",
		 "north": -28.55324528,
		 "south": -30.70565852,
		 "west": 27.02474456,
		 "east": 29.48374332,
		 "land_area": 30355
	},
	"lt": {
		 "name": "Lithuania",
		 "north": 56.44881587,
		 "south": 53.89135116,
		 "west": 21.00248606,
		 "east": 26.8302643,
		 "land_area": 62680
	},
	"lu": {
		 "name": "Luxembourg",
		 "north": 50.18817403,
		 "south": 49.45224747,
		 "west": 5.72789945,
		 "east": 6.547106711,
		 "land_area": 2586
	},
	"lv": {
		 "name": "Latvia",
		 "north": 58.08167343,
		 "south": 55.68037798,
		 "west": 20.94803271,
		 "east": 28.22757065,
		 "land_area": 62249
	},
	"mc": {
		 "name": "Monaco",
		 "north": 43.75196167,
		 "south": 43.72470548,
		 "west": 7.409180154,
		 "east": 7.439947269,
		 "land_area": 2.02
	},
	"me": {
		 "name": "Montenegro",
		 "north": 43.56422764,
		 "south": 41.84422529,
		 "west": 18.42918589,
		 "east": 20.35724277,
		 "land_area": 13452
	},
	"mg": {
		 "name": "Madagascar",
		 "north": -12.04519364,
		 "south": -25.60939592,
		 "west": 43.23581985,
		 "east": 50.47387894,
		 "land_area": 581540
	},
	"mk": {
		 "name": "North Macedonia",
		 "north": 42.37487977,
		 "south": 40.86504837,
		 "west": 20.41705537,
		 "east": 23.02727359,
		 "land_area": 25433
	},
	"mn": {
		 "name": "Mongolia",
		 "north": 52.17012849,
		 "south": 41.51381968,
		 "west": 87.78362906,
		 "east": 119.8971025,
		 "land_area": 1553556
	},
	"mt": {
		 "name": "Malta",
		 "north": 36.07591923,
		 "south": 35.80389283,
		 "west": 14.18345371,
		 "east": 14.57187905,
		 "land_area": 316
	},
	"mx": {
		 "name": "Mexico",
		 "north": 32.73377891,
		 "south": 14.52060128,
		 "west": -117.1648382,
		 "east": -86.72334365,
		 "land_area": 1943945
	},
	"my": {
		 "name": "Malaysia",
		 "north": 6.719988126,
		 "south": 0.8039028511,
		 "west": 99.90950991,
		 "east": 119.3502578,
		 "land_area": 329613
	},
	"ng": {
		 "name": "Nigeria",
		 "north": 13.92907655,
		 "south": 4.24506251,
		 "west": 2.611301065,
		 "east": 14.57480125,
		 "land_area": 910768
	},
	"nl": {
		 "name": "Netherlands",
		 "north": 53.47890321,
		 "south": 50.73795542,
		 "west": 3.330877652,
		 "east": 7.284546489,
		 "land_area": 33893
	},
	"nl-cw": {
		 "name": "Curaçao",
		 "north": 12.39492379,
		 "south": 12.04595945,
		 "west": -69.16478463,
		 "east": -68.73631786,
		 "land_area": 444
	},
	"no": {
		 "name": "Norway",
		 "north": 71.20107843,
		 "south": 57.93758043,
		 "west": 4.705702972,
		 "east": 31.12742212,
		 "land_area": 304282
	},
	"nz": {
		 "name": "New Zealand",
		 "north": -34.41905573,
		 "south": -47.31335316,
		 "west": 166.4018386,
		 "east": 178.552306,
		 "land_area": 262443
	},
	"py": {
		 "name": "Paraguay",
		 "north": -19.21430026,
		 "south": -27.62013417,
		 "west": -62.68873672,
		 "east": -54.24873466,
		 "land_area": 406796
	},
	"pe": {
		 "name": "Peru",
		 "north": -0.08386849656,
		 "south": -18.30899206,
		 "west": -81.50004403,
		 "east": -68.71195892,
		 "land_area": 1279996
	},
	"ph": {
		 "name": "Philippines",
		 "north": 18.67387233,
		 "south": 5.495857892,
		 "west": 117.0449048,
		 "east": 126.4778484,
		 "land_area": 298170
	},
	"pk": {
		 "name": "Pakistan",
		 "north": 36.87282251,
		 "south": 23.737347,
		 "west": 60.87992168,
		 "east": 75.35990121,
		 "land_area": 856690
	},
	"pl": {
		 "name": "Poland",
		 "north": 54.88423822,
		 "south": 48.99501037,
		 "west": 14.12126559,
		 "east": 23.97173198,
		 "land_area": 311888
	},
	"pt": {
		 "name": "Portugal",
		 "north": 42.15605268,
		 "south": 36.91188194,
		 "west": -9.457776085,
		 "east": -6.183850515,
		 "land_area": 91119
	},
	"ro": {
		 "name": "Romania",
		 "north": 48.28842075,
		 "south": 43.58977293,
		 "west": 20.29672002,
		 "east": 29.71985063,
		 "land_area": 231291
	},
	"rs": {
		 "name": "Serbia",
		 "north": 46.19660391,
		 "south": 42.25436943,
		 "west": 18.81469819,
		 "east": 22.9726916,
		 "land_area": 88246
	},
	"ru": {
		 "name": "Russia",
		 "north": 67.65578027,
		 "south": 41.17168671,
		 "west": 27.42359493,
		 "east": 163.2450453,
		 "land_area": 16378410
	},
	"rw": {
		 "name": "Rwanda",
		 "north": -1.05116744,
		 "south": -2.829860301,
		 "west": 28.8448363,
		 "east": 30.91026587,
		 "land_area": 24668
	},
	"se": {
		 "name": "Sweden",
		 "north": 69.08895772,
		 "south": 55.27891216,
		 "west": 10.96052798,
		 "east": 24.01161909,
		 "land_area": 410335
	},
	"sg": {
		 "name": "Singapore",
		 "north": 1.476280994,
		 "south": 1.223905192,
		 "west": 103.6024208,
		 "east": 104.0897444,
		 "land_area": 716
	},
	"si": {
		 "name": "Slovenia",
		 "north": 46.86970432,
		 "south": 45.41655764,
		 "west": 13.35455526,
		 "east": 16.57071693,
		 "land_area": 20151
	},
	"sk": {
		 "name": "Slovakia",
		 "north": 49.62919724,
		 "south": 47.71417794,
		 "west": 16.81150182,
		 "east": 22.61228257,
		 "land_area": 48105
	},
	"sm": {
		 "name": "San Marino",
		 "north": 43.99331216,
		 "south": 43.89332781,
		 "west": 12.40196922,
		 "east": 12.5165547,
		 "land_area": 61
	},
	"sn": {
		 "name": "Senegal",
		 "north": 16.70032911,
		 "south": 12.28883312,
		 "west": -17.5225026,
		 "east": -11.35385134,
		 "land_area": 192530
	},
	"sz": {
		 "name": "Eswatini",
		 "north": -25.70854203,
		 "south": -27.33095704,
		 "west": 30.77601946,
		 "east": 32.13252615,
		 "land_area": 17204
	},
	"th": {
		 "name": "Thailand",
		 "north": 20.51190195,
		 "south": 5.745117138,
		 "west": 97.37099072,
		 "east": 105.6672804,
		 "land_area": 510890
	},
	"tn": {
		 "name": "Tunisia",
		 "north": 37.35467476,
		 "south": 30.25486215,
		 "west": 7.543016212,
		 "east": 11.58941935,
		 "land_area": 155360
	},
	"tr": {
		 "name": "Turkey",
		 "north": 42.10843785,
		 "south": 36.00298054,
		 "west": 25.96243462,
		 "east": 44.69783547,
		 "land_area": 769632
	},
	"tw": {
		 "name": "Taiwan",
		 "north": 25.30996598,
		 "south": 21.8788848,
		 "west": 120.0476275,
		 "east": 122.0064736,
		 "land_area": 32260
	},
	"ua": {
		 "name": "Ukraine",
		 "north": 52.40997659,
		 "south": 45.11523978,
		 "west": 22.1340966,
		 "east": 40.28132805,
		 "land_area": 579300
	},
	"ug": {
		 "name": "Uganda",
		 "north": 4.242712679,
		 "south": -1.488100493,
		 "west": 29.56277939,
		 "east": 35.03397044,
		 "land_area": 197100
	},
	"us": {
		 "name": "United States",
		 "north": 48.99530821,
		 "south": 24.52806746,
		 "west": -124.6113815,
		 "east": -66.70721851,
		 "land_area": 9147593
	},
	"us-ak": {
		 "name": "Alaska",
		 "north": 70.41188081,
		 "south": 54.76605412,
		 "west": -151.1088192,
		 "east": -130.5851462,
		 "land_area": 1481346
	},
	"us-as": {
		 "name": "American Samoa",
		 "north": -14.24022391,
		 "south": -14.36996814,
		 "west": -170.8432198,
		 "east": -170.5589486,
		 "land_area": 199
	},
	"us-gu": {
		 "name": "Guam",
		 "north": 13.65316245,
		 "south": 13.24210526,
		 "west": 144.6278356,
		 "east": 144.9571884,
		 "land_area": 544
	},
	"us-hi": {
		 "name": "Hawaii",
		 "north": 22.21947881,
		 "south": 18.92355929,
		 "west": -159.7709846,
		 "east": -154.8193427,
		 "land_area": 16638
	},
	"us-mp": {
		 "name": "Northern Mariana Islands",
		 "north": 15.28966705,
		 "south": 15.09140846,
		 "west": 145.691203,
		 "east": 145.8315142,
		 "land_area": 464
	},
	"us-pr": {
		 "name": "Puerto Rico",
		 "north": 18.52546131,
		 "south": 17.93328144,
		 "west": -67.29242475,
		 "east": -65.60602349,
		 "land_area": 9104
	},
	"us-vi": {
		 "name": "U.S. Virgin Islands",
		 "north": 18.37889652,
		 "south": 17.67634238,
		 "west": -65.03994781,
		 "east": -64.56616244,
		 "land_area": 346
	},
	"uy": {
		 "name": "Uruguay",
		 "north": -30.07303516,
		 "south": -34.98685304,
		 "west": -58.49849656,
		 "east": -53.12099754,
		 "land_area": 175015
	},
	"vt": {
		 "name": "Vietnam",
		 "north": 23.42874977,
		 "south": 8.522110103,
		 "west": 102.139432,
		 "east": 109.4782987,
		 "land_area": 310070
	},
	"za": {
		 "name": "South Africa",
		 "north": -22.04611205,
		 "south": -34.83846031,
		 "west": 16.37467323,
		 "east": 32.92982033,
		 "land_area": 1214470
	}
}

let DATA = {};
let CHECKING_API = false;

const load = () => {
	// default vals
	DATA = {
		round: 0,
		round_started: false,
		game_finished: false,
		last_guess: [0, 0],
		game_score: [],
		game_score_total: 0,
		score_data: {},
	}

	let data = JSON.parse(window.localStorage.getItem('geoScoringRedux'));

	if(data) {
		// reset these vals when the page loads, so it will trigger a round start event when loading a round
		data.round = 0;
		data.round_started = false;
		data.game_finished = false;

		// combine with default vals
		Object.assign(DATA, data);
		save();
	}
}

const save = () => {
	window.localStorage.setItem('geoScoringRedux', JSON.stringify(DATA));
}

const bounds = (box) => {
	if(!box) return false;
	return [box.north, box.south, box.west, box.east];
}

// get current round number from the page element in the top right of the game screen
const getCurrentRound = () => {
	const roundNode = document.querySelector('div[class^="status_inner__"]>div[data-qa="round-number"]');

	if(!roundNode) return null;

	return parseInt(roundNode.children[1].textContent.split(/\//gi)[0].trim(), 10);
}

// get the current game ID from the URL
const getGameId = () => {
	// if we are not on the right URL just return null
	if(window.location.href.indexOf('/game/') === -1 && window.location.href.indexOf('/challenge/') === -1) {
		return null;
	}

	return window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
}

// show the score in the panel in the top right of the game screen
const updateRoundPanel = () => {
	let panel = document.getElementById('redux-score-panel');

	if(!panel) {
		let gameScore = document.querySelector('.game-layout__status div[class^="status_section"][data-qa="score"]');

		if(gameScore) {
			let panel = document.createElement('div');
			panel.id = 'redux-score-panel';
			panel.style.display = 'flex';

			let classLabel = gameScore.querySelector('div[class^="status_label"]').className;
			let valueLabel = gameScore.querySelector('div[class^="status_value"]').className;

			panel.innerHTML = `
				<div class="${gameScore.getAttribute('class')}">
					<div class="${classLabel}">REDUX SCORE</div>
					<div id="redux-score-value" class="${valueLabel}"></div>
				</div>
			`;

			gameScore.parentNode.append(panel);
		}
	}
	
	let streak = document.getElementById('redux-score-value');

	if(streak) {
		streak.innerText = DATA.game_score_total.toLocaleString();
	}
}

// show the debug table on the results screen
const updateSummaryPanel = () => {
	if(CHECKING_API) return;

	calcTotalScore();
}

// convert lat/lng coords to a distance in metres
const latLngToMetres = (loc1, loc2) => {
	loc1[0] = parseFloat(loc1[0]);
	loc1[1] = parseFloat(loc1[1]);
	loc2[0] = parseFloat(loc2[0]);
	loc2[1] = parseFloat(loc2[1]);

	var R = 6378.137; // Radius of earth in KM
	var dLat = loc2[0] * Math.PI / 180 - loc1[0] * Math.PI / 180;
	var dLon = loc2[1] * Math.PI / 180 - loc1[1] * Math.PI / 180;
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
	Math.cos(loc1[0] * Math.PI / 180) * Math.cos(loc2[0] * Math.PI / 180) *
	Math.sin(dLon/2) * Math.sin(dLon/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	var d = R * c;
	return d * 1000; // metres
}

// return a val from 0-1 representing the score as a percentage
const distancePercentage = (guess, target, region) => {
	// get distance between the guess and the correct location
	let guessDistance = latLngToMetres(guess, target);

	// if it's within 25m, return a perfect score
	if(guessDistance <= 25) return 1;

	// get the size of the region
	// currently just calcs the distance between the top left/bottom right of the bounding box diagonal
	let regionDistance = latLngToMetres([region[0], region[2]], [region[1], region[3]]);
	
	let percent = 1 - guessDistance / regionDistance;

	// perfect score tolerance
	if(percent >= 0.9997) {
		percent = 1;
	}

	// clamp vals between 0 and 1
	return Math.max(0, Math.min(percent, 1));
}

// create the debug table
const calcTotalScore = () => {
	if(!document.getElementById('scoring-redux-debug')) {
		let debug = document.createElement('div');
		debug.id = 'scoring-redux-debug';
		debug.style.color = '#fff';
		debug.style.fontFamily = 'monospace';
		debug.style.fontSize = '14px';
		debug.style.position = 'absolute';
		debug.style.zIndex = '999999';
		debug.style.top = '5px';
		debug.style.left = '5px';
		debug.style.display = 'flex';
		debug.style.flexDirection = 'column';
		debug.style.alignItems = 'flex-start';
		document.body.append(debug);
	}

	let data = DATA.score_data;

	if(!COUNTRY_DATA[data.targetCC]) {
		debug.innerHTML = `Country not found in data`;
		debug.style.display = 'flex';
		return;
	}

	const MAX_AREA = 16378410;
	let ratio = Math.pow(Math.log2(COUNTRY_DATA[data.targetCC].land_area) / Math.log2(MAX_AREA), 2);
	
	const RATIO_COUNTRY = ratio * 0.4 + 0.3;
	const RATIO_GEOGUESSR = 1 - RATIO_COUNTRY;

	let scoreGeo = 5000 * RATIO_GEOGUESSR * data.scoreGeoguessr || 0;
	let scoreCountry = 5000 * RATIO_COUNTRY * data.scoreCountry || 0;

	let total = Math.round(scoreGeo + scoreCountry);
	DATA.game_score[DATA.round-1] = total;
	DATA.game_score_total = DATA.game_score.reduce((a,b) => a+=b);
	save();

	let debug = document.getElementById('scoring-redux-debug');
	let roundScoreRows = ``;
	console.log(DATA);

	DATA.game_score.forEach((s, i) => {
		roundScoreRows += `<tr>
			<td>Round ${i+1}</td>
			<td>${s} pts</td>
		</tr>`
	});

	debug.innerHTML = `
		<div style="padding:5px; background:rgba(0,0,0,0.9); margin:5px; flex: 0 0 auto;">
			<table cellpadding="4" border="1" borderColor="#666">
				<tr>
					<td><strong>Type</strong></td>
					<td style="text-align:right"><strong>Amount</strong></td>
					<td style="text-align:right"><strong>Proximity</strong></td>
					<td style="text-align:right"><strong>Ratio</strong></td>
					<td><strong>Guess Location</strong></td>
					<td><strong>Correct Location</strong></td>
					<td style="text-align:right"><strong>Score</strong></td>
				</tr>
				<tr>
					<td>GeoGuessr Score</td>
					<td style="text-align:right">${Math.round(5000 * data.scoreGeoguessr)}</td>
					<td style="text-align:right">${Math.round(data.scoreGeoguessr * 100)}%</td>
					<td style="text-align:right">${RATIO_GEOGUESSR.toFixed(2)}</td>
					<td>N/A</td>
					<td>N/A</td>
					<td style="text-align:right">${Math.round(5000 * data.scoreGeoguessr * RATIO_GEOGUESSR)}</td>
				</tr>
				<tr>
					<td>Country Score</td>
					<td style="text-align:right">${Math.round(5000 * data.scoreCountry)}</td>
					<td style="text-align:right">${Math.round(data.scoreCountry * 100)}%</td>
					<td style="text-align:right">${RATIO_COUNTRY.toFixed(2)}</td>
					<td style="color: ${data.guessCountry == data.targetCountry ? '#8f8' : '#f88'}">${data.guessCountry}</td>
					<td style="color: ${data.guessCountry == data.targetCountry ? '#8f8' : '#f88'}">${data.targetCountry}</td>
					<td style="text-align:right">${Math.round(5000 * data.scoreCountry * RATIO_COUNTRY)}</td>
				</tr>
				<tr>
					<td colspan="7" style="text-align:right"><strong>Round Score: ${total}</strong></td>
				</tr>
			</table>
		</div>

		<div style="padding:5px; background:rgba(0,0,0,0.9); margin:5px; flex: 0 0 auto;">
			<table cellpadding="4" border="1" borderColor="#666">
				${roundScoreRows}
				<tr>
					<td colspan="2" style="text-align:right"><strong>Game Score: ${DATA.game_score_total}</strong></td>
				</tr>
			</table>
		</div>
	`;
	debug.style.display = 'flex';
}

// get game data from the GeoGuessr API
const queryGeoguessrGameData = async (id) => {
	let apiUrl = `https://www.geoguessr.com/api/v3/games/${id}`;

	if(location.pathname.startsWith("/challenge/")) {
		apiUrl = `https://www.geoguessr.com/api/v3/challenges/${id}/game`;
	}

	return await fetch(apiUrl).then(res => res.json());
}

// get coord data from OpenStreetMaps
const queryAPI = async (location) => {
	let apiUrl = `https://nominatim.openstreetmap.org/reverse.php?lat=${location[0]}&lon=${location[1]}&zoom=18&format=jsonv2&accept-language=en`;

	return await fetch(apiUrl).then(res => res.json());
}

const getCountryCode = (data) => {
	let cc = data.address.country_code;

	// australia
	if(cc === 'au') {
		switch(data.address['territory']) {
			case 'Christmas Island': return 'au-cx';
			case 'Cocos (Keeling) Islands': return 'au-cc';
		}
	}

	// china
	else if(cc === 'cn') {
		switch(data.address['ISO3166-2-lvl3']) {
			case 'CN-HK': return 'cn-hk'; // Hong Kong
			case 'CN-MO': return 'cn-mo'; // Macau
		}
	}

	// france
	else if(cc === 'fr') {
		switch(data.address['ISO3166-2-lvl4']) {
			case 'FR-974': return 'fr-re'; // Reunion
		}
	}

	// netherlands
	else if(cc === 'nl') {
		switch(data.address['ISO3166-2-lvl3']) {
			case 'NL-CW': return 'nl-cw'; // Curacao
		}
	}

	// palestine
	else if(cc === 'ps') return 'il';

	// united states
	else if(cc === 'us') {
		switch(data.address['state']) {
			case 'Alaska': return 'us-ak'; // Alaska
			case 'American Samoa': return 'us-as'; // American Samoa
			case 'Guam': return 'us-gu'; // Guam
			case 'Hawaii': return 'us-hi'; // Hawaii
			case 'Northern Mariana Islands': return 'us-mp'; // Northern Mariana Islands
			case 'Puerto Rico': return 'us-pr'; // Puerto Rico
			case 'United States Virgin Islands': return 'us-vi'; // US Virgin Islands
		}
	}

	return cc;
}

const startRound = () => {
	let gameId = getGameId();
	let currentRound = getCurrentRound();

	// don't start the round if we are not currently in a game or there is no round num
	if(!gameId || !currentRound) {
		return false;
	}

	DATA.round = currentRound;
	DATA.round_started = true;
	DATA.game_finished = false;
	DATA.gameId = gameId;

	// if it's round 1 it's the start of a new game so clear the scores from the previous game
	if(DATA.round === 1) {
		DATA.game_score = [];
		DATA.game_score_total = 0;
	}

	updateRoundPanel();

	// hide the debug table when round starts
	if(document.getElementById('scoring-redux-debug')) {
		document.getElementById('scoring-redux-debug').style.display = 'none';
	}
}

const stopRound = async () => {
	DATA.round_started = false;
	CHECKING_API = true;
	updatePanels();

	// get current game data from GeoGuessr API
	let gameDetails = await await queryGeoguessrGameData(DATA.gameId);

	// get the most recent guess/location coords
	let guess_counter = gameDetails.player.guesses.length;
	let guess = [gameDetails.player.guesses[guess_counter-1].lat, gameDetails.player.guesses[guess_counter-1].lng];
	let target = [gameDetails.rounds[guess_counter-1].lat, gameDetails.rounds[guess_counter-1].lng];

	// if we have already gotten the data for these coords, just return
	if (guess[0] == DATA.last_guess[0] && guess[1] == DATA.last_guess[1]) {
		CHECKING_API = false;
		updatePanels();
		return;
	}

	DATA.last_guess = guess;

	let scoreData = {
		scoreGeoguessr: gameDetails.player.guesses[guess_counter-1].roundScoreInPoints / 5000,
		scoreCountry: 0,
		guessCC: null,
		targetCC: null,
		guessCountry: null,
		targetCountry: null,
	}

	// get country data for the guess and location from OSM
	let guessCountry = await queryAPI(guess);
	let targetCountry = await queryAPI(target);
	console.log('guess: ', guessCountry);
	console.log('location: ', targetCountry);
	
	scoreData.guessCC = getCountryCode(guessCountry);
	scoreData.targetCC = getCountryCode(targetCountry);
	scoreData.guessCountry = COUNTRY_DATA[scoreData.guessCC].name;
	scoreData.targetCountry = COUNTRY_DATA[scoreData.targetCC].name;

	// get bounding box
	let bb = bounds(COUNTRY_DATA[scoreData.targetCC]);

	// score x^6 if the country is wrong so you don't get 0 points, but also get punished for getting country wrong
	let exponent = scoreData.guessCC === scoreData.targetCC ? 2 : 4;
	scoreData.scoreCountry = Math.pow(distancePercentage(guess, target, bb), exponent);

	CHECKING_API = false;
	DATA.score_data = scoreData;
	save();

	updatePanels();
}

const updatePanels = () => {
	updateRoundPanel();
	updateSummaryPanel();
}

const init = () => {
	load();

	const observer = new MutationObserver(() => {
		// if we are not in a game, hide the debug table
		if(window.location.href.indexOf('/game/') === -1 && window.location.href.indexOf('/challenge/') === -1) {
			if(document.getElementById('scoring-redux-debug')) {
				document.getElementById('scoring-redux-debug').style.display = 'none';
			}
		}

		const gameLayout = document.querySelector('.game-layout');
		const resultLayout = document.querySelector('div[class^="result-layout_root"]');
		const finalScoreLayout = document.querySelector('div[class^="result-layout_root"] div[class^="standard-final-result_score__"]');

		if(gameLayout) {
			// if the round or game ID has changed, start a new round
			if (DATA.round !== getCurrentRound() || DATA.gameId !== getGameId()) {
				// if the previous round is still in progress, stop it first
				if(DATA.round_started) {
					stopRound();
				}

				startRound();
			}else if(resultLayout && DATA.round_started) {
				stopRound();
			}else if(finalScoreLayout && !DATA.game_finished) {
				DATA.game_finished = true;
				updatePanels();
			}
		}
	});

	observer.observe(document.querySelector('#__next'), { subtree: true, childList: true });
}

init();