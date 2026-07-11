/**
 * Maps every Frankfurter currency code to an ISO 3166-1 alpha-2 country code
 * for use with country-flag-icons. Multi-country currencies (XAF, XOF, XCD)
 * use the most representative member state. Commodities and the IMF SDR
 * (XAG, XAU, XPD, XPT, XDR) have no country flag and are intentionally omitted.
 */
export const CURRENCY_FLAG_MAP: Record<string, string> = {
    // A
    AED: 'AE', // United Arab Emirates Dirham
    AFN: 'AF', // Afghan Afghani
    ALL: 'AL', // Albanian Lek
    AMD: 'AM', // Armenian Dram
    ANG: 'CW', // Netherlands Antillean Gulden → Curaçao (modern successor territory)
    AOA: 'AO', // Angolan Kwanza
    ARS: 'AR', // Argentine Peso
    ATS: 'AT', // Austrian Schilling (archived)
    AUD: 'AU', // Australian Dollar
    AWG: 'AW', // Aruban Florin

    // B
    AZN: 'AZ', // Azerbaijani Manat
    BAM: 'BA', // Bosnia and Herzegovina Convertible Mark
    BBD: 'BB', // Barbadian Dollar
    BDT: 'BD', // Bangladeshi Taka
    BEF: 'BE', // Belgian Franc (archived)
    BGN: 'BG', // Bulgarian Lev
    BHD: 'BH', // Bahraini Dinar
    BIF: 'BI', // Burundian Franc
    BMD: 'BM', // Bermudian Dollar
    BND: 'BN', // Brunei Dollar
    BOB: 'BO', // Bolivian Boliviano
    BRL: 'BR', // Brazilian Real
    BSD: 'BS', // Bahamian Dollar
    BTN: 'BT', // Bhutanese Ngultrum
    BWP: 'BW', // Botswana Pula
    BYN: 'BY', // Belarusian Ruble
    BYR: 'BY', // Belarusian Ruble (archived)
    BZD: 'BZ', // Belize Dollar

    // C
    CAD: 'CA', // Canadian Dollar
    CDF: 'CD', // Congolese Franc
    CHF: 'CH', // Swiss Franc
    CLP: 'CL', // Chilean Peso
    CNH: 'CN', // Chinese Renminbi Yuan Offshore
    CNY: 'CN', // Chinese Renminbi Yuan
    COP: 'CO', // Colombian Peso
    CRC: 'CR', // Costa Rican Colón
    CUC: 'CU', // Cuban Convertible Peso (archived)
    CUP: 'CU', // Cuban Peso
    CVE: 'CV', // Cape Verdean Escudo
    CYP: 'CY', // Cyprus Pound (archived)
    CZK: 'CZ', // Czech Koruna

    // D
    DEM: 'DE', // Deutsche Mark (archived)
    DJF: 'DJ', // Djiboutian Franc
    DKK: 'DK', // Danish Krone
    DOP: 'DO', // Dominican Peso
    DZD: 'DZ', // Algerian Dinar

    // E
    EEK: 'EE', // Estonian Kroon (archived)
    EGP: 'EG', // Egyptian Pound
    ERN: 'ER', // Eritrean Nakfa
    ESP: 'ES', // Spanish Peseta (archived)
    ETB: 'ET', // Ethiopian Birr
    EUR: 'EU', // Euro

    // F
    FIM: 'FI', // Finnish Markka (archived)
    FJD: 'FJ', // Fijian Dollar
    FKP: 'FK', // Falkland Pound
    FRF: 'FR', // French Franc (archived)

    // G
    GBP: 'GB', // British Pound
    GEL: 'GE', // Georgian Lari
    GGP: 'GG', // Guernsey Pound
    GHC: 'GH', // Ghanaian Cedi (archived)
    GHS: 'GH', // Ghanaian Cedi
    GIP: 'GI', // Gibraltar Pound
    GMD: 'GM', // Gambian Dalasi
    GNF: 'GN', // Guinean Franc
    GRD: 'GR', // Greek Drachma (archived)
    GTQ: 'GT', // Guatemalan Quetzal
    GYD: 'GY', // Guyanese Dollar

    // H
    HKD: 'HK', // Hong Kong Dollar
    HNL: 'HN', // Honduran Lempira
    HRK: 'HR', // Croatian Kuna (archived)
    HTG: 'HT', // Haitian Gourde
    HUF: 'HU', // Hungarian Forint

    // I
    IDR: 'ID', // Indonesian Rupiah
    IEP: 'IE', // Irish Pound (archived)
    ILS: 'IL', // Israeli New Shekel
    IMP: 'IM', // Isle of Man Pound
    INR: 'IN', // Indian Rupee
    IQD: 'IQ', // Iraqi Dinar
    IRR: 'IR', // Iranian Rial
    ISK: 'IS', // Icelandic Króna
    ITL: 'IT', // Italian Lira (archived)

    // J
    JEP: 'JE', // Jersey Pound
    JMD: 'JM', // Jamaican Dollar
    JOD: 'JO', // Jordanian Dinar
    JPY: 'JP', // Japanese Yen

    // K
    KES: 'KE', // Kenyan Shilling
    KGS: 'KG', // Kyrgyzstani Som
    KHR: 'KH', // Cambodian Riel
    KMF: 'KM', // Comorian Franc
    KPW: 'KP', // North Korean Won
    KRW: 'KR', // South Korean Won
    KWD: 'KW', // Kuwaiti Dinar
    KYD: 'KY', // Cayman Islands Dollar
    KZT: 'KZ', // Kazakhstani Tenge

    // L
    LAK: 'LA', // Lao Kip
    LBP: 'LB', // Lebanese Pound
    LKR: 'LK', // Sri Lankan Rupee
    LRD: 'LR', // Liberian Dollar
    LSL: 'LS', // Lesotho Loti
    LTL: 'LT', // Lithuanian Litas (archived)
    LUF: 'LU', // Luxembourg Franc (archived)
    LVL: 'LV', // Latvian Lats (archived)
    LYD: 'LY', // Libyan Dinar

    // M
    MAD: 'MA', // Moroccan Dirham
    MDL: 'MD', // Moldovan Leu
    MGA: 'MG', // Malagasy Ariary
    MKD: 'MK', // Macedonian Denar
    MMK: 'MM', // Myanmar Kyat
    MNT: 'MN', // Mongolian Tögrög
    MOP: 'MO', // Macanese Pataca
    MRO: 'MR', // Mauritanian Ouguiya (archived)
    MRU: 'MR', // Mauritanian Ouguiya
    MTL: 'MT', // Maltese Lira (archived)
    MUR: 'MU', // Mauritian Rupee
    MVR: 'MV', // Maldivian Rufiyaa
    MWK: 'MW', // Malawian Kwacha
    MXN: 'MX', // Mexican Peso
    MYR: 'MY', // Malaysian Ringgit
    MZN: 'MZ', // Mozambican Metical

    // N
    NAD: 'NA', // Namibian Dollar
    NGN: 'NG', // Nigerian Naira
    NIO: 'NI', // Nicaraguan Córdoba
    NLG: 'NL', // Dutch Guilder (archived)
    NOK: 'NO', // Norwegian Krone
    NPR: 'NP', // Nepalese Rupee
    NZD: 'NZ', // New Zealand Dollar

    // O
    OMR: 'OM', // Omani Rial

    // P
    PAB: 'PA', // Panamanian Balboa
    PEN: 'PE', // Peruvian Sol
    PGK: 'PG', // Papua New Guinean Kina
    PHP: 'PH', // Philippine Peso
    PKR: 'PK', // Pakistani Rupee
    PLN: 'PL', // Polish Złoty
    PTE: 'PT', // Portuguese Escudo (archived)
    PYG: 'PY', // Paraguayan Guaraní

    // Q
    QAR: 'QA', // Qatari Riyal

    // R
    ROL: 'RO', // Romanian Leu old (archived)
    RON: 'RO', // Romanian Leu
    RSD: 'RS', // Serbian Dinar
    RUB: 'RU', // Russian Ruble
    RWF: 'RW', // Rwandan Franc

    // S
    SAR: 'SA', // Saudi Riyal
    SBD: 'SB', // Solomon Islands Dollar
    SCR: 'SC', // Seychellois Rupee
    SDG: 'SD', // Sudanese Pound
    SEK: 'SE', // Swedish Krona
    SGD: 'SG', // Singapore Dollar
    SHP: 'SH', // Saint Helenian Pound
    SIT: 'SI', // Slovenian Tolar (archived)
    SKK: 'SK', // Slovak Koruna (archived)
    SLE: 'SL', // New Leone
    SLL: 'SL', // Sierra Leonean Leone (archived)
    SOS: 'SO', // Somali Shilling
    SRD: 'SR', // Surinamese Dollar
    SSP: 'SS', // South Sudanese Pound
    STD: 'ST', // São Tomé and Príncipe Dobra (archived)
    STN: 'ST', // São Tomé and Príncipe Second Dobra
    SVC: 'SV', // Salvadoran Colón
    SYP: 'SY', // Syrian Pound
    SZL: 'SZ', // Swazi Lilangeni

    // T
    THB: 'TH', // Thai Baht
    TJS: 'TJ', // Tajikistani Somoni
    TMM: 'TM', // Turkmenistani Manat (archived)
    TMT: 'TM', // Turkmenistani Manat
    TND: 'TN', // Tunisian Dinar
    TOP: 'TO', // Tongan Paʻanga
    TRL: 'TR', // Turkish Lira old (archived)
    TRY: 'TR', // Turkish Lira
    TTD: 'TT', // Trinidad and Tobago Dollar
    TWD: 'TW', // New Taiwan Dollar
    TZS: 'TZ', // Tanzanian Shilling

    // U
    UAH: 'UA', // Ukrainian Hryvnia
    UGX: 'UG', // Ugandan Shilling
    USD: 'US', // United States Dollar
    UYU: 'UY', // Uruguayan Peso
    UZS: 'UZ', // Uzbekistan Som

    // V
    VEF: 'VE', // Venezuelan Bolívar (archived)
    VES: 'VE', // Venezuelan Bolívar Soberano
    VND: 'VN', // Vietnamese Đồng
    VUV: 'VU', // Vanuatu Vatu

    // W
    WST: 'WS', // Samoan Tala

    // X — multi-country / regional currencies
    XAF: 'CF', // Central African CFA Franc → Central African Republic (representative member)
    XCD: 'AG', // East Caribbean Dollar → Antigua and Barbuda (representative member)
    XCG: 'CW', // Caribbean Guilder → Curaçao
    XEU: 'EU', // European Currency Unit (archived)
    XOF: 'SN', // West African CFA Franc → Senegal (representative member)
    XPF: 'PF', // CFP Franc → French Polynesia (representative territory)

    // Y
    YER: 'YE', // Yemeni Rial

    // Z
    ZAR: 'ZA', // South African Rand
    ZMK: 'ZM', // Zambian Kwacha (archived)
    ZMW: 'ZM', // Zambian Kwacha
    ZWD: 'ZW', // Zimbabwean Dollar (archived)
    ZWG: 'ZW', // Zimbabwe Gold
    ZWL: 'ZW', // Zimbabwean Dollar (archived)
    ZWN: 'ZW', // Zimbabwean Dollar (archived)
    ZWR: 'ZW', // Zimbabwean Dollar (archived)
}
