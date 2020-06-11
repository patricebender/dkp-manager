export class Bosses {

    static BossList(dungeonName: string) {
        if (dungeonName.includes('BWL') || dungeonName.includes('Blackwing'))
            return [
                'Razorgore the Untamed',
                'Vaelastrasz the Corrupt',
                'Broodlord Lashlayer',
                'Firemaw',
                'Ebonroc',
                'Flamegor',
                'Chromaggus',
                'Nefarian',
            ];
    }

    static LootList(boss: string) {
        switch (boss) {
            case 'Razorgore the Untamed':
                return [
                    19336,
                    16926,
                    16911,
                    16959,
                    16943,
                    16935,
                    19369,
                    19370,
                    16934,
                    16918,
                    19335,
                    16904,
                    19337,
                    19334
                ];
            case 'Vaelastrasz the Corrupt':
                return [
                    16818,
                    16903,
                    16933,
                    16960,
                    16944,
                    16936,
                    16910,
                    16925,
                    19339,
                    19340,
                    19371,
                    19372,
                    19346,
                    19348
                ];
            case  'Broodlord Lashlayer':
                return [
                    16912,
                    16898,
                    16927,
                    16965,
                    16949,
                    16941,
                    16906,
                    16919,
                    19341,
                    19342,
                    19373,
                    19374,
                    19350,
                    19351
                ];
            case  'Firemaw':
                return [
                    16913,
                    16899,
                    16928,
                    16964,
                    16948,
                    16940,
                    16907,
                    16920,
                    19396,
                    19394,
                    19397,
                    19395,
                    19355,
                    19353,
                    //Firemaw only
                    19344,
                    19399,
                    19400,
                    19365,
                    19402,
                    19401


                ];
            case  'Ebonroc':
                return [
                    16913,
                    16899,
                    16928,
                    16964,
                    16948,
                    16940,
                    16907,
                    16920,
                    19396,
                    19394,
                    19397,
                    19395,
                    19355,
                    19353,
                    // Ebonroc only
                    19401,
                    19403,
                    19406,
                    19407,
                    19405,
                    19368

                ];
            case  'Flamegor':
                return [
                    16913,
                    16899,
                    16928,
                    16964,
                    16948,
                    16940,
                    16907,
                    16920,
                    19396,
                    19394,
                    19397,
                    19395,
                    19355,
                    19353,
                    // Flamegor only
                    19430,
                    19432,
                    19433,
                    19431,
                    19367,
                    19357

                ];
            case  'Chromaggus':
                return [
                    16917,
                    16902,
                    16932,
                    16961,
                    16945,
                    16937,
                    16832,
                    16924,
                    19388,
                    19390,
                    19389,
                    19391,
                    19387,
                    19386,
                    19392,
                    19385,
                    19352,
                    19347,
                    19393,
                    19361,
                    19349
                ];
            case  'Nefarian':
                return [
                    16916,
                    16897,
                    16931,
                    16966,
                    16950,
                    16942,
                    16905,
                    16923,
                    19002,
                    19378,
                    19381,
                    19380,
                    19376,
                    19379,
                    19382,
                    19375,
                    19377,
                    19364,
                    19363,
                    19360
                ];
        }
    }
}
