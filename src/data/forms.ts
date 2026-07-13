export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'radio' | 'signature' | 'handwriting';
  placeholder?: string;
  options?: string[];
  rows?: number;
  fullWidth?: boolean;
  section?: string;
}

export interface FormDefinition {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  institution: string;
  unit: string;
  description: string[];
  sections: {
    title?: string;
    content?: string[];
    isWarning?: boolean;
    isNote?: boolean;
  }[];
  fields: FormField[];
}

export const forms: FormDefinition[] = [
  {
    id: 'hpv-serviks',
    title: 'RAHIM AGZI (SERVIKS) KANSER TARAMASI BILGILENDIRILMIS ONAM FORMU',
    subtitle: 'Bilgilendirilmis Onam',
    icon: 'ShieldPlus',
    institution: 'T.C. SAGLIK BAKANLIGI',
    unit: 'ANTALYA KEPEZ 185 NOLU AILE HEKIMLIGI BIRIMI',
    description: [
      'Bu form size uygulanacak islemin nasil yapilacagi, riskleri, islemin sonuclari ve islem uygulanmazsa karsilasabileceginiz durumlar hakkinda bilgi vermektedir. Bilgilerden herhangi birini anlamakta gucluk cekerseniz saglik personelinin aciklamasi icin lutfen danisniz.',
      'Yapilacak test, rahim agzinda olusabilecek bir kanser oncesi lezyonun tespiti icin alinan suruntu ornegi olup rahim agzi kanserinin erken teshisi icin onemli bir tani yontemidir.',
    ],
    sections: [
      {
        title: 'YAPILMASI PLANLANAN GIRISIM(ler)',
        content: [
          'Adet donemi disinda, yapilacak olan islem jinekolojik muayene olmayi gerektirmektedir. Muayene sirasinda saglik personeli tarafindan ornek alma cubugu ile rahim agzinizdan suruntu ornegi alinacaktir.',
        ],
      },
      {
        title: 'OLASI YAN ETKI(ler)',
        content: [
          'Islem herhangi bir komplikasyon icermemektedir ve agrili degildir. Ornek alindiktan sonra bir iki damla kanamaniz olabilir.',
          'Yapilacak islem(ler), T.C Saglik Bakanligi Turkiye Halk Sagligi Kurumu Kanser Dairesi adina uygulanmaktadir.',
        ],
      },
      {
        title: 'AYDINLATILMIS ONAM',
        content: [
          'Ulkemizde uygulanan Ulusal Servikal Kanser Tarama Programi ile kadinlarimizin rahim agzi kanserinden olumlerin azaltilmasi amaclanmaktadir.',
          'Rahim agzi kanserine HPV adinda bir virusun enfeksiyonu yol acmaktadir. Virusun alinmasindan kanser gelismesine kadar yaklasik 10-15 yillik bir surec oldugundan bu surede rahim agzi kanser onculu lezyonlarin tespiti ve tedavisi mumkundur.',
          'HPV ve/veya smear testinin negatif olmasi, normal sonuctur ve rahim agzinda aktif enfeksiyon veya kansere donusmus ya da donusmekte olan hucre bulunmadigi anlamina gelir. Normal sonuc, servikal kanser olmadigini veya ileride asla olmayacagini garantilemez. 5 yil sonra tekrar servikal kanser taramasi yaptirmaniz gerekir.',
          'HPV testinin pozitif olmasi anormal sonuctur ve rahim agzinda aktif enfeksiyon oldugunu gosterir. Smear testinin pozitif olmasi ise rahim agzinda kansere donusum gostermis ya da gostermeye baslamis hucre oldugunu gosterir. Bu sonuc, kanser tansi degildir, ancak ileri degerlendirme icin uzman hekime gidilmesi gerektigini gosterir. Uzman hekim tarafindan rahim agzinda inceleme yapilacaktir. Ikinci bir ornek (servikal smear) alinabilir. Eger smear anormalse ya da muayene bulgulari supheliyse, rahim agzinda tedavi gerektiren bir sorun olup olmadigini belirlemek icin uzman hekim rahim agzini kolposkopi denilen aletle inceleyecek ve gerekli ise buradan parca (biyopsi) alacaktir.',
          'Yetersiz sonuc, HPV veya smear testi icin alinan ornegin yeterli olmamasi demektir. Yetersiz sonuc kanser olmadigi anlamina gelmez, sadece tekrar test yaptirilmasi gerektigini gosterir. Sonuc yetersiz cikarsa, test tekrarlanir. Bu gereklidir, cunku sonucun yetersiz olmasi durumunda rahim agzi kanseri ihtimali ekarte edilemez.',
        ],
      },
      {
        content: [
          'Asagidaki imza ile formun icerigini okudugumu (bana okundugunu), hastalik(lar) ve planlanan girisim(ler) hakkinda tarafima ayrintili bilgi verildigini, olasi yan etkilerin ve risklerin eksiksiz olarak anlatildigini, istemem halinde soru sorma ve bilgi alma firsatinin bana saglandigini biliyor ve yapilacak islemleri, kendi rizamla kabul ediyorum.',
        ],
      },
      {
        title: 'LUtfEN DIKKAT',
        content: [
          'ONCEDEN RAHIM AGZINDA KANSER ONCESI LEZYON NEDENIYLE TEDAVI GORDUYSENIZ / TAKIP EDILIYORSANIZ MUTLAKA BILDIRINIZ',
        ],
        isWarning: true,
      },
      {
        content: [
          'Yukarida "LUtfEN DIKKAT" basligi altinda belirtilen ve bildirilmesi istenen durumlardan gerekli olanlar tarafimdan saglik personeline bildirilmistir.',
        ],
      },
    ],
    fields: [
      {
        id: 'onceki_tedavi',
        label: 'Daha once rahim agzi kanser oncesi lezyon nedeniyle tedavi gordunuz mu?',
        type: 'radio',
        options: ['EVET', 'HAYIR'],
        section: 'UYARI',
      },
      {
        id: 'ad_soyad_onay',
        label: 'Adi Soyadi',
        type: 'text',
        placeholder: 'Taramasi yapilan kisinin adi ve soyadi',
        section: 'TARAMASI YAPILAN KISI YA DA KANUNI TEMSILCISI',
      },
      {
        id: 'tc_kimlik_no',
        label: 'T.C. Kimlik No',
        type: 'text',
        placeholder: 'T.C. Kimlik Numarasi',
        section: 'TARAMASI YAPILAN KISI YA DA KANUNI TEMSILCISI',
      },
      {
        id: 'tarih_onay',
        label: 'Tarih',
        type: 'date',
        section: 'TARAMASI YAPILAN KISI YA DA KANUNI TEMSILCISI',
      },
      {
        id: 'hasta_imza',
        label: 'Hastanin / Temsilcinin Imzasi',
        type: 'signature',
        section: 'TARAMASI YAPILAN KISI YA DA KANUNI TEMSILCISI',
      },
      {
        id: 'tanik_ad_soyad',
        label: 'Tanik Adi Soyadi',
        type: 'text',
        placeholder: 'Tanik adi ve soyadi',
        section: 'TANIK',
      },
      {
        id: 'tanik_yakinlik',
        label: 'Taramasi Yapilan Kisiye Yakinligi',
        type: 'text',
        placeholder: 'Yakinlik derecesi',
        section: 'TANIK',
      },
      {
        id: 'tanik_tc',
        label: 'Tanik T.C. Kimlik No',
        type: 'text',
        placeholder: 'Tanik T.C. Kimlik Numarasi',
        section: 'TANIK',
      },
      {
        id: 'tanik_tarih',
        label: 'Tanik Tarih',
        type: 'date',
        section: 'TANIK',
      },
      {
        id: 'tanik_imza',
        label: 'Tanik Imzasi',
        type: 'signature',
        section: 'TANIK',
      },
      {
        id: 'red_ad_soyad',
        label: 'Adi Soyadi (Red)',
        type: 'text',
        placeholder: 'Tetkiki reddeden kisinin adi ve soyadi',
        section: 'TETKIkiN REDDi',
      },
      {
        id: 'red_tc',
        label: 'T.C. Kimlik No (Red)',
        type: 'text',
        placeholder: 'T.C. Kimlik Numarasi',
        section: 'TETKIkiN REDDi',
      },
      {
        id: 'red_tarih',
        label: 'Tarih (Red)',
        type: 'date',
        section: 'TETKIkiN REDDi',
      },
      {
        id: 'red_imza',
        label: 'Imza (Red)',
        type: 'signature',
        section: 'TETKIkiN REDDi',
      },
      {
        id: 'red_tanik_ad',
        label: 'Tanik Adi Soyadi (Red)',
        type: 'text',
        placeholder: 'Tanik adi ve soyadi',
        section: 'TETKIkiN REDDi - TANIK',
      },
      {
        id: 'red_tanik_yakinlik',
        label: 'Taramasi Yapilan Kisiye Yakinligi (Red)',
        type: 'text',
        placeholder: 'Yakinlik derecesi',
        section: 'TETKIkiN REDDi - TANIK',
      },
      {
        id: 'red_tanik_imza',
        label: 'Tanik Imzasi (Red)',
        type: 'signature',
        section: 'TETKIkiN REDDi - TANIK',
      },
      {
        id: 'personel_ad_soyad',
        label: 'Bilgilendirme Yapan Saglik Personeli Adi Soyadi',
        type: 'text',
        placeholder: 'Personel adi ve soyadi',
        section: 'BILGILENDIRME YAPAN SAGLIK PERSONELI',
      },
      {
        id: 'personel_tarih',
        label: 'Tarih',
        type: 'date',
        section: 'BILGILENDIRME YAPAN SAGLIK PERSONELI',
      },
      {
        id: 'personel_imza',
        label: 'Personel Imzasi',
        type: 'signature',
        section: 'BILGILENDIRME YAPAN SAGLIK PERSONELI',
      },
    ],
  },
  {
    id: 'kalin-bagirsak',
    title: 'KALIN BAGIRSAK KANSER TARAMASI BILGILENDIRILMIS ONAM FORMU',
    subtitle: 'Bilgilendirilmis Onam',
    icon: 'TestTubes',
    institution: 'T.C. SAGLIK BAKANLIGI',
    unit: 'ANTALYA KEPEZ 185 NOLU AILE HEKIMLIGI BIRIMI',
    description: [
      'Bu form size uygulanacak islemin nasil yapilacagi, riskleri, islemin sonuclari ve islem uygulanmazsa karsilasabileceginiz durumlar hakkinda bilgi vermektedir. Bilgilerden herhangi birini anlamakta gucluk cekerseniz saglik personelinin aciklamasi icin lutfen danisniz.',
      'Yapilacak test; kalin bagirsakta olusabilecek bir kanserin tespiti icin alinacak diski ornegi olup, test kanser acisindan riskli kisileri belirler ve erken teshis icin onemli bir tani yontemidir.',
    ],
    sections: [
      {
        title: 'YAPILMASI PLANLANAN ISLEM',
        content: [
          'Diski orneginiz uygun bir kaba alindiktan sonra, size verilecek olan numune cubugu yardimiyla alinan diski ornegi, hazir olan kart test yardimiyla incelenecektir. Bu isleme gaitada gizli kan testi denilmektedir. Islemin herhangi bir yan etkisi yoktur.',
          'Yapilacak islem(ler), T.C Saglik Bakanligi Turkiye Halk Sagligi Kurumu Kanser Dairesi adina uygulanmaktadir.',
        ],
      },
      {
        title: 'AYDINLATILMIS ONAM',
        content: [
          'Kalinbagirsak kanseri gelismeden onlemek ve erken evrede yakalayabilmek icin tarama testleri kullanilmaktadir.',
          'Ulkemizde uygulanan Ulusal Kolorektal Kanser Tarama Programi ile bireylerin kalin bagirsak kanserinden olumlerinin azaltilmasi amaclanmaktadir.',
          'Gaitada gizli kan testinin negatif olmasi; normal sonuctur ve test orneginde kan bulunmadigi anlamina gelir. Normal sonuc, kalin bagirsak kanseri olmadigini veya ileride asla olmayacagini garantilemez. 2 yil sonra gaitada gizli kan testi tekrarlanir. 51. ve 61. yaslarda kolonoskopi onerilmektedir.',
          'Gaitada gizli kan testinin pozitif olmasi; normal olmayan sonuctur ve diskida kan bulunmus oldugunu gosterir. Bu sonuc, kanser tansi degildir, ancak kisinin uzman hekimce degerlendirilmesi gerektigini gosterir. Normal olmayan sonucun nedeni kalin bagirsak kanseri disinda, polip kanamasi veya basur gibi baska hastaliktan kaynaklanmis olabilir. Sonuc normal cikmazsa, tedavi gerektiren bir sorun olup olmadigini belirlemek icin kalin bagirsagin daha ayrintili bir sekilde muayene edilmesi gerekebilir.',
          'Belirsiz sonuc, gaitada gizli kan testi icin alinan ornekte; kan olup olmadiginin net olarak gorulememesidir. Belirsiz sonuc kanser olmadigi anlamina gelmez, sadece tekrar test yaptirilmasi gerektigini gosterir. Sonuc belirsiz cikarsa, iki-uc gun ara ile en fazla iki kere daha gaitada gizli kan testi yapilir. Bu gereklidir cunku polipler ve kanserler surekli kanama yapmazlar.',
        ],
      },
      {
        content: [
          'Asagidaki imza ile formun icerigini okudugumu (bana okundugunu), hastalik(lar) ve planlanan girisim(ler) hakkinda tarafima ayrintili bilgi verildigini, olasi yan etkilerin ve risklerin eksiksiz olarak anlatildigini, istemem halinde soru sorma ve bilgi alma firsatinin bana saglandigini biliyor ve yapilacak islemleri kendi rizamla kabul ediyorum.',
        ],
      },
      {
        title: 'LUtfEN DIKKAT',
        content: [
          'KAN SULANDIRICI ILACLAR (ASPIRIN VE TuREVLERI; PLAVIX, COUMADIN, HEPARIN GIBI) KULLANIYORSANIZ MUTLAKA BILDIRINIZ.',
        ],
        isWarning: true,
      },
      {
        content: [
          'Yukarida "LUtfEN DIKKAT" basligi altinda belirtilen ve bildirilmesi istenen durumlardan gerekli olanlar tarafimdan saglik personeline bildirilmistir.',
        ],
      },
    ],
    fields: [
      {
        id: 'kan_sulandirici',
        label: 'Kan sulandirici ilac kullaniyor musunuz?',
        type: 'radio',
        options: ['EVET', 'HAYIR'],
        section: 'UYARI',
      },
      {
        id: 'ad_soyad_onay',
        label: 'Adi Soyadi',
        type: 'text',
        placeholder: 'Taramasi yapilan kisinin adi ve soyadi',
        section: 'TARAMASI YAPILAN KISI YA DA KANUNI TEMSILCISI',
      },
      {
        id: 'tc_kimlik_no',
        label: 'T.C. Kimlik No',
        type: 'text',
        placeholder: 'T.C. Kimlik Numarasi',
        section: 'TARAMASI YAPILAN KISI YA DA KANUNI TEMSILCISI',
      },
      {
        id: 'tarih_onay',
        label: 'Tarih',
        type: 'date',
        section: 'TARAMASI YAPILAN KISI YA DA KANUNI TEMSILCISI',
      },
      {
        id: 'hasta_imza',
        label: 'Hastanin / Temsilcinin Imzasi',
        type: 'signature',
        section: 'TARAMASI YAPILAN KISI YA DA KANUNI TEMSILCISI',
      },
      {
        id: 'tanik_ad_soyad',
        label: 'Tanik Adi Soyadi',
        type: 'text',
        placeholder: 'Tanik adi ve soyadi',
        section: 'TANIK',
      },
      {
        id: 'tanik_yakinlik',
        label: 'Taramasi Yapilan Kisiye Yakinligi',
        type: 'text',
        placeholder: 'Yakinlik derecesi',
        section: 'TANIK',
      },
      {
        id: 'tanik_imza',
        label: 'Tanik Imzasi',
        type: 'signature',
        section: 'TANIK',
      },
      {
        id: 'red_ad_soyad',
        label: 'Adi Soyadi (Red)',
        type: 'text',
        placeholder: 'Tetkiki reddeden kisinin adi ve soyadi',
        section: 'TETKIkiN REDDi',
      },
      {
        id: 'red_tc',
        label: 'T.C. Kimlik No (Red)',
        type: 'text',
        placeholder: 'T.C. Kimlik Numarasi',
        section: 'TETKIkiN REDDi',
      },
      {
        id: 'red_tarih',
        label: 'Tarih (Red)',
        type: 'date',
        section: 'TETKIkiN REDDi',
      },
      {
        id: 'red_imza',
        label: 'Imza (Red)',
        type: 'signature',
        section: 'TETKIkiN REDDi',
      },
      {
        id: 'red_tanik_ad',
        label: 'Tanik Adi Soyadi (Red)',
        type: 'text',
        placeholder: 'Tanik adi ve soyadi',
        section: 'TETKIkiN REDDi - TANIK',
      },
      {
        id: 'red_tanik_yakinlik',
        label: 'Taramasi Yapilan Kisiye Yakinligi (Red)',
        type: 'text',
        placeholder: 'Yakinlik derecesi',
        section: 'TETKIkiN REDDi - TANIK',
      },
      {
        id: 'red_tanik_imza',
        label: 'Tanik Imzasi (Red)',
        type: 'signature',
        section: 'TETKIkiN REDDi - TANIK',
      },
      {
        id: 'personel_ad_soyad',
        label: 'Bilgilendirme Yapan Saglik Personeli Adi Soyadi',
        type: 'text',
        placeholder: 'Personel adi ve soyadi',
        section: 'BILGILENDIRME YAPAN SAGLIK PERSONELI',
      },
      {
        id: 'personel_tarih',
        label: 'Tarih',
        type: 'date',
        section: 'BILGILENDIRME YAPAN SAGLIK PERSONELI',
      },
      {
        id: 'personel_imza',
        label: 'Personel Imzasi',
        type: 'signature',
        section: 'BILGILENDIRME YAPAN SAGLIK PERSONELI',
      },
    ],
  },
  {
    id: 'enjeksiyon',
    title: 'KAS ICI (I.M.) ENJEKSIYON BILGILENDIRILMIS HASTA VE RIZA FORMU',
    subtitle: 'Bilgilendirilmis Hasta ve Riza Formu',
    icon: 'Syringe',
    institution: 'T.C. SAGLIK BAKANLIGI',
    unit: 'ANTALYA KEPEZ 185 NOLU AILE HEKIMLIGI BIRIMI',
    description: [
      'Sayin hasta sizi bilgilendirme amaci ile olusturulmus bu belgeyi dikkatle okuyun. Bu islemi yaptirma yada reddetme hakkinda sahipsiniz.',
    ],
    sections: [
      {
        title: 'GIRISIMIN TANIMI',
        content: [
          'Cok cesitli nedenler ile kas ici enjeksiyon yapilabilir. Bu islem kas icine ilac zerk edilmesi islemidir.',
        ],
      },
      {
        title: 'HASTALIK HAKKINDA BILGI',
        content: [
          'Bazi asilar, agri kesici, ates dusurucu, antibiyotikler ve vitaminler gibi bir cok durumda kas icine enjeksiyon yapilabilir.',
        ],
      },
      {
        title: 'GIRISIM YAPILMADIGINDA NELER OLABILIR',
        content: [
          'Bazi ilaclar sadece kas icine yapilmak uzere hazirlanmistir. Kas icine yapilmasi daha kisa surede etki etmesini saglar.',
        ],
      },
      {
        title: 'GIRISIM NASIL YAPILACAK',
        content: [
          'Kas ici enjeksiyon genelde kalcanin ust dis kismina yapilir. Hekimin gerek duydugu durumlarda veya hastanin istegi uzerine hekim uygun gorurse uyluk ust on kismi ya da olum ust dis kismina da yapilabilir.',
        ],
      },
      {
        title: 'YAN ETKILER',
        content: [
          'Girisimsirasinda kendinizi sikmaz iseniz asagidaki yan etkilerin gorulme ihtimali cok azdir. Bu nedenle girisim sirasinda nefes alip verilmez. Girisim sirasinda ve sonrasinda biraz agri duyulabilir. Nadiren igne yapilan yerde kanama, morarma, enfeksiyon, sinir hasari olusabilir. Cok nadir igne ucu kas icindeki kirilabilir.',
        ],
      },
      {
        title: 'GIRISIM ONCESI HEKIME BILDIRILMESI GEREKEN BILGILER',
        content: [
          'Daha once bu ignenin yapilip yapilmadigi, hastanin kullandigi ilaclar, herhangi bir allerjik yada kanama bozuklugu hastaligi olup olmadigi mutlaka bildirilmelidir.',
        ],
      },
      {
        title: 'GIRISIM SONRASI DIKKAT EDILECEK HUSUSLAR',
        content: [
          'Oneriler disinda onemli hususlar yoktur.',
        ],
      },
      {
        title: 'HASTA, VELI VEYA VASININ ONAM ACIKLAMASI',
        content: [
          'Doktorum bana saglik durumumla ilgili gerekli aciklamayi yapti. Planlanan tedavi ve girisimin ne oldugu, gerekli girisimin seyir ve diger tedavi secenekleri, bunlarin riskleri, tedavi olmadigim zaman ortaya cikabilecek sonuclar, tedavinin basari orani ve yan etkileri hakkinda ayrintili bilgi edindim. Tedavi/girisims Oncesi ve sonrasi dikkat etmem gereken hususlari anladim. Tedavi/girisims sirasinda benimle ilgili tum dokuman ve alinan orneklerin egitim amacli kullanilabilecegi aciklandi ve bu konuda onayim alindi. Doktorum tum sorularimi anlayabilecegim sekilde cevapadi. Tedavi/girisims uygulayacak kisiler hakkinda bilgi edindim. Aklm basimda ve kendimi karar verecek yeterlikte goruyorum. Istemedigim taktirde tedavi/girisime onay vermek zorunda olmadigimi yada istedigim asamada islemi durdurabilecegimi biliyorum.',
        ],
      },
      {
        content: [
          'Lutfan asagiya kendi el yaziniz ile "Hastalik ve tedavi sureci ile ilgili bana anlatilanlari ve okuduklarimi anladim, Gerekli gordugum taktirde bir nushasi almak uzere onayliyorum" Yazin.',
        ],
      },
    ],
    fields: [
      {
        id: 'el_yazisi',
        label: 'El Yazisi ile Onay Metni (Asagidaki cizgili alana kendi el yaziniz ile onay metnini yaziniz)',
        type: 'handwriting',
        section: 'HASTA ONAYI',
      },
      {
        id: 'bilgilendirme_tarih',
        label: 'Bilgilendirme Tarihi',
        type: 'date',
        section: 'BILGILENDIRME',
      },
      {
        id: 'bilgilendirme_saat',
        label: 'Bilgilendirme Saati',
        type: 'text',
        placeholder: 'Orn: 14:30',
        section: 'BILGILENDIRME',
      },
      {
        id: 'hasta_ad_soyad',
        label: 'Hastanin Adi Soyadi',
        type: 'text',
        placeholder: 'Hastanin adi ve soyadi',
        section: 'HASTA',
      },
      {
        id: 'hasta_imza',
        label: 'Hastanin Adi Soyadi Imzasi',
        type: 'signature',
        section: 'HASTA',
      },
      {
        id: 'yakin_ad_soyad',
        label: 'Yakin / Vasi Adi Soyadi',
        type: 'text',
        placeholder: 'Yakin veya vasi adi ve soyadi',
        section: 'YAKIN / VASI',
      },
      {
        id: 'yakin_imza',
        label: 'Yakin / Vasi Imzasi',
        type: 'signature',
        section: 'YAKIN / VASI',
      },
      {
        id: 'personel_imza',
        label: 'Bilgilendirme Yapanin Imzasi',
        type: 'signature',
        section: 'BILGILENDIRME YAPAN',
      },
    ],
  },
];

export function getFormById(id: string): FormDefinition | undefined {
  return forms.find((f) => f.id === id);
}
